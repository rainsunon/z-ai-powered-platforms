package com.xrs.gateway.botdefense;

import com.xrs.gateway.botdefense.model.RequestContext;
import com.xrs.gateway.botdefense.risk.RiskScoringService;
import com.xrs.gateway.botdefense.risk.RiskSignalStore;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Pure unit tests for risk scoring.
 */
class RiskScoringServiceTest {

    @Test
    void shouldIncreaseRiskForBotUa() {
        RiskSignalStore store = Mockito.mock(RiskSignalStore.class);
        Mockito.when(store.incrementIpRequestRate("1.2.3.4")).thenReturn(1L);

        RiskScoringService svc = new RiskScoringService(store);
        RequestContext ctx = new RequestContext("c", "1.2.3.4", "GET", "/api/public/ping", "public", "t1", "u1", "curl/8.0");
        int score = svc.score(ctx);
        assertThat(score).isGreaterThanOrEqualTo(20);
    }
}
