package com.xrs.buildingblocks.jpa;


import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hibernate.Filter;
import org.hibernate.Session;
import org.springframework.context.annotation.Configuration;

/**
 * @author Rui S.
 * @date 2026-02-03
 * @apiNote
 */
@Configuration
public class HibernateGlobalFilter {
    @PersistenceContext
    private EntityManager entityManager;

    @PostConstruct
    public void enableSoftDeleteFilter() {
        Session session = entityManager.unwrap(Session.class);
        Filter filter = session.enableFilter("softDeleteFilter");
        filter.setParameter("isDeleted", false);
    }
}