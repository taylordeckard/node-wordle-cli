# Exercise-3: Commander

This project uses [commander.js](https://github.com/tj/commander.js/) to parse command line arguments and options.

The program is initialized in [src/index.ts](/src/index.ts) using command configurations located in [src/commands/index.ts](/src/commands/index.ts).

Notice, the [solve.ts](/src/commands/solve.ts) command has several options that are passed through to the action handler via function parameters.

The action handler calls the `solve` method of a newly instantiated [Solver](/src/classes/Solver.ts) class.

You can run this command with the script:
```sh
npm start -- solve
```

For this exercise, add an option to the [solve.ts](/src/commands/solve.ts) command to print debug logs. The option should be invoked with a `--debug` flag from CLI.
i.e. `npm start -- solve --debug`

When `--debug` is present the [Solver](/src/classes/Solver.ts) constructor should assign `true` to the value of `this._debug`, which will turn on logging within the class.

Test your solution with:
```
npm run test:3
```
