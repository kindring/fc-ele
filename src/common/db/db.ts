import knex, {Knex} from "knex";
import fs from "fs-extra";
import path from "path";

let dbInstance: Knex | null = null;
if (!dbInstance) {
    let dbPath = process.env.APPDATA || (process.platform == "darwin" ? process.env.HOME + "/Library/Preferences" : process.env.HOME + "/.local/share");
    dbPath = path.join(dbPath, "fc-ele/db.db");
    console.log(dbPath);
    let dbIsExist = fs.existsSync(dbPath);
    if (!dbIsExist) {
        let resourceDbPath = path.join(process.execPath, "../resources/db.db");
        // 判断初始文件是否存在
        let resourceDbIsExist = fs.existsSync(resourceDbPath);
        if (!resourceDbIsExist) {
            console.log("base db not find");
            fs.ensureFile(resourceDbPath);
            // 创建初始文件
            dbInstance = knex({
                client: "better-sqlite3",
                connection: { filename: resourceDbPath },
                useNullAsDefault: true,
            });
        }
        // 复制初始文件到用户目录
        fs.copy(resourceDbPath, dbPath).catch((err) => {
            console.log(err);
        });
    }
    // 连接数据库
    dbInstance = knex({
        client: "better-sqlite3",
        connection: { filename: dbPath },
        useNullAsDefault: true,
    });
}

export let db = dbInstance;
