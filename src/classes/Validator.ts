import validator from 'validator';

/**
 * Validates things
 */
export class Validator {
  /**
   * Checks that a guess word is valid for Wordle
   *
   * See https://github.com/validatorjs/validator.js for more info on the
   * validator API.
   *
   * @param {string[]} acceptableGuesses list of allowable words that can be used as guesses
   * @param {string} input word to be validated
   * @returns {boolean} valid
   */
  public static checkGuess(acceptableGuesses: string[], input: string) {
    if (!validator.isAlpha(input)) {
      return 'Input must be letters A-Z';
    }
    if (!validator.isLength(input, { min: 5, max: 5 })) {
      return 'Input must be exactly 5 letters';
    }
    if (!acceptableGuesses.includes(input)) {
      return 'Not a valid word';
    }
    return true;
  }

  /**
   * Checks that validator has been imported
   *
   * @returns {boolean} hasValidator
   */
  public static hasValidator() {
    return typeof validator !== undefined;
  }
}
