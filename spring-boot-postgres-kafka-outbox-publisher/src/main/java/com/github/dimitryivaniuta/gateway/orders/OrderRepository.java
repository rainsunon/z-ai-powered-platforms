package com.github.dimitryivaniuta.gateway.orders;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * JPA repository for {@link OrderEntity}.
 */
public interface OrderRepository extends JpaRepository<OrderEntity, UUID> {

    /**
     * Searches orders by:
     * <ul>
     *   <li>customerEmail (case-insensitive contains)</li>
     *   <li>id (UUID textual contains)</li>
     * </ul>
     *
     * <p>For production: keep indexes aligned with the query patterns (see Flyway migration V2),
     * and consider trigram search if you expect large datasets + fuzzy matching.</p>
     *
     * @param q query string (trimmed)
     * @param pageable paging
     * @return page of orders
     */
    @Query("""
            select o from OrderEntity o
            where lower(o.customerEmail) like lower(concat('%', :q, '%'))
               or cast(o.id as string) like concat('%', :q, '%')
            """)
    Page<OrderEntity> search(@Param("q") String q, Pageable pageable);
}
