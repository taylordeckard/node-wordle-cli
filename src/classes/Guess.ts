import { Colorizer } from './Colorizer';
import {
  Correctness,
  FiveCorrectnessArray,
  FiveStringArray,
  IGuess,
} from '../types';
import { LogsReturnValue } from '../decorators';

/**
 * Represents a 5-letter Wordle guess
 */
export class Guess implements IGuess<Guess> {
  /**
   * An array (length 5) that denotes the state of characters
   * from the current guess
   *
   * ['green', 'absent', 'absent', 'yellow', 'absent']
   */
  private _correctness: FiveCorrectnessArray = [
    Correctness.ABSENT,
    Correctness.ABSENT,
    Correctness.ABSENT,
    Correctness.ABSENT,
    Correctness.ABSENT,
  ];

  /** An array of chars (length 5) representing the guess */
  private _guess: FiveStringArray;

  /** An array of color-formatted characters for printing to the console */
  private _output: FiveStringArray;

  /** The prior guess (if applicable) */
  private _priorGuess?: Guess;

  /**
   * The characters of the solution that have not been guessed yet.
   * If the letter is known to be correct, the letter is replaces with ''
   *
   * E.g. ['w', '', 'r', 'd', '']
   */
  private _remainingChars: FiveStringArray;

  /** The Wordle solution */
  private _solution: FiveStringArray;

  /**
   * Initialize the Guess class
   *
   * @param {string} guess for Wordle
   * @param {string} solution of the game
   * @param {Guess} priorGuess from the previous (if applicable)
   */
  constructor(guess: string, solution: string, priorGuess?: Guess) {
    this._guess = guess.split('') as FiveStringArray;
    this._output = guess.split('') as FiveStringArray;
    this._solution = solution.split('') as FiveStringArray;
    this._remainingChars = solution.split('') as FiveStringArray;
    this._priorGuess = priorGuess;
  }

  /**
   * Getter method for _correctness
   *
   * @returns {FiveCorrectnessArray} correctness
   */
  public get correctness() {
    return this._correctness;
  }

  /**
   * Getter method for _guess
   *
   * @returns {string} guess
   */
  public get guess() {
    return this._guess.join('');
  }

  /**
   * Calculates letters from this and previous guesses that are known to not be included
   * in the solution;
   *
   * @returns {string[]} absentLetters
   */
  public get absentLetters(): string[] {
    return Array.from(new Set([
      ...this._correctness.reduce((acc: string[], c, idx) => {
        if (c === 'absent') {
          acc.push(this._guess[idx]);
        }
        return acc;
      }, []),
      ...(this._priorGuess?.absentLetters ?? []),
    ]));
  }

  /**
   * Returns indexes of the letters that are not yet known to be correct.
   *
   * @returns {number[]} absentIndexes
   */
  public get absentIndexes() {
    return this.getCorrectLetters().reduce((acc: number[], c, idx) => {
      if (c === '') {
        acc.push(idx);
      }
      return acc;
    }, []);
  }

  /**
   * Returns letters of the alphabet that have yet to be guessed
   *
   * @returns {string[]} remainingLetters
   */
  public get remainingLetters() {
    const allLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
      'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    const { absentLetters } = this;
    return allLetters.reduce((acc: string[], char) => {
      if (!absentLetters.includes(char) && !this.getCorrectLetters().includes(char)) {
        acc.push(char);
      }
      return acc;
    }, []);
  }

  /**
   * Returns letters that are known to be included in the solution
   *
   * @returns {string[]} knownLetters
   */
  public get knownLetters() {
    return Array.from(new Set([
      ...this.getYellowLetters(),
      ...this.getCorrectLetters().filter((cl) => cl !== ''),
    ]));
  }

  /**
   * Returns all priorGuesses by recursively searching the _priorGuess
   * chain
   *
   * @returns {Guess[]} priorGuesses
   */
  public get priorGuesses(): Guess[] {
    if (this._priorGuess) {
      return [...(this._priorGuess.priorGuesses), this._priorGuess];
    }
    return [];
  }

  /**
   * Marks letters of the guess as green (correct)
   *
   * @returns {Guess} guess
   */
  public markGreen() {
    for (let i = 0; i < 5; i += 1) {
      const guessChar = this._guess[i];
      const actualChar = this._solution[i];
      if (guessChar === actualChar) {
        this._output[i] = Colorizer.green(guessChar);
        this._correctness[i] = Correctness.GREEN;
        this._remainingChars[i] = '';
      }
    }
    return this;
  }

  /**
   * Marks letters of the guess as yellow (included in solution but wrong index)
   *
   * @returns {Guess} guess
   */
  public markYellow() {
    for (let i = 0; i < 5; i += 1) {
      const guessChar = this._guess[i];
      if (this._remainingChars.includes(guessChar) && guessChar !== this._solution[i]) {
        this._correctness[i] = Correctness.YELLOW;
        this._output[i] = Colorizer.yellow(guessChar);
      }
    }
    return this;
  }

  /**
   * Returns the output string with characters colored according to correctness
   *
   * @returns {string} output
   */
  @LogsReturnValue()
  public logOutput() {
    return this._output.join('');
  }

  /**
   * Returns a list of words, filtered by prior guess correctness
   *
   * @param {string[]} options to be filtered
   * @returns {string[]} matches
   */
  public filterOptions(options: string[]) {
    const priorFilteredOptions: string[] = Array.from(new Set(
      this._priorGuess?.filterOptions(options) ?? options,
    ));
    const greenMatches = this._filterGreenMatches(priorFilteredOptions);
    const yellowMatches = this._filterYellowMatches(greenMatches);
    const nonAbsentMatches = this._filterNonAbsentMatches(yellowMatches);
    return nonAbsentMatches;
  }

  /**
   * Returns an array of the known correct letters and their position.
   *
   * If the letter at a position is unknown, the character is marked with ''
   *
   * @returns {FiveStringArray} letters
   */
  public getCorrectLetters(): FiveStringArray {
    return [...this.priorGuesses, this].reduce((acc: FiveStringArray, pg) => acc.map((_, idx) => {
      if (pg.correctness[idx] === 'green') {
        return pg.guess[idx];
      }
      return acc[idx];
    }) as FiveStringArray, ['', '', '', '', '']);
  }

  /**
   * Returns letters that are known to be included in the solution, but their position
   * is not yet known.
   *
   * @returns {string[]} yellowLetters
   */
  public getYellowLetters(): string[] {
    return Array.from(new Set([...this.priorGuesses, this].reduce((acc: string[], pg) => {
      pg.correctness.forEach((c, idx) => {
        if (c === 'yellow') {
          acc.push(pg.guess[idx]);
        }
      });
      return acc;
    }, [])));
  }

  /**
   * Returns a filtered list of options (possible guesses) given the green (correct letter and
   * position) letters from this and previous guesses
   *
   * @param {string[]} options to be filtered
   * @returns {string[]} greenMatches
   */
  private _filterGreenMatches(options: string[]) {
    return options.filter((word) => {
      const chars = word.split('');
      return chars.every((c, idx) => (this._correctness[idx] === 'green'
        && c === this._guess[idx]) || this._correctness[idx] !== 'green');
    });
  }

  /**
   * Returns a filtered list of options (possible guesses) given the yellow (correct letter but
   * incorrect position) letters from this and previous guesses
   *
   * @param {string[]} options to be filtered
   * @returns {string[]} yellowMatches
   */
  private _filterYellowMatches(options: string[]) {
    return options.filter((word) => {
      const chars = word.split('');
      const matches = (new Array(5)).fill(false);
      for (let i = 0; i < chars.length; i += 1) {
        if (this._correctness[i] === 'yellow' && chars[i] !== this._guess[i]) {
          matches[i] = chars.some((c, idx) => {
            if (this._correctness[idx] !== 'green') {
              return c === this._guess[i];
            }
            return false;
          });
        } else if (this._correctness[i] !== 'yellow') {
          matches[i] = true;
        }
      }
      return matches.every((m) => m);
    });
  }

  /**
   * Returns a filtered list of options (possible guesses) given the absent (incorrect)
   * letters from this and previous guesses
   *
   * @param {string[]} options to be filtered
   * @returns {string[]} absentMatches
   */
  private _filterNonAbsentMatches(options: string[]) {
    const { absentLetters } = this;
    const correctLetters = this.getCorrectLetters();
    return options.filter((word) => {
      let good = true;
      correctLetters.forEach((c, idx) => {
        const wordMinusCorrectIdx = word.split('').reduce((acc: string[], w, wIdx) => {
          if (c === '' && wIdx === idx) {
            acc.push(w);
          }
          return acc;
        }, []);
        if (c === '' && wordMinusCorrectIdx.some((wmci) => absentLetters.includes(wmci))) {
          good = false;
        }
      });
      return good;
    });
  }

  /**
   * Returns the top-5 most common letters from a given array of options at the indexes of
   * the solution that are currently unknown
   *
   * @param {string[]} options to find common absent letters from
   * @returns {string[]} topFiveAbsentLetters
   */
  public getTopFiveAbsentLetters(options: string[]) {
    const yellowLetters = this.getYellowLetters();
    const missingIndexes = this.absentIndexes;
    const letterIndexMap = options.reduce((acc: { [key:string]: number }, opt) => {
      missingIndexes.forEach((j) => {
        if (!acc[opt[j]]) {
          acc[opt[j]] = 1;
        } else {
          acc[opt[j]] += 1;
        }
      });
      return acc;
    }, {});
    yellowLetters.forEach((yl) => delete letterIndexMap[yl]);
    const letterCounts = Object.entries(letterIndexMap).sort((a, b) => {
      if (a[1] < b[1]) {
        return 1;
      } if (a[1] > b[1]) {
        return -1;
      }
      return 0;
    });
    return letterCounts
      .map((lc) => lc[0])
      .filter((_, idx) => idx < 5)
      .reverse();
  }
}
