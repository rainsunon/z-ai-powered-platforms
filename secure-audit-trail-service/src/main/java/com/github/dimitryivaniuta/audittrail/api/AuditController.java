package com.github.dimitryivaniuta.audittrail.api;

import com.github.dimitryivaniuta.audittrail.api.dto.AuditRecordResponse;
import com.github.dimitryivaniuta.audittrail.api.dto.CreateAuditRecordRequest;
import com.github.dimitryivaniuta.audittrail.api.dto.VerificationResponse;
import com.github.dimitryivaniuta.audittrail.domain.AuditRecordEntity;
import com.github.dimitryivaniuta.audittrail.service.AuditRecordService;
import com.github.dimitryivaniuta.audittrail.service.VerificationResult;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

/**
 * Audit API for auditors and writers.
 *
 * <p>Security:</p>
 * <ul>
 *   <li>POST /api/audit/records -> role AUDIT_WRITER</li>
 *   <li>GET /api/audit/** -> role AUDITOR</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/audit")
@Validated
public class AuditController {

    private final AuditRecordService service;
    private final AuditRecordMapper mapper;

    /**
     * Creates controller.
     *
     * @param service service
     * @param mapper mapper
     */
    public AuditController(AuditRecordService service, AuditRecordMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    /**
     * Appends an audit record.
     *
     * @param request request
     * @return created record
     */
    @PostMapping("/records")
    public AuditRecordResponse append(@Valid @RequestBody CreateAuditRecordRequest request) {
        AuditRecordEntity entity = service.append(new AuditRecordService.AppendAuditRecordRequest(
                request.tenantId(),
                request.eventId(),
                request.actor(),
                request.action(),
                request.resourceType(),
                request.resourceId(),
                request.correlationId(),
                request.data()
        ));
        return mapper.toResponse(entity);
    }

    /**
     * Reads an audit record by id.
     *
     * @param id id
     * @return record
     */
    @GetMapping("/records/{id}")
    public AuditRecordResponse get(@PathVariable long id) {
        return mapper.toResponse(service.getById(id));
    }

    /**
     * Searches audit records for a tenant.
     *
     * @param tenantId tenant
     * @param actor optional actor
     * @param action optional action
     * @param fromTs optional from timestamp (ISO-8601)
     * @param toTs optional to timestamp (ISO-8601)
     * @param page page
     * @param size size
     * @return page
     */
    @GetMapping("/records")
    public Page<AuditRecordResponse> search(
            @RequestParam @NotBlank String tenantId,
            @RequestParam(required = false) String actor,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant fromTs,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant toTs,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        PageRequest pr = PageRequest.of(Math.max(0, page), Math.min(500, Math.max(1, size)), Sort.by("id").ascending());
        return service.search(tenantId, actor, action, fromTs, toTs, pr).map(mapper::toResponse);
    }

    /**
     * Verifies integrity of the hash chain for a tenant (and optional id range).
     *
     * @param tenantId tenant
     * @param fromId from id inclusive
     * @param toId to id inclusive
     * @return verification result
     */
    @GetMapping("/verify")
    public VerificationResponse verify(
            @RequestParam @NotBlank String tenantId,
            @RequestParam(required = false) Long fromId,
            @RequestParam(required = false) Long toId
    ) {
        VerificationResult r = service.verify(tenantId, fromId, toId);
        return new VerificationResponse(r.ok(), r.recordsChecked(), r.firstMismatchId(), r.message());
    }

    /**
     * Exports audit records as CSV for auditors.
     *
     * @param tenantId tenant
     * @param fromId from id inclusive
     * @param toId to id inclusive
     * @return response entity with streaming body
     */
    @GetMapping(value = "/export", produces = "text/csv")
    public ResponseEntity<StreamingResponseBody> exportCsv(
            @RequestParam @NotBlank String tenantId,
            @RequestParam(required = false) Long fromId,
            @RequestParam(required = false) Long toId
    ) {
        StreamingResponseBody body = out -> {
            String header = "id,seq,tenantId,eventId,actor,action,resourceType,resourceId,correlationId,createdAt,hashAlg,keyId,prevHash,hash,dataJson\n";
            out.write(header.getBytes(StandardCharsets.UTF_8));

            // Verify chain integrity before exporting.
            var verification = service.verify(tenantId, fromId, toId);
            if (!verification.ok()) {
                String msg = ("# Export aborted: chain verification failed at id=" + verification.firstMismatchId()
                        + " (" + verification.message() + ")\n");
                out.write(msg.getBytes(StandardCharsets.UTF_8));
                return;
            }

            var loaded = service.loadRange(tenantId, fromId, toId);
            for (var r : loaded) {
                String line = csv(
                        String.valueOf(r.getId()),
                        String.valueOf(r.getSeq()),
                        r.getTenantId(),
                        r.getEventId().toString(),
                        r.getActor(),
                        r.getAction(),
                        r.getResourceType(),
                        r.getResourceId(),
                        Optional.ofNullable(r.getCorrelationId()).orElse(""),
                        r.getCreatedAt().toString(),
                        r.getHashAlg(),
                        r.getKeyId(),
                        Optional.ofNullable(r.getPrevHash()).orElse(""),
                        r.getHash(),
                        r.getDataJson()
                );
                out.write(line.getBytes(StandardCharsets.UTF_8));
            }
        };

        String filename = "audit_export_" + tenantId + ".csv";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(new MediaType("text", "csv"))
                .body(body);
    }

    /**
     * Escapes values for CSV and joins with commas.
     *
     * @param cols columns
     * @return csv line with newline
     */
    private static String csv(String... cols) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < cols.length; i++) {
            if (i > 0) sb.append(',');
            sb.append(escape(cols[i]));
        }
        sb.append('\n');
        return sb.toString();
    }

    /**
     * CSV escaping (RFC4180-ish).
     */
    private static String escape(String v) {
        if (v == null) return "";
        boolean needsQuotes = v.contains(",") || v.contains("\"") || v.contains("\n") || v.contains("\r");
        String out = v.replace("\"", "\"\"");
        return needsQuotes ? "\"" + out + "\"" : out;
    }
}
