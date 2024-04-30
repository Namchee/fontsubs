import { exec } from "node:child_process";

/**
 * Get total bytes saved by the optimization
 *
 * @param {string} output - Output of the terminal
 * @returns {string} total saved bytes
 */
export function getTotalSavings(output: string): string {
  const pattern = output.match(/Total savings: (-?[\d\.]+ .+[b|B])/);

  return pattern ? pattern[1] : '';
}

/**
 * Execute a child process in async manner.
 *
 * Output to `stderr` is ignored.
 *
 * @param {string} command - command to be executed.
 * @returns {string} A promise that resolves into `stdout` output.
 */
export function execCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, ) => {
      if (err) {
        reject(err);
      }

      resolve(stdout);
    });
  });
}

/**
 * Get current time of execution in HH:mm:ss format.
 *
 * This function calculate datetime locally.
 *
 * @returns {string} Time string in HH:mm:ss format.
 */
export function getCurrentTime(): string {
  const now = new Date();

  return `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
};
