import knex, {Knex} from "knex";
import fs from "fs-extra";
import path from "path";
import os from "os";

// 用于存放所有的db文件
export const dbFiles: { [key: string]: Knex} = {

}

function createDbFile (dbFileName: string): string {
    let userPath = path.join(os.homedir(), '/fc-ele/');
    userPath = path.join(userPath, `fc-ele/${dbFileName}`);
    let dbIsExist = fs.existsSync(userPath);
    if (!dbIsExist) {
        let resourceDbPath = path.join(process.execPath, `../resources/${dbFileName}`);
        // 判断初始文件是否存在
        let resourceDbIsExist = fs.existsSync(resourceDbPath);
        if (!resourceDbIsExist) {
            console.log("base db not find");
            fs.ensureFileSync(resourceDbPath);
            // 创建初始文件
            let dbInstance = knex({
                client: "better-sqlite3",
                connection: { filename: resourceDbPath },
                useNullAsDefault: true,
            });
            // 关闭数据库连接
            dbInstance.destroy();
        }
        // 复制初始文件到用户目录
        fs.copySync(resourceDbPath, userPath)
    }
    return userPath;
}

export function loadDb (dbFileName: string) : Knex | null
{
    let dbInstance: Knex | null = dbFiles[dbFileName];
    if (dbInstance)
    {
        return dbInstance;
    }
    let dbPath = createDbFile(dbFileName);
    dbInstance = knex({
        client: "better-sqlite3",
        connection: { filename: dbPath },
        useNullAsDefault: true,
    });
    dbFiles[dbFileName] = dbInstance;
    return dbInstance;
}
