package com.xrs.asset.exception;

import com.xrs.asset.errors.ApiReturnCode;

public class BusinessException extends RuntimeException {

    private final ApiReturnCode code;
    private final boolean printStackTrace;

    public BusinessException(ApiReturnCode code, String description) {
        super(description);
        this.code = code;
        this.printStackTrace = true;
    }

    public ApiReturnCode getCode() {
        return code;
    }

}
