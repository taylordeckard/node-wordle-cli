import fetch from 'node-fetch';
import {
  COMMON_WORDLIST_URL,
  REAL_WORDLIST_URL,
  WORDLE_BASE_URL,
  WORDLE_INDEX_URL,
  WORDLIST_URL,
} from '../const';

/**
 * Class that makes http requests to remote endpoints
 */
export class API {
  /**
   * Fetches a list of common 5-letter words from github
   *
   * @returns {Promise<Response>} response
   */
  public static fetchCommonWordlist() {
    return this._executeFetch(COMMON_WORDLIST_URL);
  }

  /**
   * Fetches the list of real Wordle answers from github
   *
   * @returns {Promise<Response>} response
   */
  public static fetchRealWordlist() {
    return this._executeFetch(REAL_WORDLIST_URL);
  }

  /**
   * Fetches the list of acceptable Wordle guesses from github
   *
   * @returns {Promise<Response>} response
   */
  public static async fetchWordlist() {
    return this._executeFetch(WORDLIST_URL);
  }

  /**
   * Fetches the Wordle index.html file
   *
   * @returns {Promise<Response>} response
   */
  public static async fetchWordleIndex() {
    return this._executeFetch(WORDLE_INDEX_URL);
  }

  /**
   * Fetches the Wordle javascript file
   *
   * @param {string} filename of the javascript file to fetch
   * @returns {Promise<Response>} response
   */
  public static async fetchWordleJavascript(filename: string) {
    return this._executeFetch(`${WORDLE_BASE_URL}${filename}`);
  }

  /**
   * Common logic for making http requests
   *
   * @param {string} url to fetch
   * @returns {Promise<Response>} response
   */
  private static async _executeFetch(url: string) {
    const response = await fetch(url);
    let text = '';
    if (response.ok) {
      text = await response.text();
    }
    return text;
  }
}
