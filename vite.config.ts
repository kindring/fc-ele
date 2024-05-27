import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import optimizer from "vite-plugin-optimizer";

import {buildPlugin} from "./plugins/buildPlugin";
import { devPlugin, getReplacer } from "./plugins/devPlugin";
import {svgLoader} from "./plugins/SVGLoader";

export default defineConfig({
      plugins: [
          optimizer(getReplacer()),
          devPlugin(),
          vue(),
          svgLoader('./src/assets/svg/'),
      ],
    build: {
        rollupOptions: {
            plugins: [buildPlugin()],
        },
    },
    resolve: {
        alias: {
            "@": "/src",
        },
    },

    server: {
        hmr:true,
        host: '127.0.0.1',
    },

});
