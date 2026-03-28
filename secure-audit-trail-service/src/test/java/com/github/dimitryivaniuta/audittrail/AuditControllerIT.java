package com.github.dimitryivaniuta.audittrail;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.dimitryivaniuta.audittrail.api.dto.CreateAuditRecordRequest;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * End-to-end controller tests (with security).
 */
@SpringBootTest
@AutoConfigureMockMvc
class AuditControllerIT extends PostgresTestBase {

    @Autowired
    MockMvc mvc;

    @Autowired
    ObjectMapper om;

    @Test
    void writer_can_append_auditor_can_read_and_verify() throws Exception {
        var req = new CreateAuditRecordRequest(
                "tenantX",
                UUID.randomUUID(),
                "alice",
                "ORDER_CREATED",
                "ORDER",
                "order-1",
                "corr-123",
                Map.of("amount", 10)
        );

        String json = om.writeValueAsString(req);

        // writer appends
        String response = mvc.perform(post("/api/audit/records")
                        .with(httpBasic("writer", "writer-pass"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tenantId").value("tenantX"))
                .andExpect(jsonPath("$.hash", not(emptyOrNullString())))
                .andReturn()
                .getResponse()
                .getContentAsString();

        long id = om.readTree(response).get("id").asLong();

        // auditor reads
        mvc.perform(get("/api/audit/records/" + id)
                        .with(httpBasic("auditor", "auditor-pass")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.tenantId").value("tenantX"));

        // auditor verifies
        mvc.perform(get("/api/audit/verify")
                        .param("tenantId", "tenantX")
                        .with(httpBasic("auditor", "auditor-pass")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ok").value(true))
                .andExpect(jsonPath("$.recordsChecked").value(greaterThanOrEqualTo(1)));

        // export CSV
        mvc.perform(get("/api/audit/export")
                        .param("tenantId", "tenantX")
                        .with(httpBasic("auditor", "auditor-pass")))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", containsString("text/csv")))
                .andExpect(content().string(containsString("id,tenantId,eventId")))
                .andExpect(content().string(containsString("tenantX")));
    }

    @Test
    void auditor_cannot_append_writer_cannot_read() throws Exception {
        var req = new CreateAuditRecordRequest(
                "tenantY",
                null,
                "svc",
                "X",
                "T",
                "R",
                null,
                Map.of()
        );

        mvc.perform(post("/api/audit/records")
                        .with(httpBasic("auditor", "auditor-pass"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsString(req)))
                .andExpect(status().isForbidden());

        mvc.perform(get("/api/audit/records/1")
                        .with(httpBasic("writer", "writer-pass")))
                .andExpect(status().isForbidden());
    }
}
