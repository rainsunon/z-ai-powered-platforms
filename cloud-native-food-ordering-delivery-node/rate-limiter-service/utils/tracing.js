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
export const setupTracing = (serviceName = 'rate-limiter-service') => {
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

export default {
  setupTracing,
};
