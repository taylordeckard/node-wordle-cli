export type FiveStringArray = [string, string, string, string, string];
export type FiveCorrectnessArray = [
  Correctness,
  Correctness,
  Correctness,
  Correctness,
  Correctness,
];
export enum Correctness {
  GREEN = 'green',
  YELLOW = 'yellow',
  ABSENT = 'absent',
}
export interface IGuess<T> {
  absentIndexes: number[];
  absentLetters: string[];
  correctness: FiveCorrectnessArray;
  filterOptions (options: string[]): string[];
  getCorrectLetters (): FiveStringArray;
  getTopFiveAbsentLetters (options: string[]): string[];
  getYellowLetters (): string[];
  guess: string;
  knownLetters: string[]
  logOutput (): string;
  markGreen (): T;
  markYellow (): T;
  priorGuesses: T[];
  remainingLetters: string[];
}
