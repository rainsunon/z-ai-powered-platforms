package com.healthcare.customer.service;

import com.healthcare.customer.common.constants.EligibilityStatus;
import com.healthcare.customer.common.constants.EnrollmentStatus;
import com.healthcare.customer.common.dto.request.EnrollmentRequest;
import com.healthcare.customer.common.dto.response.EligibilityResponse;
import com.healthcare.customer.common.dto.response.EnrollmentResponse;
import com.healthcare.customer.common.model.Customer;
import com.healthcare.customer.common.model.CustomerPlanEnrollment;
import com.healthcare.customer.common.model.EligibilityCheck;
import com.healthcare.customer.dao.repository.CustomerPlanEnrollmentRepository;
import com.healthcare.customer.dao.repository.CustomerRepository;
import com.healthcare.customer.dao.repository.EligibilityCheckRepository;
import com.healthcare.customer.service.mapper.EnrollmentMapper;
import com.healthcare.plans.api.client.PlanApiClient;
import com.healthcare.plans.common.dto.response.PlanDetailResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class EnrollmentServiceImpl implements EnrollmentService {

    private final CustomerRepository customerRepository;
    private final CustomerPlanEnrollmentRepository enrollmentRepository;
    private final EligibilityCheckRepository eligibilityRepository;
    private final EnrollmentMapper enrollmentMapper;
    private final PlanApiClient planApiClient;

    @Override
    public EligibilityResponse checkEligibility(UUID customerId, UUID planId) {
        Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new IllegalArgumentException("Customer not found: " + customerId));

        // Check if there's a valid existing eligibility
        EligibilityCheck existing = eligibilityRepository
            .findValidEligibility(customerId, planId, LocalDateTime.now())
            .orElse(null);

        if (existing != null) {
            return enrollmentMapper.toEligibilityResponse(existing);
        }

        // Get plan details to verify it exists and is active
        PlanDetailResponse plan;
        try {
            plan = planApiClient.getPlanById(planId);
            if (!planApiClient.isPlanActive(planId)) {
                throw new IllegalArgumentException("Plan is not active: " + planId);
            }
        } catch (Exception e) {
            log.error("Failed to retrieve plan details for planId: {}", planId, e);
            throw new IllegalArgumentException("Plan not found or not available: " + planId);
        }

        // Perform new eligibility check
        EligibilityCheck check = EligibilityCheck.builder()
            .customer(customer)
            .planId(planId)
            .checkDate(LocalDateTime.now())
            .expirationDate(LocalDateTime.now().plusDays(30))
            .build();

        // Basic eligibility checks
        boolean ageVerified = verifyAge(customer, plan);
        boolean residenceVerified = verifyResidence(customer, plan);
        boolean incomeVerified = true; // Simplified for now

        check.setAgeVerified(ageVerified);
        check.setResidenceVerified(residenceVerified);
        check.setIncomeVerified(incomeVerified);

        if (ageVerified && residenceVerified) {
            check.setStatus(EligibilityStatus.ELIGIBLE);
            check.setEligibilityReason("Customer meets all eligibility requirements for " + plan.getPlanName());
        } else {
            check.setStatus(EligibilityStatus.NOT_ELIGIBLE);
            StringBuilder reason = new StringBuilder("Not eligible: ");
            if (!ageVerified) reason.append("Age requirements not met. ");
            if (!residenceVerified) reason.append("Residence requirements not met. ");
            check.setEligibilityReason(reason.toString());
        }

        EligibilityCheck savedCheck = eligibilityRepository.save(check);
        log.info("Eligibility check for customer {} and plan {}: {}", customerId, planId, savedCheck.getStatus());

        return enrollmentMapper.toEligibilityResponse(savedCheck);
    }

    @Override
    public EnrollmentResponse enrollCustomer(UUID customerId, EnrollmentRequest request) {
        Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new IllegalArgumentException("Customer not found: " + customerId));

        // Check if already enrolled in this plan
        if (enrollmentRepository.existsByCustomerIdAndPlanIdAndStatus(
                customerId, request.getPlanId(), EnrollmentStatus.ENROLLED)) {
            throw new IllegalArgumentException("Customer is already enrolled in this plan");
        }

        // Verify eligibility
        EligibilityCheck eligibility = eligibilityRepository
            .findValidEligibility(customerId, request.getPlanId(), LocalDateTime.now())
            .orElseThrow(() -> new IllegalArgumentException("No valid eligibility found. Please check eligibility first."));

        if (eligibility.getStatus() != EligibilityStatus.ELIGIBLE) {
            throw new IllegalArgumentException("Customer is not eligible for this plan");
        }

        // Get plan details from plans-service
        PlanDetailResponse plan;
        try {
            plan = planApiClient.getPlanById(request.getPlanId());
            if (!planApiClient.isPlanActive(request.getPlanId())) {
                throw new IllegalArgumentException("Plan is not active: " + request.getPlanId());
            }
        } catch (Exception e) {
            log.error("Failed to retrieve plan details for enrollment, planId: {}", request.getPlanId(), e);
            throw new IllegalArgumentException("Plan not found or not available: " + request.getPlanId());
        }

        CustomerPlanEnrollment enrollment = CustomerPlanEnrollment.builder()
            .customer(customer)
            .planId(request.getPlanId())
            .planCode(plan.getPlanCode())
            .planName(plan.getPlanName())
            .status(EnrollmentStatus.ENROLLED)
            .effectiveDate(request.getEffectiveDate())
            .memberId(generateMemberId(customer))
            .groupNumber("GRP" + LocalDate.now().getYear())
            .includeDependents(Boolean.TRUE.equals(request.getIncludeDependents()))
            .autoRenew(Boolean.TRUE.equals(request.getAutoRenew()))
            .build();

        CustomerPlanEnrollment savedEnrollment = enrollmentRepository.save(enrollment);
        log.info("Enrolled customer {} in plan {} ({})", customerId, plan.getPlanCode(), plan.getPlanName());

        return enrollmentMapper.toEnrollmentResponse(savedEnrollment);
    }

    @Override
    @Transactional(readOnly = true)
    public EnrollmentResponse getEnrollmentById(UUID enrollmentId) {
        CustomerPlanEnrollment enrollment = enrollmentRepository.findById(enrollmentId)
            .orElseThrow(() -> new IllegalArgumentException("Enrollment not found: " + enrollmentId));
        return enrollmentMapper.toEnrollmentResponse(enrollment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getCustomerEnrollments(UUID customerId) {
        return enrollmentRepository.findByCustomerId(customerId).stream()
            .map(enrollmentMapper::toEnrollmentResponse)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getActiveEnrollments(UUID customerId) {
        return enrollmentRepository.findActiveEnrollments(customerId, LocalDate.now()).stream()
            .map(enrollmentMapper::toEnrollmentResponse)
            .collect(Collectors.toList());
    }

    @Override
    public void cancelEnrollment(UUID customerId, UUID enrollmentId, String reason) {
        CustomerPlanEnrollment enrollment = enrollmentRepository.findById(enrollmentId)
            .orElseThrow(() -> new IllegalArgumentException("Enrollment not found: " + enrollmentId));

        if (!enrollment.getCustomer().getId().equals(customerId)) {
            throw new IllegalArgumentException("Enrollment does not belong to customer");
        }

        enrollment.setStatus(EnrollmentStatus.CANCELLED);
        enrollment.setCancellationReason(reason);
        enrollment.setTerminationDate(LocalDate.now());
        enrollmentRepository.save(enrollment);

        log.info("Cancelled enrollment {} for customer {} - Reason: {}", enrollmentId, customerId, reason);
    }

    @Override
    public void terminateEnrollment(UUID customerId, UUID enrollmentId, String reason) {
        CustomerPlanEnrollment enrollment = enrollmentRepository.findById(enrollmentId)
            .orElseThrow(() -> new IllegalArgumentException("Enrollment not found: " + enrollmentId));

        if (!enrollment.getCustomer().getId().equals(customerId)) {
            throw new IllegalArgumentException("Enrollment does not belong to customer");
        }

        enrollment.setStatus(EnrollmentStatus.TERMINATED);
        enrollment.setCancellationReason(reason);
        enrollment.setTerminationDate(LocalDate.now());
        enrollmentRepository.save(enrollment);

        log.info("Terminated enrollment {} for customer {} - Reason: {}", enrollmentId, customerId, reason);
    }

    /**
     * Verify customer age meets plan requirements
     */
    private boolean verifyAge(Customer customer, PlanDetailResponse plan) {
        if (customer.getDateOfBirth() == null) {
            return false;
        }
        
        int age = LocalDate.now().getYear() - customer.getDateOfBirth().getYear();
        
        // Basic age validation
        if (age < 0 || age > 120) {
            return false;
        }
        
        // Check if customer age matches plan's age groups
        if (plan.getAgeGroups() != null && !plan.getAgeGroups().isEmpty()) {
            String ageGroup = determineAgeGroup(age);
            return plan.getAgeGroups().contains(ageGroup);
        }
        
        return true;
    }

    /**
     * Verify customer residence meets plan requirements
     */
    private boolean verifyResidence(Customer customer, PlanDetailResponse plan) {
        if (customer.getAddresses() == null || customer.getAddresses().isEmpty()) {
            return false;
        }
        
        // If plan is national, residence verification is simpler
        if (Boolean.TRUE.equals(plan.getIsNational())) {
            return true;
        }
        
        // Check if customer's state matches plan's state
        return customer.getAddresses().stream()
            .anyMatch(address -> plan.getStateCode().equals(address.getState()));
    }

    /**
     * Determine age group for a given age
     */
    private String determineAgeGroup(int age) {
        if (age < 18) return "0-17";
        if (age < 26) return "18-25";
        if (age < 46) return "26-45";
        if (age < 65) return "46-64";
        return "65+";
    }

    /**
     * Generate unique member ID for customer
     */
    private String generateMemberId(Customer customer) {
        return "MBR" + customer.getCustomerNumber() + LocalDate.now().getYear();
    }
}
