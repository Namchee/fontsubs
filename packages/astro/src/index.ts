import { defineIntegration } from "astro-integration-kit";

import { z } from "astro/zod";

import { execSync } from "node:child_process";
import { resolve } from "node:path";

import kleur from "kleur";

import { getCurrentTime, getTotalSavings } from "./utils.js";

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
       * Inline the optimized fonts directly in the `@font-face` declaration.
       *
       * @default `false`
       */
      inline: z.boolean().optional().default(false),
      /**
       * Analyze webfonts usage dynamically by running headless browsers.
       *
       * Mainly used for on-demand renders.
       *
       * @default `false`
       */
      dynamic: z.boolean().optional().default(false),
      /**
       * Enable verbose output to `stdout`.
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
        "astro:build:done": ({ dir, pages }) => {
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
            if (pathname.startsWith("404")) {
              parts[1] = `${pathname.slice(0, -1)}.html`;
            } else {
              parts.push("index.html");
            }

            return resolve(...parts);
          });

          console.log(
            kleur
              .bgGreen()
              .black(" [astro-subfont] generating optimized fonts "),
          );

          const command = `subfont ${input.join(" ")} ${flags.join(" ")}`;
          if (options?.debug) {
            console.log(
              kleur.dim(getCurrentTime()),
              kleur.green("Detected pages:"),
            );

            for (const page of input) {
              console.log(
                kleur.dim(getCurrentTime()),
                kleur.green("▶"),
                page.replace(dir.pathname, ""),
              );

              console.log(
                kleur.dim(getCurrentTime()),
                kleur.green("  └─"),
                kleur.dim(page),
              );
            }
          }

          try {
            const output = execSync(command, { stdio: 'pipe' });
            const bytesSaved = getTotalSavings(output.toString());

            console.log(
              kleur.dim(getCurrentTime()),
              kleur.green(
                `✓ Successfully reduced font payload by ${bytesSaved}`,
              ),
              "\n",
            );
          } catch (err) {
            console.error(
              kleur.bgRed(`Failed to optimize fonts due to ${err}`),
            );
          }
        },
      },
    };
  },
});
