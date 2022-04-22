# Exercise-5: Parser

The [Parser](/src/classes/Parser.ts) class is used to convert text from remote datasources into a format usable by the program.

Three methods should be implemented for this class:
1. parseWordleIndex
   - Use the provided regex to extract the filename of the javascript file.
   - Accepts the html text as an input parameter.
   - Returns the string filename of the javascript file.
2. parseWordleJavascript
   - Use the provided regex to extract the wordle answers from the javascript text.
   - Accepts the javascript text as an input parameter.
   - Returns an array of strings.
3. parseWordlistResponse
   - Parse a blob of text that consists of a word on each line. (Find more details in the function comment.)
   - Accepts the text as an input parameter.
   - Returns an array of strings.

Check your solution with:
```sh
npm run test:5
```
