const release = require('./lib/release/index.js');

const identifier =  ['major','minor','patch'].indexOf(process.argv[ process.argv.length - 1 ]) !== -1
	? process.argv[ process.argv.length - 1 ]
	: 'patch';

const dry = process.argv.indexOf('dry') !== -1;

<<<<<<< HEAD
(async () => {
	if ( process.argv.indexOf('build') !== -1 ) {
		console.log('## BUILD ##')
		await release.build( identifier )
	}
	if ( process.argv.indexOf('github') !== -1 ) {
		console.log('## GITHUB ##')
		await release.github(dry)
	}
	if ( process.argv.indexOf('bitbucket') !== -1 ) {
		console.log('## BITBUCKET ##')
		await release.bitbucket(dry)
	}
	if ( process.argv.indexOf('wporg') !== -1 ) {
		console.log('## WPORG ##')
		await release.wporg(dry)
	}
})();
=======
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
>>>>>>> b4e82d0261392278b42a8f468926777362d9e4e6
