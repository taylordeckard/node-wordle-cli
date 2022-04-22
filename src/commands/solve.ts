import { Command } from '../types';
import { Solver } from '../classes';

type SolveFunction = InstanceType<typeof Solver>['solve'];
type SolveParameters = Parameters<SolveFunction>[0];

export const SolveCommand: Command = {
  name: 'solve',
  description: 'Attempts to solve Wordle',
  action: (opts) => {
    (new Solver()).solve(opts as SolveParameters);
  },
  options: [
    {
      invocation: '-d, --debug',
      description: 'Print debug logs',
    },
    {
      invocation: '-h, --hard',
      description: 'Use "hard" strategy (always guess using letters known to be correct)',
    },
    {
      invocation: '-i, --iterations [number]',
      description: 'Number of iterations to run the solving algorithm',
    },
    {
      invocation: '--solution <string>',
      description: 'Word to try to solve for',
    },
  ],
};
