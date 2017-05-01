const guessMetadata = require('../');

const guessedMetadata = guessMetadata('Bobby - The Greatest Bob (Audio)');

console.log(guessedMetadata);
// {artist: 'Bobby', title: 'The Greatest Bob'}