/// <reference path="../typings/index.d.ts" />

const compact = <T>(arr:T[]):T[] => arr.filter(elem => elem);
const remove = <T>(arr:T[],validator:(elem:T)=>boolean):T[] => {
	const removed:T[] = [];
	for(let i = 0; i < arr.length; i++){
		if(validator(arr[i])){
			removed.push(arr[i]);
			arr.splice(i,1);
			i--;
		}
	}
	return removed; 
};


const genres:string[] = require('../genres.json');
const mainSeparators = '\u002D\u007E\u058A\u1806\u2010\u2011\u2012\u2013\u2014\u2015\u2053';
const quotations:[string,string][] = [
	['\u0022','\u0022'],
	['\u0027','\u0027'],
	['\u0060','\u00B4'],
	['\u2018','\u2019'],
	['\u201C','\u201D']
];
const brackets:[string,string][] = [
	['(',')'],
	['[',']'],
	['{','}']
];

const rawFeaturingRegex = '(?:(?:featuring)|(?:feat.?)|(?:ft.?))\\s+';
const featuringRegex = RegExp(rawFeaturingRegex+'(.*)','i');
const remixRegex = RegExp('(.*)\\s+remix','i');
const versionRegex = RegExp('(.*)\\s+version','i')
const coverRegex = RegExp('(.*\\scover\\s.*)','');

const titleAttributeHandlers:{validator:(attribute:string)=>boolean,handler:(parsed:{artist?:string,title?:string,album?:string,genres:string[]},matches:string[])=>void}[] = [
	{
		validator: (attribute) => featuringRegex.test(attribute),
		handler: (parsed,matches) => {
			const featurings = matches.map(match => match.match(featuringRegex)[1]);
			parsed.title = parsed.title + ' ft. ' + featurings.join(', ');
		}
	},{
		validator: (attribute) => remixRegex.test(attribute),
		handler: (parsed,matches) => {
			const remixes = matches.map(match => match.match(remixRegex)[1]);
			parsed.title = parsed.title + ' ('+remixes.join(' & ')+' remix)';
		}
	},{
		validator: (attribute) => versionRegex.test(attribute),
		handler: (parsed,matches) => {
			const versions = matches.map(match => match.match(versionRegex)[1]);
			parsed.title = parsed.title + ' ' + versions.map(version => '('+version+' version)').join(' ')
		}
	},{
		validator: (attribute) => coverRegex.test(attribute),
		handler: (parsed,matches) => {
			const covers = matches.map(match => match.match(coverRegex)[1]);
			parsed.title = parsed.title + ' ' + covers.map(cover => '('+cover+')').join(' ')
		}
	},{
		validator: (attribute) => {
			const lowerCased = attribute.toLowerCase();
			return genres.includes(lowerCased);
		},
		handler: (parsed,matches) => {
			parsed.genres.push(...matches);
		}
	}
];

export = (fullTitle:string):{artist:string,title:string,album?:string,genres:string[]} => {
	if(typeof fullTitle !== 'string'){
		throw new Error('fullTitle must be string!');
	}
	
	const parsedDefaults:{artist:string,title:string} = {
		artist: 'Anonymous',
		title: 'ID'
	};

	const parsed:{artist?:string,title?:string,album?:string,genres:string[]} = {
		genres: []
	};

	let mainParts = compact(fullTitle.split(eval('/['+mainSeparators+']+\\s+/ig')).map(part => part.trim()));
	
	
	/* extract genre if it is the first part between brackets */
	(function(){
		const isBracketed = brackets.some(([opening,closing]):boolean =>
			eval('/^\\'+opening+'.*\\'+closing+'$/').test(mainParts[0])
		);
		if(isBracketed){
			parsed.genres.push(mainParts.shift().slice(1,-1));
		}
	}());


	/* extract genre if it is in the first part before two vertical lines */
	(function(){
		const splitted = mainParts[0].split('||');
		if(splitted.length > 1){
			parsed.genres.push(splitted.shift().trim());
			mainParts[0] = splitted.join('||').trim();
		}
	}());

	
	/* extract title from first part if there is a string at the end surrounded by quotes */
	(function(){
		if(!parsed.title){
			const quoteType = quotations.find(([opening,closing]):boolean =>
				eval('/^.+?\\'+opening+'.+\\'+closing+'$/').test(mainParts[0])
			);
			if(quoteType){
				const match = mainParts[0].match(eval('/^(.+?)(?:\\:\\s*)?\\'+quoteType[0]+'(.+)\\'+quoteType[1]+'$/'));
				parsed.title = match[2].trim();
				mainParts.splice(0,1,match[1].trim());
			}
		}
	}());


	/* extract title from first part if the title is indicated by a colon then transform it into the general syntax */
	(function(){
		if(!parsed.title){
			const match = mainParts[0].match(/(.+?):\s+(.+)/);
			if(match){
				mainParts.splice(0,1,match[1].trim(),match[2].trim());
			}
		}
	}());


	/* extract title from second part if quotes are present then transfrom it into the general syntax */
	(function(){
		const quoteType = quotations.find(([opening,closing]):boolean =>
			eval('/^\\'+opening+'.+\\'+closing+'.*$/').test(mainParts[1])
		);
		if(quoteType){
			const match = mainParts[1].match(eval('/^\\'+quoteType[0]+'(.+)\\'+quoteType[1]+'\\s*(.*)$/'));
			parsed.title = match[1];
			mainParts.splice(1,1,match[2]);
		}
	}());

	/* clear mainParts */
	mainParts = compact(mainParts);

	/* extract artist if not parsed yet */
	(function(){
		if(!parsed.artist){
			const featuringMatch = mainParts[0].match(eval('/(.+?)\\s+('+rawFeaturingRegex+'.+)/i'));
			if(!featuringMatch){
				parsed.artist = mainParts[0];
			}else{
				parsed.artist = featuringMatch[1];
				mainParts.push(featuringMatch[2]);
			}
			mainParts.shift();
		}
	}());

	/* split every mainPart which contains a vertical line (|)*/
	mainParts = [].concat(...(mainParts.map(mainPart =>
		mainPart.split(/\s*\|+\s*/)
	)));

	/* extract title if not parsed yet */
	if(!parsed.title){
		if(mainParts.length === 0){
			parsed.title = parsed.artist;
			return Object.assign(parsedDefaults,parsed);
		}
		const firstBracketIndex = brackets.reduce((firstBracketIndex,bracket) => {
			let bracketIndex = mainParts[0].search(eval('/\\'+bracket[0]+'.*\\'+bracket[1]+'/i'));
			if(bracketIndex===-1) bracketIndex = Infinity;
			return Math.min(firstBracketIndex,bracketIndex);
		},Infinity);
		let featuringIndex = mainParts[0].search(eval('/'+rawFeaturingRegex+'/i'));
		if(featuringIndex===-1){
			featuringIndex = Infinity;
		}
		const titleEndIndex = Math.min(firstBracketIndex,featuringIndex);
		parsed.title = mainParts[0].slice(0,titleEndIndex).trim();
		const left = mainParts[0].slice(titleEndIndex).trim();
		mainParts.shift();
		if(left){
			mainParts.unshift(left);
		}
	}

	/* now mainParts only contains other attributes */
	/* flatten brackets in mainParts */
	for(let i = 0; i < mainParts.length; i++){
		const bracket = brackets.find(bracket => {
			return RegExp('^\\'+bracket[0]+'.*\\'+bracket[1]).test(mainParts[i]);
		});
		let value;
		if(bracket){
			const bracketEnd = mainParts[i].indexOf(bracket[1]);
			value = mainParts[i].slice(1,bracketEnd);
			const left = mainParts[i].slice(bracketEnd+1).trim();
			if(left){
				mainParts.push(left);
			}
		}else{
			const nextBracketIndex = brackets.reduce((minBracketIndex,bracket) => {
				let bracketIndex = mainParts[i].search(RegExp('\\'+bracket[0]+'.*\\'+bracket[1]));
				if(bracketIndex===-1) bracketIndex = Infinity;
				return Math.min(minBracketIndex,bracketIndex);
			},Infinity);
			value = mainParts[i].slice(0,nextBracketIndex-1);
			if(nextBracketIndex < Infinity){
				const left = mainParts[i].slice(nextBracketIndex);
				mainParts.push(left);
			}
		}
		mainParts[i] = value;
	}


	titleAttributeHandlers.forEach(({validator,handler}) => {
		const goodOnes = remove(mainParts,mainPart => validator(mainPart));
		if(goodOnes.length > 0){
			handler(parsed,goodOnes);
		}
	});

	return Object.assign(parsedDefaults,parsed);
};