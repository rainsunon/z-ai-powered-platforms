package com.xrsqx1.favouriteservice.repository;

import com.xrsqx1.favouriteservice.entity.Favourite;
import com.xrsqx1.favouriteservice.entity.id.FavouriteId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface FavouriteRepository extends JpaRepository<Favourite, FavouriteId> {

}
