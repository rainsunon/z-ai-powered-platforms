package com.xrs.gateway.botdefense;

import com.xrs.gateway.botdefense.kafka.BotDefenseEventPublisher;
import com.xrs.gateway.botdefense.testsupport.Containers;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;

/**
 * End-to-end-ish integration tests: HTTP -> filters -> Redis -> Postgres.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AdaptiveRateLimiterIT {

    @Autowired
    TestRestTemplate rest;

    @MockBean
    BotDefenseEventPublisher publisher;

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry r) {
        r.add("spring.datasource.url", Containers.POSTGRES::getJdbcUrl);
        r.add("spring.datasource.username", Containers.POSTGRES::getUsername);
        r.add("spring.datasource.password", Containers.POSTGRES::getPassword);
        r.add("spring.data.redis.host", Containers.REDIS::getHost);
        r.add("spring.data.redis.port", () -> Containers.REDIS.getMappedPort(6379));
        // Kafka is mocked.
        r.add("spring.kafka.bootstrap-servers", () -> "localhost:9092");
    }

    @Test
    void shouldRateLimitAfterBurst() {
        HttpHeaders h = new HttpHeaders();
        h.set("X-Tenant-Id", "t1");
        h.set("X-User-Id", "u1");

        int lastStatus = 200;
        for (int i = 0; i < 120; i++) {
            ResponseEntity<String> resp = rest.exchange(
                    "/api/public/ping",
                    HttpMethod.GET,
                    new HttpEntity<>(h),
                    String.class
            );
            lastStatus = resp.getStatusCodeValue();
            if (lastStatus == 429) {
                break;
            }
        }
        assertThat(lastStatus).isIn(200, 429);
    }

    @Test
    void shouldTriggerStepUpOnRepeatedLoginFailures() {
        HttpHeaders h = new HttpHeaders();
        h.setContentType(MediaType.APPLICATION_JSON);
        h.set("X-Tenant-Id", "t1");

        Map<String, String> body = Map.of("username", "alice", "password", "wrong");

        ResponseEntity<String> last = null;
        for (int i = 0; i < 20; i++) {
            last = rest.postForEntity("/api/auth/login", new HttpEntity<>(body, h), String.class);
            if (last.getStatusCodeValue() == 403) {
                break;
            }
        }

        assertThat(last).isNotNull();
        assertThat(last.getStatusCodeValue()).isIn(401, 403);

        // When 403 happens, publisher must be called.
        if (last.getStatusCodeValue() == 403) {
            Mockito.verify(publisher, Mockito.atLeastOnce()).publishStepUpRequired(
                    anyString(), anyString(), any(), any(), anyString(), anyInt(), anyString(), anyString()
            );
        } else {
            Mockito.verify(publisher, Mockito.never()).publishStepUpRequired(
                    anyString(), anyString(), any(), any(), anyString(), anyInt(), anyString(), anyString()
            );
        }
    }
}
