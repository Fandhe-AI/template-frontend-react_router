import type { Meta, StoryObj } from "@storybook/react-vite";
import { SandboxCard } from ".";

const meta = {
  component: SandboxCard,
  tags: ["autodocs"],
  args: {
    title: "Sandbox Card",
    description: "This component verifies Storybook integration.",
  },
} satisfies Meta<typeof SandboxCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default rendering of the SandboxCard. */
export const Default: Story = {};

/** SandboxCard with a long description. */
export const LongDescription: Story = {
  args: {
    title: "Long Content",
    description:
      "This is a much longer description to verify how the card handles extended text content gracefully within the component boundaries.",
  },
};
