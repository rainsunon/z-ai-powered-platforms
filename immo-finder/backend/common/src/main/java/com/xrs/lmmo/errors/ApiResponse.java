package com.xrs.asset.errors;

public class ApiResponse {
    private int code;
    private String error;
    private String message;
    private Object data;

    public ApiResponse(ApiReturnCode returnCode, String error, String message, Object data) {
        this.code = returnCode.getCode();
        this.error = error;
        this.message = message;
        this.data = data;
    }

    public int getCode() {
        return code;
    }

    public String getError() {
        return error;
    }

    public String getMessage() {
        return message;
    }

    public Object getData() {
        return data;
    }
}
