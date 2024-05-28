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
            // require("esbuild").buildSync({
            //     entryPoints: ["./src/main/preload.ts"],
            //     bundle: true,
            //     platform: "node",
            //     outfile: "./dist/preload.js",
            //     external: ["electron", "pg", "tedious", "mysql", "mysql2", "oracledb", "pg-query-stream", "sqlite3"],
            // });

            if (!server.httpServer) throw new Error("server.httpServer is null check devPlugin.ts  ");

            server.httpServer?.once("listening", () => {
                let { spawn } = require("child_process");
                let addressInfo = server.httpServer?.address() as any;
                // console.log(server);
                // console.log(addressInfo);

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

type ResultObject = {
    [key: string]: () => { find: RegExp; code: string };
};
export let getReplacer = () => {
    let externalModels = ["os", "fs", "path", "events", "child_process", "crypto", "http", "buffer", "url", "better-sqlite3", "knex"];
    let result:ResultObject = {};
    for (let item of externalModels) {
        result[item] = () => ({
            find: new RegExp(`^${item}$`),
            code: `const ${item} = require('${item}');export { ${item} as default }`,
        });
    }
    result["electron"] = () => {
        let electronModules = ["clipboard", "ipcRenderer", "nativeImage", "shell", "webFrame"].join(",");
        return {
            find: new RegExp(`^electron$`),
            code: `const {${electronModules}} = require('electron');export {${electronModules}}`,
        };
    };
    return result;
};



