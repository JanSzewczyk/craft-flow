import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

// Skip environment validation in tests
process.env.SKIP_ENV_VALIDATION = "true";

export default defineConfig({
  test: {
    globals: true,
    reporters: process.env.CI ? ["dot", "github-actions", "blob"] : ["tree"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary", "json"],
      reportsDirectory: "coverage",
      reportOnFailure: true,
      include: [
        "app/**/*.{js,jsx,ts,tsx}",
        "components/**/*.{js,jsx,ts,tsx}",
        "features/**/*.{js,jsx,ts,tsx}",
        "lib/**/*.{js,ts}",
        "utils/**/*.{js,ts}"
      ],
      exclude: [
        "**/{node_modules,coverage,storybook-static}/**",
        "**/.next/**",
        "**/dist/**",
        "**/.{idea,git,cache,output,temp}/**",
        "**/*.d.ts",
        "**/virtual:*",
        "**/__x00__*",
        "**/{karma,rollup,webpack,vite,jest,ava,babel,nyc,cypress,tsup,build,prettier,release,postcss,eslint,playwright,next}.config.*",
        "**/vitest.{workspace,projects,config}.[jt]s?(on)",
        "**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}",
        "**/*.{types,styles,stories}.?(c|m)[jt]s?(x)",
        "**/env.ts",
        "**/app/{sitemap,robots,icon,manifest}.ts?(x)",
        "**/tests/**",
        "**/test?(s)/**",
        "test?(-*).?(c|m)[jt]s?(x)",
        "**/*{.,-}{test,spec,e2e}?(-d).?(c|m)[jt]s?(x)",
        "**/__tests__/**",
        "**/constants/**",

        // API route handlers
        "**/app/api/**/route.ts",

        // Server-action support files (logger factory, error mapper)
        "**/server/actions/**/{logger,map-service-error}.ts",

        // Drizzle ORM schema declarations
        "**/server/db/**/schema.ts",
        "lib/supabase/schema.ts",

        // Type-only declaration files
        "**/types/**",
        "**/types.ts",
        "**/types.tsx",

        // Vitest mocks
        "__mocks__/**",

        // Provider wrappers
        "**/components/providers/**",

        // Storybook support
        ".storybook/**",
        "stories/**"
      ]
    },
    projects: [
      {
        plugins: [],
        resolve: {
          tsconfigPaths: true
        },
        test: {
          name: "unit",
          globals: true,
          include: ["**/*.{test,spec}.{ts,tsx}"],
          environment: "node",
          setupFiles: ["tests/unit/vitest.setup.ts"]
        }
      },
      {
        plugins: [storybookTest()],
        resolve: {
          tsconfigPaths: true
        },
        optimizeDeps: {
          include: [
            "sb-original/default-loader",
            "sb-original/image-context",
            "@clerk/react",
            "@react-email/render",
            "@supabase/supabase-js",
            "@t3-oss/env-nextjs",
            "drizzle-orm",
            "drizzle-orm/pg-core",
            "drizzle-orm/postgres-js",
            "next/headers",
            "next/server",
            "postgres",
            "resend"
          ]
        },
        test: {
          name: "storybook",
          exclude: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [
              {
                browser: "chromium",
                headless: true
              }
            ]
          },
          setupFiles: ["tests/integration/vitest.setup.ts"]
        }
      }
    ]
  }
});
