import { FastifyInstance } from 'fastify';
import { getConfig } from '@cms/config';
import { getDatabase, withTransaction, paginate, PaginationParams } from '@cms/database';
import { createAuthMiddleware, requirePermissions, AuthenticatedRequest } from '@cms/auth';
import { NotFoundError, ForbiddenError, ValidationError } from '@cms/errors';
import { paginationSchema, validate } from '@cms/validation';
import { EventType, getEventBus, createEvent } from '@cms/messaging';
import { generateId } from '@cms/utils';

export async function workflowRoutes(app: FastifyInstance) {
  const config = getConfig();
  const authenticate = createAuthMiddleware(config.jwt.secret);

  // ─── CRUD workflow definitions ─────

  // POST / (create workflow)
  app.post('/', { preHandler: [authenticate, requirePermissions('settings.manage')] }, async (request, reply) => {
    const user = (request as AuthenticatedRequest).user;
    const body = request.body as {
      name: string;
      description?: string;
      contentType?: string;
      steps: Array<{ name: string; type: string; assigneeRole?: string; config?: Record<string, unknown> }>;
    };

    if (!body.name || !body.steps?.length) {
      throw new ValidationError('name and steps are required');
    }

    const result = await withTransaction(async (trx) => {
      const workflowId = generateId();

      const [workflow] = await trx('workflows')
        .insert({
          id: workflowId,
          tenant_id: user.tenantId,
          name: body.name,
          description: body.description || null,
          content_type: body.contentType || null,
          is_active: true,
          created_by: user.userId,
        })
        .returning('*');

      // Create steps
      const steps = [];
      for (let i = 0; i < body.steps.length; i++) {
        const step = body.steps[i];
        const [created] = await trx('workflow_steps')
          .insert({
            id: generateId(),
            workflow_id: workflowId,
            name: step.name,
            step_type: step.type, // review, approval, publish, custom
            sort_order: i,
            assignee_role: step.assigneeRole || null,
            config: JSON.stringify(step.config ?? {}),
          })
          .returning('*');
        steps.push(created);
      }

      // Create transitions between steps
      for (let i = 0; i < steps.length - 1; i++) {
        await trx('workflow_transitions').insert({
          workflow_id: workflowId,
          from_step_id: steps[i].id,
          to_step_id: steps[i + 1].id,
          trigger: 'approve',
        });
      }

      return { ...workflow, steps };
    });

    return reply.status(201).send({ workflow: result });
  });

  // GET / (list workflows)
  app.get('/', { preHandler: [authenticate] }, async (request) => {
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    const workflows = await db('workflows')
      .where({ tenant_id: user.tenantId })
      .orderBy('created_at', 'desc');

    return { workflows };
  });

  // GET /:id
  app.get<{ Params: { id: string } }>('/:id', { preHandler: [authenticate] }, async (request) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    const workflow = await db('workflows')
      .where({ id, tenant_id: user.tenantId })
      .first();

    if (!workflow) throw new NotFoundError('Workflow', id);

    const steps = await db('workflow_steps')
      .where({ workflow_id: id })
      .orderBy('sort_order');

    const transitions = await db('workflow_transitions')
      .where({ workflow_id: id });

    return { workflow: { ...workflow, steps, transitions } };
  });

  // DELETE /:id
  app.delete<{ Params: { id: string } }>('/:id', { preHandler: [authenticate, requirePermissions('settings.manage')] }, async (request, reply) => {
    const { id } = request.params;
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    // Check for active instances
    const activeInstances = await db('workflow_instances')
      .where({ workflow_id: id, status: 'active' })
      .count('* as count');

    if (Number(activeInstances[0].count) > 0) {
      throw new ValidationError('Cannot delete workflow with active instances');
    }

    await db('workflows')
      .where({ id, tenant_id: user.tenantId })
      .update({ is_active: false });

    return reply.status(204).send();
  });

  // ─── Workflow instances ─────

  // POST /:id/instances (start workflow for content)
  app.post<{ Params: { id: string } }>(
    '/:id/instances',
    { preHandler: [authenticate] },
    async (request, reply) => {
      const { id: workflowId } = request.params;
      const user = (request as AuthenticatedRequest).user;
      const { contentId } = request.body as { contentId: string };
      const db = getDatabase();

      if (!contentId) throw new ValidationError('contentId is required');

      const workflow = await db('workflows').where({ id: workflowId, tenant_id: user.tenantId }).first();
      if (!workflow) throw new NotFoundError('Workflow', workflowId);

      const firstStep = await db('workflow_steps')
        .where({ workflow_id: workflowId })
        .orderBy('sort_order')
        .first();

      if (!firstStep) throw new ValidationError('Workflow has no steps');

      const result = await withTransaction(async (trx) => {
        const instanceId = generateId();

        const [instance] = await trx('workflow_instances')
          .insert({
            id: instanceId,
            workflow_id: workflowId,
            content_id: contentId,
            current_step_id: firstStep.id,
            status: 'active',
            started_by: user.userId,
          })
          .returning('*');

        // Create step instance for the first step
        await trx('workflow_step_instances').insert({
          id: generateId(),
          workflow_instance_id: instanceId,
          step_id: firstStep.id,
          status: 'pending',
          assigned_to: null, // Will be assigned based on role
        });

        return instance;
      });

      const eventBus = getEventBus();
      await eventBus.publish(
        createEvent(EventType.WORKFLOW_STARTED, user.tenantId, {
          instanceId: result.id, workflowId, contentId, workflowName: workflow.name,
        }, { userId: user.userId, source: 'workflow-service' }),
      );

      return reply.status(201).send({ instance: result });
    },
  );

  // GET /:id/instances
  app.get<{ Params: { id: string } }>(
    '/:id/instances',
    { preHandler: [authenticate] },
    async (request) => {
      const { id: workflowId } = request.params;
      const user = (request as AuthenticatedRequest).user;
      const params = validate(paginationSchema, request.query) as PaginationParams;
      const db = getDatabase();

      const baseQuery = db('workflow_instances')
        .join('content', 'workflow_instances.content_id', 'content.id')
        .where({ 'workflow_instances.workflow_id': workflowId })
        .select(
          'workflow_instances.*',
          'content.title as content_title',
          'content.slug as content_slug',
        )
        .orderBy('workflow_instances.created_at', 'desc');

      return paginate(baseQuery, params);
    },
  );

  // POST /instances/:instanceId/approve (advance workflow)
  app.post<{ Params: { instanceId: string } }>(
    '/instances/:instanceId/approve',
    { preHandler: [authenticate] },
    async (request, reply) => {
      const { instanceId } = request.params;
      const user = (request as AuthenticatedRequest).user;
      const { comment } = request.body as { comment?: string };
      const db = getDatabase();

      const instance = await db('workflow_instances').where({ id: instanceId }).first();
      if (!instance) throw new NotFoundError('Workflow instance', instanceId);
      if (instance.status !== 'active') throw new ValidationError('Workflow is not active');

      const currentStep = await db('workflow_steps').where({ id: instance.current_step_id }).first();

      // Check authorization (assignee role check)
      if (currentStep.assignee_role) {
        const hasRole = await db('user_roles')
          .join('roles', 'user_roles.role_id', 'roles.id')
          .where({ 'user_roles.user_id': user.userId, 'roles.slug': currentStep.assignee_role })
          .first();

        if (!hasRole && user.role !== 'super_admin') {
          throw new ForbiddenError('You do not have the required role for this step');
        }
      }

      const result = await withTransaction(async (trx) => {
        // Complete current step
        await trx('workflow_step_instances')
          .where({ workflow_instance_id: instanceId, step_id: instance.current_step_id })
          .update({
            status: 'approved',
            completed_by: user.userId,
            completed_at: new Date(),
            comment: comment || null,
          });

        // Find next transition
        const transition = await trx('workflow_transitions')
          .where({ workflow_id: instance.workflow_id, from_step_id: instance.current_step_id, trigger: 'approve' })
          .first();

        if (transition) {
          // Move to next step
          await trx('workflow_instances')
            .where({ id: instanceId })
            .update({ current_step_id: transition.to_step_id });

          const [stepInstance] = await trx('workflow_step_instances')
            .insert({
              id: generateId(),
              workflow_instance_id: instanceId,
              step_id: transition.to_step_id,
              status: 'pending',
            })
            .returning('*');

          return { status: 'advanced', nextStepId: transition.to_step_id };
        } else {
          // Workflow completed
          await trx('workflow_instances')
            .where({ id: instanceId })
            .update({ status: 'completed', completed_at: new Date() });

          return { status: 'completed' };
        }
      });

      const eventBus = getEventBus();
      await eventBus.publish(
        createEvent(EventType.WORKFLOW_STEP_COMPLETED, user.tenantId, {
          instanceId, stepId: instance.current_step_id, action: 'approve',
        }, { userId: user.userId, source: 'workflow-service' }),
      );

      if (result.status === 'completed') {
        await eventBus.publish(
          createEvent(EventType.WORKFLOW_COMPLETED, user.tenantId, {
            instanceId, contentId: instance.content_id,
          }, { userId: user.userId, source: 'workflow-service' }),
        );
      }

      return reply.send(result);
    },
  );

  // POST /instances/:instanceId/reject
  app.post<{ Params: { instanceId: string } }>(
    '/instances/:instanceId/reject',
    { preHandler: [authenticate] },
    async (request, reply) => {
      const { instanceId } = request.params;
      const user = (request as AuthenticatedRequest).user;
      const { comment } = request.body as { comment?: string };
      const db = getDatabase();

      const instance = await db('workflow_instances').where({ id: instanceId }).first();
      if (!instance) throw new NotFoundError('Workflow instance', instanceId);
      if (instance.status !== 'active') throw new ValidationError('Workflow is not active');

      await withTransaction(async (trx) => {
        await trx('workflow_step_instances')
          .where({ workflow_instance_id: instanceId, step_id: instance.current_step_id })
          .update({
            status: 'rejected',
            completed_by: user.userId,
            completed_at: new Date(),
            comment: comment || null,
          });

        await trx('workflow_instances')
          .where({ id: instanceId })
          .update({ status: 'rejected', completed_at: new Date() });
      });

      const eventBus = getEventBus();
      await eventBus.publish(
        createEvent(EventType.WORKFLOW_STEP_COMPLETED, user.tenantId, {
          instanceId, stepId: instance.current_step_id, action: 'reject',
        }, { userId: user.userId, source: 'workflow-service' }),
      );

      return reply.send({ status: 'rejected' });
    },
  );

  // GET /instances/:instanceId/history
  app.get<{ Params: { instanceId: string } }>(
    '/instances/:instanceId/history',
    { preHandler: [authenticate] },
    async (request) => {
      const { instanceId } = request.params;
      const db = getDatabase();

      const history = await db('workflow_step_instances')
        .join('workflow_steps', 'workflow_step_instances.step_id', 'workflow_steps.id')
        .leftJoin('users', 'workflow_step_instances.completed_by', 'users.id')
        .where({ 'workflow_step_instances.workflow_instance_id': instanceId })
        .select(
          'workflow_step_instances.*',
          'workflow_steps.name as step_name',
          'workflow_steps.step_type',
          'users.display_name as completed_by_name',
        )
        .orderBy('workflow_step_instances.created_at');

      return { history };
    },
  );

  // GET /my-tasks (items waiting for current user)
  app.get('/my-tasks', { preHandler: [authenticate] }, async (request) => {
    const user = (request as AuthenticatedRequest).user;
    const db = getDatabase();

    // Get user's roles
    const userRoles = await db('user_roles')
      .join('roles', 'user_roles.role_id', 'roles.id')
      .where({ 'user_roles.user_id': user.userId })
      .pluck('roles.slug');

    // Find pending steps that match user's roles
    const tasks = await db('workflow_step_instances')
      .join('workflow_steps', 'workflow_step_instances.step_id', 'workflow_steps.id')
      .join('workflow_instances', 'workflow_step_instances.workflow_instance_id', 'workflow_instances.id')
      .join('workflows', 'workflow_instances.workflow_id', 'workflows.id')
      .join('content', 'workflow_instances.content_id', 'content.id')
      .where({ 'workflow_step_instances.status': 'pending' })
      .where({ 'workflows.tenant_id': user.tenantId })
      .where(function () {
        this.whereIn('workflow_steps.assignee_role', userRoles)
          .orWhereNull('workflow_steps.assignee_role');
      })
      .select(
        'workflow_step_instances.*',
        'workflow_steps.name as step_name',
        'workflow_steps.step_type',
        'workflows.name as workflow_name',
        'content.title as content_title',
        'content.slug as content_slug',
        'workflow_instances.id as instance_id',
      )
      .orderBy('workflow_step_instances.created_at');

    return { tasks };
  });
}
