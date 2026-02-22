package com.xrs.media.mapper;

import com.xrs.media.model.Media;
import com.xrs.media.viewmodel.MediaVm;
import com.xrs.commonlib.mapper.BaseMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MediaVmMapper extends BaseMapper<Media, MediaVm> {
}
