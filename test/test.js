const util = require('util');
const chalk = require('chalk');
const assert = require('assert');
const guessMetadata = require('../');
const cases = require('./cases');

let counter = 0;
const errors = [];
cases.forEach((acase,i) => {
	const correctParsedTitle = acase[1];
	const parsedTitle = guessMetadata(acase[0]);
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
		errors.push([acase,correctParsedTitle,simpleParsedTitle]);
	}
});
if(errors.length > 0){
	console.log('Errors:');
	errors.forEach(error => {
		console.log(chalk.red(util.inspect(error[2]))+' is not '+chalk.green(util.inspect(error[1])));
	});
	console.log();
	console.log('Success rate: '+chalk.green(counter+'/'+cases.length));
	throw 'Tests failed!';
}else{
	console.log(chalk.green('Success!'));
}