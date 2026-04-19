package com.xrsqx1.favouriteservice.service;

import com.xrsqx1.favouriteservice.dto.FavouriteDto;
import com.xrsqx1.favouriteservice.entity.id.FavouriteId;

import java.util.List;

public interface FavouriteService {
    List<FavouriteDto> findAll();
    FavouriteDto findById(final FavouriteId favouriteId);
    FavouriteDto save(final FavouriteDto favouriteDto);
    FavouriteDto update(final FavouriteDto favouriteDto);
    void deleteById(final FavouriteId favouriteId);
}
