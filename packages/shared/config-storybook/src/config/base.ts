import type { Preview } from "storybook";

/**
 * Viewport presets for responsive design testing.
 */
const viewports = {
  mobile: {
    name: "Mobile",
    styles: {
      width: "375px",
      height: "667px",
    },
  },
  tablet: {
    name: "Tablet",
    styles: {
      width: "768px",
      height: "1024px",
    },
  },
  desktop: {
    name: "Desktop",
    styles: {
      width: "1280px",
      height: "800px",
    },
  },
} as const;

/**
 * Shared Storybook preview parameters.
 */
export const parameters: Preview["parameters"] = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /date$/i,
    },
  },
  viewport: {
    viewports,
  },
};
