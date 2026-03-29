import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../../../packages/**/src/ui/**/*.stories.@(ts|tsx)"],
  typescript: {
    reactDocgen: "react-docgen",
  },
};

export default config;
