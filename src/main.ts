import * as minimist from 'minimist';
import { pack } from './package';
import { publish } from './publish';
import { fatal } from './util';
import { publisher } from './store';
const packagejson = require('../package.json');

function helpCommand(): void {
	console.log(`Usage: vsce [command] [opts] [args]

Commands:
    package [vsix path]          Packages the extension into a .vsix package
    publish                      Publishes the extension
    publisher add [publisher]    Add a publisher
    publisher rm [publisher]     Remove a publisher
    publisher list               List all added publishers

Global options:
    --help, -h                   Display help
    --version, -v                Display version

VSCode Extension Manager v${ packagejson.version }`
	);
}

function versionCommand(): void {
	console.log(packagejson.version);
}

function command(args: minimist.ParsedArgs): boolean {
	try {
		const promise = (() => {
			switch (args._[0]) {
				case 'package': return pack(args._[1]).then(({ packagePath }) => console.log(`Package created: ${ packagePath }`));
				case 'publisher': return publisher(args._[1], args._[2]);
				case 'publish': return publish(args._[1]);
				default: return null;
			}
		})();
		
		if (promise) {
			promise.catch(fatal);
			return true;
		}
		
		return false;
	} catch (e) {
		fatal(e);
		return true;
	}
}

module.exports = function (argv: string[]): void {
	var args = minimist(argv);
	
	if (args['version'] || args['v']) {
		versionCommand();
	} else if (args['help'] || args['h'] || args._.length === 0) {
		helpCommand();
	} else if (!command(args)) {
		helpCommand();
	}
};