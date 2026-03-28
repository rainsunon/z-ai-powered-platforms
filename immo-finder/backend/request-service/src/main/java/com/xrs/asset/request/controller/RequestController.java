package com.xrs.asset.request.controller;


import jakarta.validation.Valid;
import com.xrs.asset.request.service.RequestService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/request")
public class RequestController {
    private final RequestService requestService;
    public RequestController(RequestService requestService){
        this.requestService = requestService;
    }
    @PostMapping
    public ResponseEntity<ResponseDTO> addRequest(@Valid @RequestBody RequestDTO requestDTO) {
        ResponseDTO response =  requestService.addRequest(requestDTO);
        return ResponseEntity.ok(response);
    }
    @GetMapping
    public Page<ResponseDTO> getRequests(RequestFilter filter, Pageable pageable) {
        return requestService.getRequests(filter, pageable);
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('IT') || hasAuthority('ADMIN')")
    public ResponseEntity<ResponseDTO> approveRequest(
            @PathVariable Long id,
            @Valid @RequestBody ApproveRequestDTO dto) {
        return ResponseEntity.ok(requestService.approveRequest(id, dto));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAuthority('IT') || hasAuthority('ADMIN')")
    public ResponseEntity<ResponseDTO> rejectRequest(
            @PathVariable Long id,
            @Valid @RequestBody RejectRequestDTO dto) {
        return ResponseEntity.ok(requestService.rejectRequest(id, dto));
    }

    /**
     * Get request statistics - used by Dashboard Service
     */
    @GetMapping("/stats")
    public ResponseEntity<java.util.Map<String, Long>> getRequestStats() {
        java.util.Map<String, Long> stats = requestService.getRequestStats();
        return ResponseEntity.ok(stats);
    }
}
