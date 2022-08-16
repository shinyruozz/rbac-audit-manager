import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
    mode: "development",
    plugins: [vue()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            style: path.resolve(__dirname, "./assets/style"),
        },
    },
    server: {
        host: "localhost",
        port: 8080,
        proxy: {
            "/api": {
                target: "http://localhost:4000",
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
});