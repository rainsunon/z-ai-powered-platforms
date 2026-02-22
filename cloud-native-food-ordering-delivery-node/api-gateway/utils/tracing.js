import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-trace-jaeger';
import { registerInstrumentations } from '@opentelemetry/auto-instrumentations-node';

/**
 * Setup OpenTelemetry tracing with Jaeger exporter
 * @param {string} serviceName - Name of the service
 */
export const setupTracing = (serviceName = 'api-gateway') => {
  const jaegerExporter = new JaegerExporter({
    endpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
  });

  const tracerProvider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
      [SemanticResourceAttributes.SERVICE_VERSION]: process.env.SERVICE_VERSION || '1.0.0',
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
    }),
  });

  tracerProvider.addSpanProcessor(new SimpleSpanProcessor(jaegerExporter));

  // Register auto-instrumentations for automatic tracing
  registerInstrumentations({
    tracerProvider,
  });

  console.log(`✅ OpenTelemetry tracing enabled for ${serviceName}`);
  console.log(`   Jaeger Endpoint: ${process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces'}`);
};

/**
 * Create a span for manual tracing
 * @param {string} name - Span name
 * @param {Object} options - Span options
 * @returns {Object} Span object
 */
export const createSpan = (name, options = {}) => {
  const tracer = opentelemetry.trace.getTracer('api-gateway');
  return tracer.startSpan(name, {
    kind: options.kind || opentelemetry.SpanKind.SERVER,
    attributes: options.attributes || {},
  });
};

/**
 * Add attributes to current span
 * @param {Object} attributes - Attributes to add
 */
export const addSpanAttributes = (attributes) => {
  const span = opentelemetry.trace.getActiveSpan();
  if (span) {
    span.setAttributes(attributes);
  }
};

/**
 * Record error in current span
 * @param {Error} error - Error to record
 */
export const recordError = (error) => {
  const span = opentelemetry.trace.getActiveSpan();
  if (span) {
    span.recordException(error);
    span.setStatus({
      code: opentelemetry.SpanStatusCode.ERROR,
      message: error.message,
    });
  }
};

/**
 * End current span successfully
 * @param {Object} attributes - Optional attributes to add before ending
 */
export const endSpan = (attributes = {}) => {
  const span = opentelemetry.trace.getActiveSpan();
  if (span) {
    if (Object.keys(attributes).length > 0) {
      span.setAttributes(attributes);
    }
    span.setStatus({
      code: opentelemetry.SpanStatusCode.OK,
    });
    span.end();
  }
};

export default {
  setupTracing,
  createSpan,
  addSpanAttributes,
  recordError,
  endSpan,
};
