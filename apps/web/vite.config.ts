import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

const PORT = Number(process.env.VITE_PORT ?? 3000);

export default defineConfig({
  server: {
    port: PORT,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [reactRouter()],
});
