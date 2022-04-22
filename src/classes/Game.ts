import { DataService } from './DataService';
import { Prompter } from './Prompter';
import { Guess } from './Guess';
import { Logger } from './Logger';
import { MAX_ATTEMPTS, MESSAGES } from '../const';

const { YOU_WIN, YOU_LOSE } = MESSAGES;

/**
 * CLI that accepts user input for Wordle
 */
export class Game {
  /** Whether or not the puzzle has been solved */
  private _solved = false;

  /** The answer to today's wordle */
  private _solution = '';

  /**
   * Starts the game
   */
  public async start() {
    const ds = DataService.instance;
    this._solution = (await ds.solution) ?? '';
    const prompter = new Prompter();
    for (let i = 0; i < MAX_ATTEMPTS; i += 1) {
      const { guess } = await prompter.promptUserGuess(MAX_ATTEMPTS - i);
      new Guess(guess, this._solution)
        .markGreen()
        .markYellow()
        .logOutput();

      if (guess === this._solution) {
        Logger.printf(YOU_WIN);
        this._solved = true;
        break;
      }
    }
    if (!this._solved) {
      Logger.printf(YOU_LOSE, this._solution);
    }
  }
}
