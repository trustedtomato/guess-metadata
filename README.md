# guess-metadata
Guess metadata by title.

```
const guessMetadata = require('guess-metadata');

const guessedMetadata = guessMetadata('Bobby - The Greatest Bob (Audio)');

console.log(guessedMetadata);
// {artist: 'Bobby', title: 'The Greatest Bob', genres: []}
```

## Installation
```
$ npm install guess-metadata --save
```

## Advanced examples
See [test/test.js](https://github.com/trustedtomato/guess-metadata/blob/master/test/test.js) for all the title types which are tested.

## Issues
If you have a title which does not return the expected value, please search for the issue; if the issue doesn't exist yet, open a new issue.