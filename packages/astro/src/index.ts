import { defineIntegration } from "astro-integration-kit";

import { z } from "astro/zod";

import { exec, } from "node:child_process";
import { resolve } from "node:path";

import chalk from "chalk";

const execCommand = (command: string) => new Promise((resolve, reject) => {
  exec(command, (err, stdout, stderr) => {
    if (err) {
      reject(err);
    }

    if (stderr) {
      reject(stderr);
    }

    resolve(stdout);
  })
});

export const subset = defineIntegration({
  name: "subset",
  optionsSchema: z
    .object({
      /**
       * List of characters to be whitelisted outside of detected glyphs.
       *
       * @default `''`
       */
      whitelist: z.string().optional().default(""),
      /**
       * Attempt to optimize unused variable fonts features such as
       * weights, slants, etc when its unused.
       *
       * This feature is experimental and might break your fonts.
       *
       * @default `false`
       */
      optimizeVariableFonts: z.boolean().optional().default(true),
      /**
       * Inline the optimized fonts directly in the @font-face declaration.
       *
       * @default `false`
       */
      inline: z.boolean().optional().default(false),
      /**
       * Analyze webfonts usage dynamically using headless browsers.
       *
       * Mainly used for on-demand renders.
       *
       * @default `false`
       */
      dynamic: z.boolean().optional().default(false),
      /**
       * Enable verbose output to stdout.
       *
       * @default `false`
       */
      debug: z.boolean().optional().default(false),
    })
    .optional()
    .default({}),
  setup: ({ options }) => {
    return {
      hooks: {
        "astro:build:done": async ({ dir, pages }) => {
          const flags = ["--in-place", "--no-fallbacks"];
          if (options?.whitelist) {
            flags.push(`--text=${options.whitelist}`);
          }

          if (options?.optimizeVariableFonts) {
            flags.push("--instance");
          }

          if (options?.inline) {
            flags.push("--inline-css");
          }

          if (options?.dynamic) {
            flags.push("--dynamic");
          }

          const input = pages.map(({ pathname }) =>
            resolve(
              dir.pathname,
              pathname,
              pathname.startsWith("404") ? "" : "index.html",
            ),
          );

          const command = `subfont ${input.join(" ")} ${flags.join(" ")}`;
          if (options?.debug) {
            console.log(chalk.green('Optimizing font for pages: '));
            input.forEach(page => console.log(chalk.green(`▶ ${page}`)));
          }

          try {
            const output = await execCommand(command);
          } catch (err) {
            chalk.white.bgRed(`Failed to optimize fonts due to ${err}`);
          }
        },
      },
    };
  },
});
