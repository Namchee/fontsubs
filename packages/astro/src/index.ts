import { defineIntegration } from "astro-integration-kit";

import { z } from "astro/zod";

import { exec } from "node:child_process";
import { resolve } from "node:path";

import chalk from "chalk";

import { getTotalSavings } from "./utils";

const execCommand = (command: string): Promise<string> =>
  new Promise((resolve, reject) => {
    exec(command, (err, stdout) => {
      if (err) {
        reject(err);
      }

      resolve(stdout);
    });
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

          const input = pages.map(({ pathname }) => {
            const parts = [dir.pathname, pathname];
            if (pathname.startsWith('404')) {
              parts[-1] += '.html';
            } else {
              parts.push(pathname, "index.html");
            }

            return resolve(...parts);
          });

          console.log(chalk.black.bgGreen(" Generating optimized fonts \n"));

          const command = `subfont ${input.join(" ")} ${flags.join(" ")}`;
          if (options?.debug) {
            console.log(chalk.green(" Detected pages: \n"));
            for (const page of input) {
              console.log(chalk.green(` ▶ ${page}\n`));
            }
          }

          try {
            const output = await execCommand(command);
            const bytesSaved = getTotalSavings(output);

            console.log(chalk.green(`\n ✔️ Successfully saved ${bytesSaved}`));
          } catch (err) {
            console.error(
              chalk.white.bgRed(`Failed to optimize fonts due to ${err}`),
            );
          }
        },
      },
    };
  },
});
