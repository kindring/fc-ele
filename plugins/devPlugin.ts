import { ViteDevServer } from "vite";
export let devPlugin = () => {
    return {
        name: "dev-plugin",
        configureServer(server: ViteDevServer) {
            require("esbuild").buildSync({
                entryPoints: ["./src/main/mainEntry.ts"],
                bundle: true,
                platform: "node",
                outfile: "./dist/mainEntry.js",
                external: ["electron", "pg", "tedious", "mysql", "mysql2", "oracledb", "pg-query-stream", "sqlite3"],
            });
            // 修复 'server.httpServer' is possibly 'null'. 的问题
            if(!server.httpServer) throw new Error("server.httpServer is null check devPlugin.ts");
            server.httpServer?.once("listening", () => {
                let { spawn } = require("child_process");
                let addressInfo = server.httpServer?.address() as any;
                let httpAddress = `http://${addressInfo.address}:${addressInfo.port}`;
                let electronProcess = spawn(require("electron").toString(), ["./dist/mainEntry.js", httpAddress], {
                    cwd: process.cwd(),
                    stdio: "inherit",
                });
                electronProcess.on("close", () => {
                    server.close();
                    process.exit();
                });
            });
        },
    };
};


export let getReplacer = () => {
    let externalModels = ["os", "fs", "path", "events", "child_process", "crypto", "http", "buffer", "url", "better-sqlite3", "knex"];
    // let result = {};
    let result: { [key: string]: () => { find: RegExp, code: string } } = {};
    for (let item of externalModels) {
        result[item] = () => ({
            find: new RegExp(`^${item}$`),
            code: `const ${item} = require('${item}');export { ${item} as default }`,
        });
    }
    // if(!result["electron"]) throw new Error("getReplacer() electron not exists");
    result["electron"] = () => {
        let electronModules = ["clipboard", "ipcRenderer", "nativeImage", "shell", "webFrame"].join(",");
        return {
            find: new RegExp(`^electron$`),
            code: `const {${electronModules}} = require('electron');export {${electronModules}}`,
        };
    };
    return result;
};
