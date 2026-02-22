package com.xrs.fooddelivery.payment.client;

import com.xrs.fooddelivery.payment.dto.AuthorizationRequest;
import com.xrs.fooddelivery.payment.dto.AuthorizationResponse;
import com.xrs.fooddelivery.payment.dto.CaptureRequest;
import com.xrs.fooddelivery.payment.dto.CaptureResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "card-network", url = "${card.network.url}")
public interface CardNetworkClient {

    @PostMapping("/api/v1/authorize")
    AuthorizationResponse authorize(@RequestBody AuthorizationRequest request);

    @PostMapping("/api/v1/capture")
    CaptureResponse capture(@RequestBody CaptureRequest request);
}
