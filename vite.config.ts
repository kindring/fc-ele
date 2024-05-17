import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import optimizer from "vite-plugin-optimizer";

import {buildPlugin} from "./plugins/buildPlugin";
import { devPlugin, getReplacer } from "./plugins/devPlugin";

export default defineConfig({
      plugins: [
          optimizer(getReplacer()),
          devPlugin(),
          vue()
      ],
    build: {
        rollupOptions: {
            plugins: [buildPlugin()],
        },
    },
    resolve: {
        alias: {
            "@": "./src",
        },
    },

    server: {
        host: '127.0.0.1',
    },

});
