package com.github.dimitryivaniuta.audittrail.service;

/**
 * Result of a hash chain verification.
 *
 * @param ok whether verification passed
 * @param recordsChecked number of records checked (when ok)
 * @param firstMismatchId first record id with mismatch (when not ok)
 * @param message details
 */
public record VerificationResult(
        boolean ok,
        Integer recordsChecked,
        Long firstMismatchId,
        String message
) {

    /**
     * Successful result.
     *
     * @param recordsChecked number of records checked
     * @return result
     */
    public static VerificationResult ok(int recordsChecked) {
        return new VerificationResult(true, recordsChecked, null, "OK");
    }

    /**
     * Failure result.
     *
     * @param id mismatch id
     * @param message message
     * @return result
     */
    public static VerificationResult mismatch(Long id, String message) {
        return new VerificationResult(false, null, id, message);
    }
}
