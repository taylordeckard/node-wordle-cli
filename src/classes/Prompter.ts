import { inquirer } from '../utils';
import { DataService } from './DataService';
import { Validator } from './Validator';

/**
 * Prompts for user input
 */
export class Prompter {
  /** The words that are acceptable as input */
  private _acceptableGuesses: string[] | undefined;

  /**
   * Prompts user for input and returns the string the user entered, if valid.
   *
   * @param {number} attemptsRemaining number of guesses left
   * @returns {Promise<string>} guess
   */
  public async promptUserGuess(attemptsRemaining: number) {
    if (!this._acceptableGuesses) {
      const ds = DataService.instance;
      this._acceptableGuesses = await ds.wordlist;
    }

    return inquirer.prompt([
      {
        message: `Guess a 5-letter word (${attemptsRemaining} attempts remaining):`,
        name: 'guess',
        transformer: (input: string) => input.toLowerCase(),
        type: 'input',
        validate: Validator.checkGuess.bind(this, this._acceptableGuesses),
      },
    ]);
  }
}
