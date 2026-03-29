import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
  extends: [
    "@commitlint/config-conventional",
    "@commitlint/config-pnpm-scopes",
  ],
};

export default config;
