import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import { getDatabase } from '@cms/database';
import { generateId } from '@cms/utils';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  from: string;
}

let transporter: nodemailer.Transporter | null = null;

export function initEmailTransport(config: EmailConfig): void {
  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.password,
    },
  });
}

function getTransporter(): nodemailer.Transporter {
  if (!transporter) throw new Error('Email transport not initialized');
  return transporter;
}

// Notification templates
const TEMPLATES: Record<string, { subject: string; html: string }> = {
  content_published: {
    subject: 'New content published: {{title}}',
    html: `
      <h2>New Content Published</h2>
      <p><strong>{{title}}</strong> has been published by {{author}}.</p>
      <p><a href="{{url}}">View Content</a></p>
    `,
  },
  comment_created: {
    subject: 'New comment on: {{contentTitle}}',
    html: `
      <h2>New Comment</h2>
      <p><strong>{{author}}</strong> commented on <strong>{{contentTitle}}</strong>:</p>
      <blockquote>{{commentBody}}</blockquote>
      <p><a href="{{url}}">View Comment</a></p>
    `,
  },
  welcome: {
    subject: 'Welcome to {{siteName}}!',
    html: `
      <h2>Welcome, {{name}}!</h2>
      <p>Your account has been created successfully.</p>
      <p><a href="{{loginUrl}}">Get Started</a></p>
    `,
  },
  workflow_action_required: {
    subject: 'Action required: {{workflowName}}',
    html: `
      <h2>Workflow Action Required</h2>
      <p>The workflow <strong>{{workflowName}}</strong> requires your attention.</p>
      <p>Step: <strong>{{stepName}}</strong></p>
      <p><a href="{{url}}">Take Action</a></p>
    `,
  },
};

export async function sendEmail(to: string, templateName: string, data: Record<string, string>): Promise<void> {
  const template = TEMPLATES[templateName];
  if (!template) throw new Error(`Email template "${templateName}" not found`);

  const subjectTemplate = Handlebars.compile(template.subject);
  const htmlTemplate = Handlebars.compile(template.html);

  const mail = getTransporter();
  await mail.sendMail({
    to,
    subject: subjectTemplate(data),
    html: htmlTemplate(data),
  });
}

export async function createNotification(
  userId: string,
  tenantId: string,
  type: string,
  title: string,
  body: string,
  data?: Record<string, unknown>,
  channels: string[] = ['in_app'],
): Promise<void> {
  const db = getDatabase();
  const notificationId = generateId();

  // Check user notification preferences
  const prefs = await db('notification_preferences')
    .where({ user_id: userId })
    .first();

  const enabledChannels = channels.filter((channel) => {
    if (!prefs) return channel === 'in_app'; // Default to in-app only
    const prefKey = `${type}_${channel}`;
    return prefs.preferences?.[prefKey] !== false;
  });

  await db('notifications').insert({
    id: notificationId,
    user_id: userId,
    tenant_id: tenantId,
    type,
    title,
    body,
    data: JSON.stringify(data ?? {}),
    channels: JSON.stringify(enabledChannels),
  });

  // Create delivery records for each channel
  for (const channel of enabledChannels) {
    await db('notification_deliveries').insert({
      notification_id: notificationId,
      channel,
      status: channel === 'in_app' ? 'delivered' : 'pending',
      delivered_at: channel === 'in_app' ? new Date() : null,
    });
  }
}

export async function processNotificationEvent(event: any, logger: any): Promise<void> {
  try {
    const db = getDatabase();

    switch (event.type) {
      case 'CONTENT_PUBLISHED': {
        // Notify editors/admins in the tenant
        const members = await db('tenant_members')
          .join('user_roles', 'tenant_members.user_id', 'user_roles.user_id')
          .join('roles', 'user_roles.role_id', 'roles.id')
          .where({ tenant_id: event.tenantId })
          .whereIn('roles.slug', ['admin', 'editor'])
          .select('tenant_members.user_id');

        for (const member of members) {
          await createNotification(
            member.user_id,
            event.tenantId,
            'content_published',
            'Content Published',
            `"${event.data.title}" has been published`,
            event.data,
            ['in_app', 'email'],
          );
        }
        break;
      }

      case 'COMMENT_CREATED': {
        // Notify content author
        const content = await db('content').where({ id: event.data.contentId }).first();
        if (content && content.author_id !== event.data.authorId) {
          await createNotification(
            content.author_id,
            event.tenantId,
            'comment_created',
            'New Comment',
            'Someone commented on your content',
            event.data,
            ['in_app', 'email'],
          );
        }
        break;
      }

      case 'USER_REGISTERED': {
        await createNotification(
          event.data.userId,
          event.tenantId || 'system',
          'welcome',
          'Welcome!',
          'Your account has been created successfully',
          event.data,
          ['in_app', 'email'],
        );
        break;
      }

      case 'WORKFLOW_STEP_COMPLETED': {
        if (event.data.nextAssigneeId) {
          await createNotification(
            event.data.nextAssigneeId,
            event.tenantId,
            'workflow_action_required',
            'Action Required',
            `Workflow "${event.data.workflowName}" requires your attention`,
            event.data,
            ['in_app', 'email'],
          );
        }
        break;
      }
    }
  } catch (err) {
    logger.error({ err, event }, 'Failed to process notification event');
  }
}
