export default {
  extends: ["@repo/shared-config-commitlint/base"],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        "global",
        "playwright",
        "shared-config-biome",
        "shared-config-commitlint",
        "shared-config-knip",
        "shared-config-playwright",
        "shared-config-storybook",
        "shared-config-syncpack",
        "shared-config-typedoc",
        "shared-config-typescript",
        "shared-config-vitest",
        "shared-sandbox",
        "storybook",
        "storybook",
        "typedoc",
        "typedoc",
        "web",
      ],
    ],
  },
};
