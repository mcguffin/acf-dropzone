const release = require('./lib/release/index.js');

const identifier =  ['major','minor','patch'].indexOf(process.argv[ process.argv.length - 1 ]) !== -1
	? process.argv[ process.argv.length - 1 ]
	: 'patch';

const dry = process.argv.indexOf('dry') !== -1;

if ( process.argv.indexOf('build') !== -1 ) {
	release.build( identifier )
}
if ( process.argv.indexOf('github') !== -1 ) {
	release.github(dry)
}
if ( process.argv.indexOf('bitbucket') !== -1 ) {
	release.bitbucket(dry)
}
if ( process.argv.indexOf('wporg') !== -1 ) {
	release.wporg(dry)
}
