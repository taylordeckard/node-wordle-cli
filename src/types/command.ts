import { Command as Cmd, OptionValues } from 'commander';

export interface CommandOption {
  invocation: string;
  description: string;
  default?: string;
}

export interface Command {
  action: (options: OptionValues, program: Cmd) => void;
  description: string;
  name: string;
  options?: CommandOption[];
}
