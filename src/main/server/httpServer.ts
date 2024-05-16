import express, {Request, Response, NextFunction, Express} from 'express';
import Logger from "../../util/logger.ts";
import {createKey} from "../../util/expireKey.ts";
import r_index from "./router/r_index.ts";
import http from "http";

let logger = Logger.logger('httpServer', 'info');

export interface FcServer extends http.Server {
    $serverKey: string;
    stop: () => void;
}
let app: Express = express();
let _server: FcServer | null = null;
// 监听地址,默认监听ipv4
let serverHost = '0.0.0.0';



/**
 * 启动web服务器
 * @param port
 * @returns {Promise<unknown>}
 */
export function startServer(port: number, enableIpv6 = true) : Promise<[Error | null , FcServer | null]> {
    let key = createKey();
    return new Promise((resolve) => {
        if(enableIpv6){
            serverHost = '::';
        }
        // 允许跨域
        app.all('*', function (_req: Request, res: Response, next: NextFunction ) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "*");
            res.header("Access-Control-Allow-Methods", "*");
            res.header("Content-Type", "application/json;charset=utf-8");
            next();
        });
        app.use((req: Request, _res: Response, next: NextFunction)=>{
            // 记录请求日志, 相应状态, 请求方法, 请求地址
            logger.info(`[ServerRouter] ${req.method} ${req.url}`);
            next();
        });
        // 挂载路由等中间件
        logger.info(`[server] 挂载路由等中间件`);
        app.use(r_index);
        // 未知路由处理
        app.use((req: Request, res: Response)=>{
            logger.warn(`[ServerRouter] 未知请求 ${req.method} ${req.url} ${res.statusCode} queryIp:${req.ip}`);
            res.status(404).send('404');
        });
        let server: http.Server = app.listen(port, serverHost, () => {
            logger.info(`[server] server start at port:${port}`);
            let fc_server: FcServer = server as FcServer;
            fc_server.$serverKey = key;
            fc_server.stop = stopServer;
            resolve([null, fc_server]);
        });
        _server = server as FcServer;
        _server.$serverKey = key;
        _server.stop = stopServer;
        server.on('error', (err: Error) => {
            logger.error(`[server] server start error:${err}`);
            _server = null;
            resolve([err, null])
        });
    });
}

async function stopServer() {
    if(_server){
        _server.close();
        _server = null;
    }else{
        logger.warn('server is not running');
    }
}

