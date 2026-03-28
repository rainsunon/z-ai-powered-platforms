package com.xrs.immo.domain.repository;

import com.xrs.immo.domain.model.PropertyDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PropertySearchRepository extends ElasticsearchRepository<PropertyDocument, String> {

    List<PropertyDocument> findByPropertyType(String propertyType);

    List<PropertyDocument> findByCity(String city);

    List<PropertyDocument> findByCityAndPropertyType(String city, String propertyType);

    List<PropertyDocument> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    List<PropertyDocument> findByPropertyTypeAndPriceBetween(String propertyType, BigDecimal minPrice, BigDecimal maxPrice);

    List<PropertyDocument> findByCityAndPriceBetween(String city, BigDecimal minPrice, BigDecimal maxPrice);

    List<PropertyDocument> findByPropertyTypeAndCityAndPriceBetween(
            String propertyType, String city, BigDecimal minPrice, BigDecimal maxPrice);

    List<PropertyDocument> findByAvailableTrue();

    List<PropertyDocument> findByAvailableTrueAndPropertyType(String propertyType);

    List<PropertyDocument> findByAvailableTrueAndCity(String city);
}
