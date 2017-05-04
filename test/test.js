const util = require('util');
const chalk = require('chalk');
const assert = require('assert');
const guessMetadata = require('../');

const titles = [
	['Seeb - Breathe (Lyric Video) ft. Neev',{artist: 'Seeb', title: 'Breathe ft. Neev'}],
	['Disclosure - You & Me feat. Eliza Doolittle (Flume Remix)',{artist: 'Disclosure', title: 'You & Me ft. Eliza Doolittle (Flume Remix)'}],
	['Eminem - Lose Yourself [HD]',{artist: 'Eminem', title: 'Lose Yourself'}],
	['Capital Cities- "Tell Me How to Live"',{artist: 'Capital Cities', title: 'Tell Me How to Live'}],
	['Capital Cities - "Love Away"',{artist: 'Capital Cities', title: 'Love Away'}],
	['AWOLNATION Hollow Moon (Bad Wolf)',{artist: 'AWOLNATION Hollow Moon (Bad Wolf)', title: 'AWOLNATION Hollow Moon (Bad Wolf)'}],
	['Milky Chance - Stolen Dance (Album Version)',{artist: 'Milky Chance', title: 'Stolen Dance (Album Version)'}],
	['[Electro] - Pegboard Nerds - Disconnected [Monstercat Release]',{artist: 'Pegboard Nerds', title: 'Disconnected', genres: ['Electro']}],
	['Skrillex & Damian "Jr Gong" Marley - "Make It Bun Dem" [Audio]',{artist: 'Skrillex & Damian "Jr Gong" Marley', title: 'Make It Bun Dem'}],
	['Robin Thicke - Feel Good (Oliver Heldens Remix) (OUT NOW)',{artist: 'Robin Thicke', title: 'Feel Good (Oliver Heldens Remix)'}],
	['HONEYBEAST – A legnagyobb hős',{artist: 'HONEYBEAST', title: 'A legnagyobb hős'}],
	['Justin Bieber - Sorry (PURPOSE: The Movement)',{artist: 'Justin Bieber', title: 'Sorry'}],
	['Wiz Khalifa - See You Again ft. Charlie Puth [Official Video] Furious 7 Soundtrack',{artist: 'Wiz Khalifa', title: 'See You Again ft. Charlie Puth'}],
	['ZAYN - PILLOWTALK',{artist: 'ZAYN', title: 'PILLOWTALK'}],
	['Kehlani - Gangsta (From Suicide Squad: The Album) [Official Video]',{artist: 'Kehlani', title: 'Gangsta'}],
	['Charlie Puth - We Don\'t Talk Anymore (feat. Selena Gomez) [Official Video]',{artist: 'Charlie Puth', title: 'We Don\'t Talk Anymore ft. Selena Gomez'}],
	['DJ Snake ft. Justin Bieber - Let Me Love You [Lyric Video]',{artist: 'DJ Snake', title: 'Let Me Love You ft. Justin Bieber'}],
	['R3hab & Ciara - Get Up (KSHMR Remix) [Lyric Video]',{artist: 'R3hab & Ciara', title: 'Get Up (KSHMR Remix)'}],
	['Nto Grant Lazlo -- Minor Swag',{artist: 'Nto Grant Lazlo', title: 'Minor Swag'}],
	['Punnany Massif: Szabadon (Na-Na-Na) / Freedom song - Official Sziget Festival 2013 Anthem',{artist: 'Punnany Massif', title: 'Szabadon'}],
	['Radical Face \'Welcome Home\'',{artist: 'Radical Face', title: 'Welcome Home'}],
	['Hó Márton és a Jetik - Rész-egész',{artist: 'Hó Márton és a Jetik', title: 'Rész-egész'}],
	['Hó Márton és a Jetik: Papageno dala',{artist: 'Hó Márton és a Jetik', title: 'Papageno dala'}],
	['twenty one pilots: Ride (Video)',{artist: 'twenty one pilots', title: 'Ride'}],
	['Jamie Berry - Sweet Rascal | Electro Swing',{artist: 'Jamie Berry', title: 'Sweet Rascal', genres: ['Electro Swing']}],
	['Electro Swing || Jamie Berry - Peeping Tom Feat. Rosie Harte',{artist: 'Jamie Berry', title: 'Peeping Tom ft. Rosie Harte', genres: ['Electro Swing']}],
	['Loituma - "Ievan Polkka" (Eva\'s Polka)1996',{artist: 'Loituma', title: 'Ievan Polkka'}],
	['Moby \'In This World\' - Official video',{artist: 'Moby', title: 'In This World'}],
	['ไม่รักเธอ : โก๊ะ นิพนธ์ | Official MV',{artist: 'ไม่รักเธอ', title: 'โก๊ะ นิพนธ์'}],
	['Edge Casy: "I can do it #1" from Edges: The Album',{artist: 'Edge Casy', title: 'I can do it #1'}],
	['Edge Casy: "I can do it #2" - from Edges: The Album',{artist: 'Edge Casy', title: 'I can do it #2'}],
	['Edge Casy "I can do it #3" - from Edges: The Album',{artist: 'Edge Casy', title: 'I can do it #3'}],
	['Edge Casy "I can do it #3" - Edg-are remix',{artist: 'Edge Casy', title: 'I can do it #3 (Edg-are Remix)'}],
	['Vitas-Smile',{artist: 'Vitas', title: 'Smile'}],
	['Karma Fields & Morten | Stickup ft. Juliette Lewis',{artist: 'Karma Fields & Morten',title: 'Stickup ft. Juliette Lewis'}]
];

let counter = 0;
const errors = [];
titles.forEach((title,i) => {
	const correctParsedTitle = title[1];
	const parsedTitle = guessMetadata(title[0]);
	const simpleParsedTitle = Object.keys(correctParsedTitle).reduce((simpleParsedTitle,key) => {
		simpleParsedTitle[key] = parsedTitle[key];
		return simpleParsedTitle;
	},{});
	try{
		Object.keys(correctParsedTitle).forEach(key => {
			assert.deepStrictEqual(simpleParsedTitle[key],correctParsedTitle[key]);
		});
		counter++;
	}catch(err){
		errors.push([title,correctParsedTitle,simpleParsedTitle]);
	}
});
if(errors.length > 0){
	console.log('Errors:');
	errors.forEach(error => {
		console.log(chalk.red(util.inspect(error[2]))+' is not '+chalk.green(util.inspect(error[1])));
	});
	console.log();
	console.log('Success rate: '+chalk.green(counter+'/'+titles.length));
	throw 'Tests failed!';
}else{
	console.log(chalk.green('Success!'));
}