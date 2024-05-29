import os from "os";

const appPath = `fc_ele`
export function getUserHomePath(): string {

    let userPath = os.homedir();
    // 如果是windows系统, 则将数据存储在用户目录下的AppData/Roaming/fc_ele中
    if (os.platform() === "win32") {
        userPath = userPath + `\\AppData\\Roaming\\${appPath}`;
    }
    return userPath;
}
