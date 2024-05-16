import net from "net";
import Logger from "../../util/logger.ts";

const logger = Logger.logger('s_port', 'info');
export async function portIsOccupied(port: number) : Promise<number> {
    return new Promise((resolve, reject) => {
        // 创建服务并监听该端口
        const server = net.createServer();
        server.listen(port);
        server.on('listening', () => {
            // 执行这块代码说明端口未被占用
            server.close(); // 关闭服务
            resolve(port);
        })

        server.on('error', (err: Error) => {
            if (err.name === 'EADDRINUSE') {
                // 端口已经被使用
                resolve(-1);
            } else {
                // 未知异常
                reject(err)
            }
        });
    })
}

/**
 * 获取可用端口
 * @param port
 * @param maxTry
 * @returns 端口号
 */
export async function
getAvailablePort<T>(port: number = 3000, maxTry: number = 100): Promise<[Error | null | T | undefined, number]>
{
    let tryCount = 0;
    let rPort = port;
    // logger.info(rPort);
    while (tryCount < maxTry) {
        try {
            rPort = await portIsOccupied(rPort);
            logger.info(rPort);
            if(rPort != -1){
                return [null, rPort];
            }
            rPort += 1;
            tryCount += 1;
            if( maxTry >= 0 && tryCount >= maxTry && rPort > 65535){
                return [null,-1];
            }
        } catch (e) {
            if (e instanceof Error) {
                return [e, -1];
            }
            return [null, -1];
        }
    }
    return [null,-1];
}
