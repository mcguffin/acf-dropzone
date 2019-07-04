


// shell( 'git tag %s' % new_version, check = True )
// shell( 'git push origin --tags', check = True )
module.exports = ( dry = false ) => {
<<<<<<< HEAD
	return new Promise( ( resolve, reject ) => {

		const git = require('simple-git')('.');
		const package = require('../../../../package.json');

		if ( dry ) {
			console.log( `git tag ${package.version}` );
			console.log( 'git push origin --tags' );
			resolve();
		} else {
			git.addTag( package.version ).pushTags('origin').exec( resolve );
		}
	})
};
=======

	const git = require('simple-git')('.');
	const package = require('../../../../package.json');

	if ( dry ) {
		console.log( `git tag ${package.version}` );
		console.log( 'git push origin --tags' );
	} else {
		git.addTag( package.version ).pushTags('origin');
	}
}
>>>>>>> b4e82d0261392278b42a8f468926777362d9e4e6
