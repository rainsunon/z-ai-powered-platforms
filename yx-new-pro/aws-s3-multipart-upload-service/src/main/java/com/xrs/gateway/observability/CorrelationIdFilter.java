package com.xrs.gateway.observability;

import java.io.IOException;
import java.util.UUID;
import java.util.regex.Pattern;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Adds a correlation id to every request/response and stores it in MDC for logging.
 *
 * <p>Clients may pass X-Correlation-Id; otherwise one is generated.</p>
 */
@Component
public class CorrelationIdFilter extends OncePerRequestFilter {

  public static final String HEADER = "X-Correlation-Id";
  public static final String MDC_KEY = "correlationId";

  private static final Pattern SAFE = Pattern.compile("^[a-zA-Z0-9._-]{1,64}$");

  @Override
  protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {
    String incoming = request.getHeader(HEADER);
    String cid = (incoming != null && SAFE.matcher(incoming).matches())
      ? incoming
      : UUID.randomUUID().toString();

    MDC.put(MDC_KEY, cid);
    response.setHeader(HEADER, cid);

    try {
      filterChain.doFilter(request, response);
    } finally {
      MDC.remove(MDC_KEY);
    }
  }
}
