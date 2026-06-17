import path from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const prod = process.env.NODE_ENV === "production";

export default defineConfig({
    root: "src",
    base: prod ? `/${path.basename(process.cwd())}/` : "/",
    mode: prod ? "production" : "development",
    publicDir: "../public",
    plugins: [
        vue({
            customElement: /\.ce\.vue$/,
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => tag.startsWith("marine-"),
                },
            },
        }),
    ],
    server: { port: 1234 },
    build: {
        outDir: "../dist",
    },
});
