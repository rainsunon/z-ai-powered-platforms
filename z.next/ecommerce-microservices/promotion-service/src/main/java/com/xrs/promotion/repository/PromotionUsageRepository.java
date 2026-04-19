package com.xrs.promotion.repository;

import com.xrs.promotion.model.PromotionUsage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PromotionUsageRepository extends JpaRepository<PromotionUsage, Long> {
    boolean existsByPromotionId(Long promotionId);
}
