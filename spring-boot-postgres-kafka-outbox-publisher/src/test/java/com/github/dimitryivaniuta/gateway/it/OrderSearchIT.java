package com.github.dimitryivaniuta.gateway.it;

import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for order search endpoint.
 */
public class OrderSearchIT extends IntegrationTestBase {

    @Autowired
    TestRestTemplate restTemplate;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Test
    void shouldFindOrderByEmailFragment() {
        String id = createOrder("alice@example.com", 10.00);

        var resp = restTemplate.exchange(
                RequestEntity.get("/api/orders/search?q=ali&page=0&size=20").build(),
                String.class
        );

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).contains(id);
        assertThat(resp.getBody()).contains("alice@example.com");
    }

    @Test
    void shouldFindOrderByIdFragment() {
        String id = createOrder("bob@example.com", 20.00);

        String frag = id.substring(0, 8);

        var resp = restTemplate.exchange(
                RequestEntity.get("/api/orders/search?q=" + frag + "&page=0&size=20").build(),
                String.class
        );

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody()).contains(id);
    }

    private String createOrder(String email, double amount) {
        var reqBody = """
                {
                  "customerEmail": "%s",
                  "totalAmount": %.2f
                }
                """.formatted(email, amount);

        var req = RequestEntity
                .post("/api/orders")
                .header("Content-Type", "application/json")
                .body(reqBody);

        var resp = restTemplate.exchange(req, String.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        String body = resp.getBody();
        assertThat(body).contains("\"id\":\"");
        int i = body.indexOf("\"id\":\"") + 6;
        int j = body.indexOf("\"", i);
        String id = body.substring(i, j);

        assertThat(UUID.fromString(id)).isNotNull();
        return id;
    }
}
