import { DataService } from './DataService';
import { Guess } from './Guess';
import { Logger } from './Logger';
import {
  ELIM_MAX_ITER,
  ELIM_MAX_TRIES,
  ELIM_MIN_OPTIONS,
  ELIM_MIN_REMAINING,
  MAX_ATTEMPTS,
  MESSAGES,
} from '../const';

const {
  RAN_OUT_OF_GUESSES,
  SCORE_DISTRIBUTION,
  SIMULATION_RESULT,
  YOU_LOSE,
  YOU_WIN,
} = MESSAGES;

/**
 * Logic to solve Wordle
 */
export class Solver {
  /** All of the real Wordle answers */
  private _answers: string[] = [];

  /** List of words sorted by most common */
  private _commonWords: string[] = [];

  /** Turn debug logs on or off */
  private _debug = false;

  /** The 5-letter guess string */
  private _guessString = '';

  /** List of words remaining on the last guess of each loss (key is answer) */
  private _lossMetrics: { [key: string]: string[] } = {};

  /** List of words to be used for the next guess */
  private _nextOptions: string[] = [];

  /** Number of times an "elimination guess" has been used in a single game */
  private _eliminationGuessCount = 0;

  /** Prior guesses for a single game */
  private _priorGuesses: Guess[] = [];

  /** Whether or not the particular Wordle is solved */
  private _solved = false;

  /** The first guess used for all attempts to solve */
  private _firstGuess = '';

  /** Number of guesses in a single game mapped to number of wins for that amount for all games */
  private _scoreDistribution: { [key:number]: number } = {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
  };

  /** Number of total wins */
  private _wins = 0;

  /** Number of games to play (if undefined, all answers are played) */
  private _iterations: number | undefined;

  /** When _hard is true, the "elimination guess" strategy is not used */
  private _hard = false;

  /**
   * Initialize the dataset for playing the games
   */
  private async _init() {
    const ds = DataService.instance;
    const [
      starterWords,
      answers,
      commonWords,
    ] = await Promise.all([
      ds.starterWords,
      ds.realWordlist,
      ds.allWordsOrdered,
    ]);
    this._answers = answers;
    this._commonWords = commonWords;
    [,,,, this._firstGuess] = starterWords;
  }

  /**
   * Begins solving Wordle(s)
   *
   * @param {{iterations,debug,hard,solution}} options from CLI
   */
  public async solve({
    iterations = undefined,
    debug = false,
    hard = false,
    solution,
  }: {
    /** Number of games to play (if undefined, all answers are played) */
    iterations: number | undefined;
    /** Turn debug logs on or off */
    debug: boolean;
    /** When _hard is true, the "elimination guess" strategy is not used */
    hard: boolean;
    /** When solution option is supplied via CLI arg, only that word is solved */
    solution?: string;
  }) {
    this._iterations = iterations;
    this._debug = debug;
    this._hard = hard;
    await this._init();
    if (solution) {
      this._iterations = 1;
      this._simulateGame(solution);
    } else {
      this._answers.slice(0, this._iterations)
        .forEach(this._simulateGame.bind(this));
    }
    this._logFinalResult();
  }

  /**
   * Resets the state of the Solver after a game
   */
  private _resetState() {
    this._guessString = this._firstGuess;
    this._priorGuesses = [];
    this._nextOptions = [];
    this._solved = false;
    this._eliminationGuessCount = 0;
  }

  /**
   * Simulates a game
   *
   * @param {string} solution to the Wordle
   */
  private _simulateGame(solution: string) {
    if (!solution) { return; }
    this._resetState();
    for (let i = 0; i < MAX_ATTEMPTS; i += 1) {
      const { guess, won } = this._makeGuess(solution, i);
      if (won) { break; }
      this._lossMetrics[solution] = { ...this._nextOptions };
      this._calculateNextGuess(guess);
      if (!this._hard) {
        this._decideElimination(guess, i);
      }
      if (!this._guessString) {
        if (this._debug) {
          Logger.printf(RAN_OUT_OF_GUESSES, solution);
        }
        break;
      }
    }
    if (!this._solved) {
      if (this._debug) {
        Logger.printf(YOU_LOSE, solution);
      }
    } else {
      delete this._lossMetrics[solution];
    }
  }

  /**
   * Makes a guess
   *
   * @param {string} solution to the Wordle
   * @param {number} i guess iteration of the current game
   * @returns {{guess, won}} result
   */
  private _makeGuess(solution: string, i: number) {
    const guess = new Guess(
      this._guessString,
      solution,
      this._priorGuesses[this._priorGuesses.length - 1],
    )
      .markGreen()
      .markYellow();
    if (this._debug) {
      guess.logOutput();
    }

    if (this._guessString === solution) {
      if (this._debug) {
        Logger.printf(YOU_WIN);
      }
      this._wins += 1;
      this._scoreDistribution[i] += 1;
      this._solved = true;
      return { guess, won: true };
    }
    return { guess, won: false };
  }

  /**
   * Calculates what the next guess should be using prior guesses
   *
   * @param {Guess} guess of the current iteration
   */
  private _calculateNextGuess(guess: Guess) {
    this._priorGuesses.push(guess);
    this._nextOptions = guess.filterOptions(this._commonWords);
    let nextGuessIdx = 0;
    this._guessString = this._nextOptions[nextGuessIdx];
    while (this._priorGuesses.some((pg) => pg.guess === this._guessString)) {
      nextGuessIdx += 1;
      this._guessString = this._nextOptions[nextGuessIdx];
    }
  }

  /**
   * Whether or not an "elimation guess" should be used for the current guess iteration
   *
   * @param {Guess} guess of the current iteration
   * @param {number} i current guess iteration
   * @returns {boolean} _shouldEliminate
   */
  private _shouldEliminate(guess: Guess, i: number) {
    const hasMoreThanOneOptionLeft = this._nextOptions.length > 1;
    const optionsHaveBeenReduced = this._nextOptions.length > ELIM_MIN_OPTIONS;
    const numUnsolved = guess.correctness.filter((c) => c === 'absent').length;
    const remainingUnsolvedMeetsThreshold = numUnsolved <= ELIM_MIN_REMAINING;
    const isBelowIterationMax = i <= ELIM_MAX_ITER;
    const isBelowTryMax = this._eliminationGuessCount <= ELIM_MAX_TRIES;
    const isLastChanceToEliminate = i === ELIM_MAX_ITER;
    const remainingOptionsMeetsThreshold = this._nextOptions.length < MAX_ATTEMPTS;
    return hasMoreThanOneOptionLeft && (((optionsHaveBeenReduced || remainingUnsolvedMeetsThreshold)
      && isBelowIterationMax
      && isBelowTryMax)
      || (remainingOptionsMeetsThreshold && isLastChanceToEliminate));
  }

  /**
   * Finds a good word to use for elimination
   *
   * @param {Guess} guess of the current iteration
   * @returns {string} eliminationWord
   */
  private _findEliminationWord(guess: Guess) {
    let elimWord;
    const topFiveLetters = guess.getTopFiveAbsentLetters(this._nextOptions);
    for (let i = 0; i < 5; i += 1) {
      elimWord = this._commonWords
        .find((word) => topFiveLetters.slice(i)
          .every((l) => word.includes(l)));
      if (elimWord) { break; }
    }
    return elimWord;
  }

  /**
   * Checks whether or not an "elimination guess" should be used and chooses
   * one if so.
   *
   * @param {Guess} guess of the current iteration
   * @param {number} i current guess iteration
   */
  private _decideElimination(guess: Guess, i: number) {
    if (this._shouldEliminate(guess, i)) {
      const elimWord = this._findEliminationWord(guess);
      if (elimWord) {
        this._guessString = elimWord;
        this._eliminationGuessCount += 1;
      }
    }
  }

  /**
   * Logs the results after all solving is finished
   */
  private _logFinalResult() {
    if (this._debug && Object.keys(this._lossMetrics).length) {
      Logger.printf(JSON.stringify(this._lossMetrics, null, 2));
    }
    const totalAttempts = this._iterations ? this._iterations : this._answers.length;
    const winPercentage = ((this._wins / totalAttempts) * 100).toFixed(2);
    Logger.printf(SIMULATION_RESULT, this._wins, totalAttempts, winPercentage);
    this._logScoreDistribution();
  }

  /**
   * Logs the score distribution
   */
  private _logScoreDistribution() {
    Logger.printf(
      SCORE_DISTRIBUTION,
      this._scoreDistribution[0],
      this._scoreDistribution[1],
      this._scoreDistribution[2],
      this._scoreDistribution[3],
      this._scoreDistribution[4],
      this._scoreDistribution[5],
    );
  }
}
