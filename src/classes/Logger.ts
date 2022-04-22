/**
 * Facilitates logging
 */
export class Logger {
  /**
   * Prints a string formatted with positional arguments
   *
   * @param {string} str string to be formatted
   * @param {...(string | number)} args positional arguments to print in the formatted string
   */
  public static printf(str: string, ...args: (string | number)[]) {
    let strToLog = str;
    args.forEach((arg) => {
      strToLog = strToLog.replace(/%s/, `${arg}`);
    });
    console.log(strToLog);
  }
}
