import { Command } from '../types';
import { StartCommand as startCommand } from './start';
import { SolveCommand as solveCommand } from './solve';

export const commands: Command[] = [
  startCommand,
  solveCommand,
];
