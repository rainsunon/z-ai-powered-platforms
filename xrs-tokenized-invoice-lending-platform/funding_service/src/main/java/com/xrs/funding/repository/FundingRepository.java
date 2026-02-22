package com.xrs.funding.repository;

import com.xrs.funding.comon.MintStatus;
import com.xrs.funding.entity.FundingTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FundingRepository extends JpaRepository<FundingTransaction, Long> {
    List<FundingTransaction> findByMintStatus(MintStatus failed);
}
