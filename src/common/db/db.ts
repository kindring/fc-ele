import knex, {Knex} from "knex";
import fs from "fs-extra";
import path from "path";
import os from "os";

let dbInstance: Knex | null = null;
if (!dbInstance) {
    // let dbPath = process.env.APPDATA || (process.platform == "darwin" ? process.env.HOME + "/Library/Preferences" : process.env.HOME + "/.local/share");
    let userPath = path.join(os.homedir(), '/fc-ele/');
    // dbPath = path.join(dbPath, "fc-ele/db.db");
    userPath = path.join(userPath, "fc-ele/db.db");
    console.log(userPath);
    let dbIsExist = fs.existsSync(userPath);
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
        fs.copy(resourceDbPath, userPath).catch((err) => {
            console.log(err);
        });
    }
    // 连接数据库
    dbInstance = knex({
        client: "better-sqlite3",
        connection: { filename: userPath },
        useNullAsDefault: true,
    });
}

export let db = dbInstance;
