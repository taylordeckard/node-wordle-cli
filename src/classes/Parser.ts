/**
 * Parses various things
 */
export class Parser {
  /**
   * Parses the Wordle index.html file to extract the javascript file
   *
   * Uses a regex to match a capture group representing the name of
   * the javascript file where the Wordle answers are stored.
   *
   * @param {string} html text
   * @returns {string} javascriptFilename
   */
  public static parseWordleIndex(html: string) {
    return html.match(/<script src="(main.*?js)"><\/script>/)?.[1] ?? '';
  }

  /**
   * Parses the Wordle javascript file to extract the list of answers
   *
   * Uses a regex to match a capture group representing the array of
   * wordle answers.
   *
   * @param {string} jsFile text
   * @returns {string[]} words
   */
  public static parseWordleJavascript(jsFile: string) {
    try {
      const array = jsFile.match(/;var ..=(\[.*?\])/)?.[1];
      return JSON.parse(array ?? '[]');
    } catch (e) {
      return [];
    }
  }

  /**
   * Parses a list of words from various raw github files
   *
   * Files are expected to consist of a comment on the first line,
   * followed by a 5-letter word on each of the following lines.
   * Blank lines can occur, but are not included in the returned array.
   *
   * @param {string} text to parse
   * @param {boolean} sort or not to sort
   * @returns {string[]} words
   */
  public static parseWordlistResponse(text: string, sort = true) {
    const strArray = text.split('\n')
      .slice(1); // Omit the first line
    if (sort) {
      strArray.sort();
    }
    return strArray.reduce((acc: string[], str) => {
      if (str) {
        acc.push(str);
      }
      return acc;
    }, []);
  }
}
