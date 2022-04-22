# Exercise-1: Validator

Implement the [Valdator.ts](/src/classes/Validator.ts) `checkGuess` method.

Use the [validator.js](https://github.com/validatorjs/validator.js#validators) module to meet the criteria. Explicitly install version `^13.7.0` to ensure consistency.

Since this project is written in typescript, you will also need to install `@types/validator` as a dev-dependency (version `^13.7.2`.)

The method accepts two parameters:
1. An array of strings representing allowed guesses.
2. The guess string to be validated.

The method should validate the following:
1. The string consists of only alphabetic characters.
2. The string is not more or less than 5 characters in length.
3. The string is a word included in the list of acceptable words.

The method should return `true` the input is valid. Otherwise an error message should be returned.

Check your solution with:
```sh
npm run test:1
```
