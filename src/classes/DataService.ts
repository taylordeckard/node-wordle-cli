import { API } from './API';
import { Parser } from './Parser';
import { getAnswerIndex } from '../utils';

/**
 * Class to fetch remote data and store it for the duration
 * of the application runtime.
 */
export class DataService {
  private static _instance: DataService | undefined;

  /** All words that are acceptable input to the Wordle game */
  private _wordlist: string[] | undefined;

  /** All words from wordlist sorted with more common words coming first */
  private _allWordsOrdered: string[] | undefined;

  /** Subset of the wordlist sorted with more common words coming first */
  private _commonWordlist: string[] | undefined;

  /** Actual answers from the Wordle game */
  private _realWordlist: string[] | undefined;

  /** Today's solution to Wordle */
  private _solution: string | undefined;

  /** Words that are good to use as the first guess */
  private _starterWords = [
    'react', 'adieu', 'later', 'sired', 'tears', 'alone',
    'arise', 'about', 'atone', 'irate', 'snare', 'cream',
    'paint', 'worse', 'sauce', 'anime', 'prowl', 'roast',
    'drape', 'media',
  ];

  /**
   * Constructor is private to enforce Singleton pattern
   */
  private constructor() {
    // No logic needed
  }

  /**
   * This is an example of a Singleton, i.e. only one instance of this class is created
   * for the duration of the application runtime
   *
   * @returns {DataService} singleton
   */
  public static get instance() {
    if (!this._instance) {
      this._instance = new DataService();
    }
    return this._instance;
  }

  /**
   * Returns a list of common words that are part of the realWordList, ordered by how common
   * they are.
   *
   * If the commonWordlist is not present locally, fetches from
   * remote location
   *
   * @returns {Promise<string[]>} commonWordlist
   */
  public get commonWordlist(): Promise<string[]> {
    // A getter cannot itself be async, but it can return a Promise
    return (async () => {
      if (!this._commonWordlist) {
        this._commonWordlist = Parser
          .parseWordlistResponse(await API.fetchCommonWordlist(), false);
      }
      return this._commonWordlist;
    })();
  }

  /**
   * Returns a subset of the wordlist that has or will someday be a solution to Wordle.
   *
   * If the realWordlist is not present locally, fetches from
   * remote location
   *
   * @returns {Promise<string[]>} realWordlist
   */
  public get realWordlist(): Promise<string[]> {
    // A getter cannot itself be async, but it can return a Promise
    return (async () => {
      if (!this._realWordlist) {
        this._realWordlist = Parser.parseWordlistResponse(await API.fetchRealWordlist());
      }
      return this._realWordlist;
    })();
  }

  /**
   * Returns all words that are possible to enter into Wordle as a guess.
   *
   * If the wordlist is not present locally, fetches from
   * remote location
   *
   * @returns {Promise<string[]>} wordlist
   */
  public get wordlist(): Promise<string[]> {
    // A getter cannot itself be async, but it can return a Promise
    return (async () => {
      if (!this._wordlist) {
        this._wordlist = Parser.parseWordlistResponse(await API.fetchWordlist());
      }
      return this._wordlist;
    })();
  }

  /**
   * Get the actual solution to today's Wordle
   *
   * @returns {Promise<string>} solution
   */
  public get solution() {
    return (async () => {
      if (!this._solution) {
        const indexHtml = await API.fetchWordleIndex();
        const jsFilename = Parser.parseWordleIndex(indexHtml);
        const jsFile = await API.fetchWordleJavascript(jsFilename);
        const allAnswers = Parser.parseWordleJavascript(jsFile);
        this._solution = allAnswers[getAnswerIndex()];
      }
      return this._solution;
    })();
  }

  /**
   * Returns a list of the best words to guess first in Wordle
   *
   * @returns {string[]} list
   */
  public get starterWords() {
    return this._starterWords;
  }

  /**
   * Returns all words from wordlist sorted with more common words coming first
   *
   * @returns {string[]} list
   */
  public get allWordsOrdered() {
    return (async () => {
      if (!this._allWordsOrdered) {
        const wordlist = await this.wordlist;
        const words = [
          ...(await this.commonWordlist),
          ...wordlist,
        ].reduce((acc: string[], word) => {
          // Remove unacceptable words found in commonWordList
          if (wordlist.includes(word)) {
            acc.push(word);
          }
          return acc;
        }, []);
        // Put a few more common words before less common words
        const moreCommonWords = [
          { more: 'bloke', less: 'looke' },
          { more: 'boozy', less: 'booby' },
          { more: 'condo', less: 'codon' },
          { more: 'corer', less: 'codon' },
          { more: 'elide', less: 'edile' },
          { more: 'embed', less: 'ebbed' },
          { more: 'fjord', less: 'moord' },
          { more: 'gooey', less: 'bogey' },
          { more: 'homer', less: 'zomer' },
          { more: 'modal', less: 'dolma' },
          { more: 'modem', less: 'eodem' },
          { more: 'oaken', less: 'waken' },
          { more: 'roach', less: 'orach' },
          { more: 'wacky', less: 'cacky' },
          { more: 'wooly', less: 'mooly' },
        ];
        moreCommonWords.forEach((mcw) => {
          // First remove the word
          const eIdx = words.findIndex((w) => w === mcw.more);
          words.splice(eIdx, 1);
          // Then insert the word before the less common word
          const idx = words.findIndex((w) => w === mcw.less);
          words.splice(idx, 0, mcw.more);
        });
        this._allWordsOrdered = words;
      }
      return this._allWordsOrdered;
    })();
  }
}
