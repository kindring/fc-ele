import {Response}  from 'express';
import Logger from "./logger.ts";

const log = Logger.logger('resultHandle', 'info');


// 定义成功响应数据类型
interface SuccessResponse {
    code: number;
    data: any;
}

// 定义搜索成功响应数据类型
interface SearchSuccessResponse {
    code: number;
    data: any;
    total: number;
    count: number;
    page: number;
    limit: number;
}

// 定义错误响应数据类型
interface ErrorResponse {
    code: number;
    msg: string;
}

export const rCode = {
    NotMATCH: 0,
    OK: 1,
    NotParam: 2,
    NotLogin: 3,
    NotPermission: 4,
    CustomError: 5,
    ServerError: 6,
    Timeout: 7,
    NotFound: 8,
    ApiError: 9,
    SaveError: 10,
    DataRepeat: 11,
};

export function success(res: Response, data: any) {
    const responseData: SuccessResponse = {
        code: rCode.OK,
        data: data
    };
    res.json(responseData);
}

function searchSuccess(res: Response, data: any, total: number, page: number, limit: number) {
    const responseData: SearchSuccessResponse = {
        code: rCode.OK,
        data: data,
        total: total,
        count: data.length,
        page: page,
        limit: limit
    };
    res.json(responseData);
}

function ServerError(res: Response, code: number, msg: string) {
    log.error(`result to server error ${msg}`);
    const errorResponse: ErrorResponse = {
        code: code ? code : rCode.ServerError,
        msg: msg
    };
    res.json(errorResponse);
}

function paramFail(res: Response, msg: string) {
    const errorResponse: ErrorResponse = {
        code: rCode.NotParam,
        msg: msg
    };
    res.json(errorResponse);
}

function notLogin(res: Response, msg: string) {
    const errorResponse: ErrorResponse = {
        code: rCode.NotLogin,
        msg: msg
    };
    res.json(errorResponse);
}

export function notPermission(res: Response, msg: string) {
    const errorResponse: ErrorResponse = {
        code: rCode.NotPermission,
        msg: msg
    };
    res.status(401).json(errorResponse);
}

function customError(res: Response, msg: string) {
    const errorResponse: ErrorResponse = {
        code: rCode.CustomError,
        msg: msg
    };
    res.json(errorResponse);
}

function controlError(res: Response, err: any, msg: string) {
    let errorCode, errorMsg;
    if (msg) { errorMsg = msg; }
    if (err) {
        if (err.eCode) {
            errorCode = err.eCode;
        }
        if (!msg && err.eMsg) {
            errorMsg = err.eMsg;
        } else {
            errorMsg = err.message;
        }
    }
    if (!errorCode) { errorCode = rCode.ServerError; }
    if (!errorMsg) { errorMsg = 'server error 9999'; }
    switch (errorCode) {
        case rCode.OK:
            success(res, errorMsg);
            break;
        case rCode.NotParam:
            paramFail(res, errorMsg);
            break;
        case rCode.NotLogin:
            notLogin(res, errorMsg);
            break;
        case rCode.NotPermission:
            notPermission(res, errorMsg);
            break;
        case rCode.CustomError:
            customError(res, errorMsg);
            break;
        case rCode.Timeout:
        case rCode.NotFound:
        case rCode.ApiError:
        case rCode.SaveError:
        case rCode.DataRepeat:
        case rCode.ServerError:
        default:
            ServerError(res, errorCode, errorMsg);
    }
}

export default {
    success,
    searchSuccess,
    ServerError,
    paramFail,
    controlError,
};
