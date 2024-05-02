/**
 * Get total bytes saved by the optimization
 *
 * @param {string} output - Output of the terminal
 * @returns {string} total saved bytes
 */
export function getTotalSavings(output: string): string {
  const pattern = output.match(/Total savings: (-?[\d\.]+ .+[b|B])/);

  return pattern?.[1] ? pattern[1] : '';
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
