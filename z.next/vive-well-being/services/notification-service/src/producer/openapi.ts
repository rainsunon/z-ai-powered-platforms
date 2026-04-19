import type { Env } from "hono";

/**
 * OpenAPI 3.1 specification for the Notification Service Publisher API.
 */
export function getOpenAPISpec(basePath = "/api/v1") {
  return {
    openapi: "3.1.0",
    info: {
      title: "Vive Notification Service",
      version: "0.0.1",
      description:
        "Event-driven notification service. Publish events to RabbitMQ for async delivery via EMAIL, SMS, or PUSH channels.",
      contact: { name: "Vive Platform Team" },
    },
    servers: [{ url: basePath, description: "API v1" }],
    security: [{ ApiKeyAuth: [] }],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
          description: "API key passed in the `x-api-key` header",
        },
      },
      schemas: {
        PublishEvent: {
          type: "object",
          required: ["event_id", "event_type", "user_id", "payload"],
          properties: {
            event_id: {
              type: "string",
              minLength: 1,
              description: "Globally unique idempotency key for this event",
              example: "evt_abc123",
            },
            event_type: {
              type: "string",
              minLength: 1,
              description:
                "Type of event (e.g. WELCOME, PASSWORD_RESET, OTP_REQUEST)",
              example: "WELCOME",
            },
            user_id: {
              type: "string",
              minLength: 1,
              description: "Target user ID",
              example: "user_42",
            },
            payload: { $ref: "#/components/schemas/EventPayload" },
          },
        },
        EventPayload: {
          type: "object",
          required: ["body"],
          properties: {
            subject: {
              type: "string",
              description: "Notification subject (used in email)",
              example: "Welcome to Vive",
            },
            body: {
              type: "string",
              description: "Notification body content",
              example: "Hello! Your account has been created.",
            },
            metadata: {
              type: "object",
              additionalProperties: true,
              description: "Arbitrary key-value metadata",
              example: { template: "welcome_v2" },
            },
          },
        },
        PublishEventSuccess: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Event accepted and queued" },
            id: {
              type: "string",
              format: "uuid",
              example: "550e8400-e29b-41d4-a716-446655440000",
            },
          },
        },
        DuplicateEvent: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: {
              type: "string",
              example: "Duplicate event_id, already received",
            },
          },
        },
        Notification: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            eventId: { type: "string" },
            userId: { type: "string" },
            channel: {
              type: "string",
              enum: ["EMAIL", "SMS", "PUSH"],
            },
            status: {
              type: "string",
              enum: ["PENDING", "SENT", "FAILED"],
            },
            errorMessage: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ErrorUnauthorized: {
          type: "object",
          properties: {
            error: {
              type: "string",
              example: "Unauthorized: invalid or missing API key",
            },
          },
        },
        ErrorNotFound: {
          type: "object",
          properties: {
            error: { type: "string", example: "Notification not found" },
          },
        },
        ErrorValidation: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: { type: "object" },
          },
        },
        HealthResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "ok" },
            service: {
              type: "string",
              example: "notification-publisher",
            },
            timestamp: { type: "string", format: "date-time" },
          },
        },
      },
    },
    paths: {
      "/events": {
        post: {
          operationId: "publishEvent",
          summary: "Publish a notification event",
          description:
            "Accepts the event, persists it as PENDING, publishes to RabbitMQ, and returns 202. Duplicate `event_id` values are rejected with 409.",
          tags: ["Events"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PublishEvent" },
              },
            },
          },
          responses: {
            "202": {
              description: "Event accepted and queued",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/PublishEventSuccess",
                  },
                },
              },
            },
            "400": {
              description: "Validation error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorValidation" },
                },
              },
            },
            "401": {
              description: "Unauthorized — missing or invalid API key",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorUnauthorized",
                  },
                },
              },
            },
            "409": {
              description: "Duplicate event_id",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/DuplicateEvent" },
                },
              },
            },
          },
        },
      },
      "/notifications/{id}": {
        get: {
          operationId: "getNotification",
          summary: "Get a notification by ID",
          description: "Retrieves a single notification record by UUID.",
          tags: ["Notifications"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Notification UUID",
            },
          ],
          responses: {
            "200": {
              description: "Notification found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Notification" },
                },
              },
            },
            "401": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorUnauthorized",
                  },
                },
              },
            },
            "404": {
              description: "Notification not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorNotFound" },
                },
              },
            },
          },
        },
      },
    },
  } as const;
}
