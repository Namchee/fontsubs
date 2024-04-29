/**
 * Get total bytes saved by the optimization
 *
 * @param {string} output - Output of the terminal
 * @returns {string} total saved bytes
 */
export function getTotalSavings(output: string): string {
  const pattern = output.match(/Total savings: -?([\d\.]+ .+[b|B])/);

  return pattern ? pattern[1] : '';
}
