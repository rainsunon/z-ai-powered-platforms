import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { trace } from '@opentelemetry/api';

// Initialize tracer provider
const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'admin-service',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  }),
});

// Configure Jaeger exporter
const exporter = new JaegerExporter({
  endpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
});

// Add span processor
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

// Register the tracer provider
provider.register();

// Get tracer
const tracer = trace.getTracer('admin-service-tracer');

/**
 * Create a span for a function
 * @param {string} name - Span name
 * @param {Function} fn - Function to trace
 * @returns {Promise<any>} Result of the function
 */
export const traceAsync = async (name, fn) => {
  const span = tracer.startSpan(name);
  
  try {
    const result = await fn();
    span.setStatus({ code: 0 }); // OK
    return result;
  } catch (error) {
    span.setStatus({
      code: 1, // ERROR
      message: error.message,
    });
    span.recordException(error);
    throw error;
  } finally {
    span.end();
  }
};

/**
 * Create a span for a synchronous function
 * @param {string} name - Span name
 * @param {Function} fn - Function to trace
 * @returns {any} Result of the function
 */
export const traceSync = (name, fn) => {
  const span = tracer.startSpan(name);
  
  try {
    const result = fn();
    span.setStatus({ code: 0 }); // OK
    return result;
  } catch (error) {
    span.setStatus({
      code: 1, // ERROR
      message: error.message,
    });
    span.recordException(error);
    throw error;
  } finally {
    span.end();
  }
};

/**
 * Middleware to trace HTTP requests
 */
export const traceHttpRequest = (req, res, next) => {
  const span = tracer.startSpan('http_request', {
    attributes: {
      'http.method': req.method,
      'http.url': req.url,
      'http.route': req.route?.path || req.path,
      'http.user_agent': req.get('user-agent'),
      'http.remote_addr': req.ip,
    },
  });
  
  // Attach span to request for use in controllers
  req.span = span;
  
  // Record response
  res.on('finish', () => {
    span.setAttribute('http.status_code', res.statusCode);
    span.end();
  });
  
  next();
};

/**
 * Middleware to trace database queries
 */
export const traceDbQuery = (operation, collection) => {
  return (req, res, next) => {
    const span = tracer.startSpan('db_query', {
      attributes: {
        'db.operation': operation,
        'db.collection': collection,
        'db.system': 'mongodb',
      },
    });
    
    req.dbSpan = span;
    next();
  };
};

/**
 * Trace cache operations
 */
export const traceCacheOperation = (operation, type) => {
  return (req, res, next) => {
    const span = tracer.startSpan('cache_operation', {
      attributes: {
        'cache.operation': operation,
        'cache.type': type,
      },
    });
    
    req.cacheSpan = span;
    next();
  };
};

/**
 * Trace auth service calls
 */
export const traceAuthServiceCall = (endpoint) => {
  return (req, res, next) => {
    const span = tracer.startSpan('auth_service_call', {
      attributes: {
        'auth.endpoint': endpoint,
        'auth.service': 'auth-service',
      },
    });
    
    req.authSpan = span;
    next();
  };
};

/**
 * Get current tracer
 */
export const getTracer = () => tracer;

export default tracer;
