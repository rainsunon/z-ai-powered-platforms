package com.github.dimitryivaniuta.multitenant.observability;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import org.slf4j.MDC;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Correlation id filter.
 *
 * <p>Reads {@code X-Correlation-Id} from the request (if present) or generates a new UUID.
 * The value is:
 * <ul>
 *   <li>put into MDC as {@link MdcKeys#CORRELATION_ID}</li>
 *   <li>returned in the response header {@code X-Correlation-Id}</li>
 * </ul>
 */
public class CorrelationIdFilter extends OncePerRequestFilter {

  /** HTTP header used for correlation id. */
  public static final String HEADER = "X-Correlation-Id";

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain
  ) throws ServletException, IOException {

    String correlationId = request.getHeader(HEADER);
    if (!StringUtils.hasText(correlationId)) {
      correlationId = UUID.randomUUID().toString();
    }

    try {
      MDC.put(MdcKeys.CORRELATION_ID, correlationId);
      response.setHeader(HEADER, correlationId);
      filterChain.doFilter(request, response);
    } finally {
      MDC.remove(MdcKeys.CORRELATION_ID);
    }
  }
}
