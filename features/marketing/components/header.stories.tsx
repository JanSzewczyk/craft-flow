import { type Meta, type StoryObj } from "@storybook/react";

import { MarketingHeader } from "./header";

const meta: Meta<typeof MarketingHeader> = {
  title: "Marketing/Header",
  component: MarketingHeader,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Main navigation header for the marketing site. Features responsive design, theme toggle, and auth state detection."
      }
    }
  },
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof MarketingHeader>;

/**
 * Default story showing the MarketingHeader component on desktop viewport.
 * Displays logo, navigation links, theme toggle, and action buttons.
 */
export const Default: Story = {};

/**
 * Story showing the header on mobile viewport.
 * Hides desktop navigation and shows mobile menu button.
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: "iphone12"
    }
  }
};

/**
 * Story for accessibility testing.
 * This story is tagged as test-only and will be run by the test suite.
 */
export const Accessibility: Story = {
  tags: ["test-only"],
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: "color-contrast", enabled: true },
          { id: "button-name", enabled: true },
          { id: "link-name", enabled: true }
        ]
      }
    }
  }
};
