package com.xrs.tax.service;

import com.xrs.tax.constants.MessageCode;
import com.xrs.tax.exception.DuplicatedException;
import com.xrs.tax.exception.NotFoundException;
import com.xrs.tax.model.TaxClass;
import com.xrs.tax.repository.TaxClassRepository;
import com.xrs.tax.viewmodel.taxclass.TaxClassListGetVm;
import com.xrs.tax.viewmodel.taxclass.TaxClassPostVm;
import com.xrs.tax.viewmodel.taxclass.TaxClassVm;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TaxClassService {

    private final TaxClassRepository taxClassRepository;

    public TaxClassService(TaxClassRepository taxClassRepository) {
        this.taxClassRepository = taxClassRepository;
    }

    @Transactional(readOnly = true)
    public List<TaxClassVm> findAllTaxClasses() {
        return taxClassRepository
            .findAll(Sort.by(Sort.Direction.ASC, "name"))
            .stream()
            .map(TaxClassVm::fromModel)
            .toList();
    }

    @Transactional(readOnly = true)
    public TaxClassVm findById(final Long id) {
        final TaxClass taxClass = taxClassRepository
            .findById(id)
            .orElseThrow(
                () -> new NotFoundException(MessageCode.TAX_CLASS_NOT_FOUND, id));
        return TaxClassVm.fromModel(taxClass);
    }

    @Transactional
    public TaxClass create(final TaxClassPostVm taxClassPostVm) {
        if (taxClassRepository.existsByName(taxClassPostVm.name())) {
            throw new DuplicatedException(MessageCode.NAME_ALREADY_EXITED, taxClassPostVm.name());
        }
        return taxClassRepository.save(taxClassPostVm.toModel());
    }

    @Transactional
    public void update(final TaxClassPostVm taxClassPostVm, final Long id) {
        final TaxClass taxClass = taxClassRepository
            .findById(id)
            .orElseThrow(() -> new NotFoundException(MessageCode.TAX_CLASS_NOT_FOUND, id));

        //For the updating case we don't need to check for the taxClass being updated
        if (taxClassRepository.existsByNameNotUpdatingTaxClass(taxClassPostVm.name(), id)) {
            throw new DuplicatedException(MessageCode.NAME_ALREADY_EXITED, taxClassPostVm.name());
        }

        taxClass.setName(taxClassPostVm.name());
        taxClassRepository.save(taxClass);
    }

    @Transactional
    public void delete(final Long id) {
        final boolean isTaxClassExisted = taxClassRepository.existsById(id);
        if (!isTaxClassExisted) {
            throw new NotFoundException(MessageCode.TAX_CLASS_NOT_FOUND, id);
        }
        taxClassRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public TaxClassListGetVm getPageableTaxClasses(final int pageNo, final int pageSize) {
        final Pageable pageable = PageRequest.of(pageNo, pageSize);
        final Page<TaxClass> taxClassPage = taxClassRepository.findAll(pageable);
        final List<TaxClass> taxClassList = taxClassPage.getContent();

        final List<TaxClassVm> taxClassVms = taxClassList.stream()
            .map(TaxClassVm::fromModel)
            .toList();

        return new TaxClassListGetVm(
            taxClassVms,
            taxClassPage.getNumber(),
            taxClassPage.getSize(),
            (int) taxClassPage.getTotalElements(),
            taxClassPage.getTotalPages(),
            taxClassPage.isLast()
        );
    }
}
