package com.xrs.media.service;

import com.xrs.media.model.Media;
import com.xrs.media.model.dto.MediaDto;
import com.xrs.media.viewmodel.MediaPostVm;
import com.xrs.media.viewmodel.MediaVm;
import java.util.List;

public interface MediaService {
    Media saveMedia(MediaPostVm mediaPostVm);

    MediaVm getMediaById(Long id);

    void removeMedia(Long id);

    MediaDto getFile(Long id, String fileName);

    List<MediaVm> getMediaByIds(List<Long> ids);
}
