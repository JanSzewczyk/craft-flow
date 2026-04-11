import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { defineMain } from "@storybook/nextjs-vite/node";
import { type PresetValue, type TagsOptions } from "storybook/internal/types";

process.env.STORYBOOK = "true";

const tags: PresetValue<TagsOptions | undefined> = {
  "test-only": {
    excludeFromDocsStories: true,
    excludeFromSidebar: false
  }
};

export default defineMain({
  stories: ["../**/*.mdx", "../**/*.stories.@(js|jsx|ts|tsx)"],
  features: {
    experimentalTestSyntax: true
  },
  addons: [
    "@storybook/addon-a11y",
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-docs",
    "@storybook-community/storybook-dark-mode",
    "storybook-addon-tag-badges"
  ],
  framework: "@storybook/nextjs-vite",
  typescript: {
    reactDocgen: "react-docgen-typescript",
    check: true
  },
  tags,
  staticDirs: ["../public"],
  viteFinal: async (config) => {
    const { mergeConfig } = await import("vite");

    return mergeConfig(config, {
      resolve: {
        tsconfigPaths: true,
        alias: [
          {
            find: "@clerk/nextjs/server",
            replacement: path.resolve(__dirname, "../__mocks__/@clerk/nextjs/server.ts")
          },
          {
            find: "@clerk/nextjs",
            replacement: path.resolve(__dirname, "../__mocks__/@clerk/nextjs/index.tsx")
          },
          {
            find: "next/image",
            replacement: path.resolve(__dirname, "../__mocks__/next/image.tsx")
          }
        ]
      }
    });
  }
});
