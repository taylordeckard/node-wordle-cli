import { program } from 'commander';
import { commands } from './commands';

program
  .name('wordle')
  .description('A CLI Wordle clone')
  .version('1.0.0');

commands.forEach((command) => {
  let pgm = program
    .command(command.name)
    .description(command.description);
  if (command.options?.length) {
    command.options.forEach((opt) => {
      pgm = pgm.option(opt.invocation, opt.description, opt.default);
    });
  }
  pgm = pgm.action(command.action);
});

program.parse(process.argv);
