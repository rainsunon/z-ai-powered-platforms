package com.github.dimitryivaniuta.audittrail.api.dto;

/**
 * REST response for verification.
 *
 * @param ok ok flag
 * @param recordsChecked number of records checked
 * @param firstMismatchId first mismatch id
 * @param message message
 */
public record VerificationResponse(
        boolean ok,
        Integer recordsChecked,
        Long firstMismatchId,
        String message
) {
}
