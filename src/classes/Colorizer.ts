import chalk from 'chalk';

/**
 * Class that colorizes strings for printing to the console
 */
export class Colorizer {
  /**
   * Colors a string green
   *
   * The returned string has a green background with black text
   *
   * @param {string} str to color
   * @returns {string} colorized
   */
  public static green(str: string) {
    return chalk.bgGreen.black(str);
  }

  /**
   * Colors a string yellow
   *
   * The returned string has a yellow background with black text
   *
   * @param {string} str to color
   * @returns {string} colorized
   */
  public static yellow(str: string) {
    return chalk.bgYellow.black(str);
  }
}
