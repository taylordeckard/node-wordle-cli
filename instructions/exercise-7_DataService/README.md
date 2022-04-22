# Exercise-7: DataService

The [DataService](/src/classes/DataService.ts) class is used to retrieve, parse, and cache data.

In order for the cache to be shared across all dependent classes, the [DataService](/src/classes/DataService.ts) needs to be a singleton.

Firstly, correct the logic of the `instance` getter method so that only one instance is ever instantiated.

Next, make sure that all of the getter methods that make API requests are caching the respective responses.

Check your solution with:
```sh
npm run test:7
```
