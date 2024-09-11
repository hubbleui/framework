#!/usr/bin/env node

import optimist from 'optimist';
import fs from 'fs';
import path from 'path';

function importFile(fileName, fileMap)
{

	// To Prevent Circular Imports
	fileMap = fileMap || {};

	// Determine Path for Importing dependent files
	var filePath = path.dirname(fileName),

		// Resolve to get the full path every time
		mapPath = path.resolve(fileName);

	// Add Error Handlers Later...
	if(
		// Check that File Exists
		!fs.existsSync(fileName) ||

		// Check it hasn't been imported yet
		fileMap[mapPath]
	){ 
		throw new Error(`${fileName} does not exist.`);
	 }

	// Mark as Read
	fileMap[mapPath] = 1;

	return	fs.readFileSync(fileName)
			.toString()
			.replace(
				// Regex to match import statements
				/^(?:(?!\/[\/*]))([ \t]*)(.*)import [\"\'](.+)[\"\'];(?![^\*]+\*\/)/gm,
				function(match, tabs, prefix, fileName){

					// Replace Import
					return tabs + prefix + importFile(path.resolve(filePath, fileName), fileMap).replace(/\n/g, "\n"+tabs);
				}
			);
};

var argv = optimist
	.usage(
		  "Usage: [import] [options] [file …]\n\n"
		+ "Version: 0.0.5\n\n"
		+ "Minimized fork of smash.\n"
		+ "Concatenates one or more input files, outputting a single merged file.\n"
		+ "Any import statements in the input files are expanded in-place to the\n"
		+ "contents of the imported file. If the same file is imported multiple\n"
		+ "times, only the first instance of the file is included."
	)
	.options("list", {
		describe: "output a list of imported files",
		type: "boolean",
		default: false
	})
	.options("delimiter", {
		describe: "specify the delimiter used for concatenating files",
		type: "string",
		default: "\n"
	})
	.options("ignore-missing", {
		describe: "ignore missing files instead of throwing an error",
		type: "boolean",
		default: false
	})
	.options("help", {
		describe: "display this helpful message",
		type: "boolean",
		default: false
	})
	.check(function(argv) {
		if (argv.help){ return optimist.showHelp(); }
		if (!argv._.length){ throw new Error("input required"); }
		if (argv.list && argv.graph){ throw new Error("--list and --graph are exclusive"); }
	})
	.argv;

// Output to stdout
console.log( argv._.map(function(fileName){
	return importFile(fileName);
}).join(argv.delimiter) );




