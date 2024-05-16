import { Request, Response, NextFunction} from 'express';
import {notPermission} from "../../../util/httpResult.ts";
import expireKey from "../../../util/expireKey.ts";
/**
 * 用于检查请求中是否携带key,以及其key是否合法
 * @param req
 * @param res
 * @param next
 */
export default function (req: Request, res: Response, next: NextFunction) {
    let key = req.headers['key'];
    if(!key || !expireKey.checkKey(key)){
        return notPermission(res, 'key error');
    }
    expireKey.updateExpire(key);
    next();
}
