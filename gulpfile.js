const fs			= require( 'fs' );
const gulp			= require( 'gulp' );
const glob			= require( 'glob' );
const autoprefixer	= require( 'gulp-autoprefixer' );
const browserify	= require( 'browserify' );
const babelify		= require( 'babelify' );
const buffer		= require( 'vinyl-buffer' );
const sass			= require( 'gulp-sass' )( require('sass') );
const source		= require( 'vinyl-source-stream' );
const es			= require( 'event-stream' );
const child_process	= require( 'child_process' );

const package = require( './package.json' );


const config = {
	sass : {
		outputStyle: 'compressed',
		precision: 8,
		stopOnError: false,
		functions: {
			'base64Encode($string)': $string => {
				var buffer = new Buffer( $string.getValue() );
				return sass.types.String( buffer.toString('base64') );
			}
		},
		includePaths:['src/scss/','node_modules/']
	},
	destPath: e => {
		if ( ['style.css','editor-style.css'].includes( e.basename ) ) {
			return './';
		}
		return e.extname.replace( /^\./, './' );
	}
}


gulp.task('i18n:make-pot',cb => {
	child_process.execSync(`wp i18n make-pot . languages/${package.name}.pot --domain=${package.name} --exclude=./js,tmp`);
	cb();
})

gulp.task('i18n:strings-from-json', cb => {
	// rm -f languages/*.json
	const xt = require('./src/run/lib/json-extract.js');


	let strings = [];

	const common_mapping = {
		title:xt.map_string,
		description:xt.map_string,
		label:xt.map_string,
		labels:xt.map_values,
	}

	const acf_mapping = {
		title:xt.map_string,
		description:xt.map_string,
		label:xt.map_string,
		instructions:xt.map_string,
		prepend:xt.map_string,
		append:xt.map_string,
		message:xt.map_string,
		choices:xt.map_values
	}


	// ptype, taxo
	strings = xt.parse_files( glob.sync('./json/post-type/*.json'), common_mapping, strings);
	strings = xt.parse_files( glob.sync('./json/taxonomy/*.json'), common_mapping, strings);

	// acf
	strings = xt.parse_files( glob.sync('./json/acf/*.json'), acf_mapping, strings);

	xt.generate_php( './src/php/json-strings.php', strings, package.name );

	cb();
});


function js_task(debug) {
	return cb => {
		let tasks = glob.sync("./src/js/**/index.js")
			.map( entry => {
				let target = entry.replace(/(\.\/src\/js\/|\/index)/g,'');
				return browserify({
						entries: [entry],
						debug: debug,
						paths:['./src/js/lib']
					})
					.transform( babelify.configure({}) )
					.transform( 'browserify-shim' )
					.plugin('tinyify')
					.bundle()
					.pipe(source(target))
					.pipe( gulp.dest( config.destPath ) );
			} );

		return es.merge(tasks).on('end',cb)
	}
}
function scss_task(debug) {
	return cb => {
		return gulp.src( './src/scss/**/*.scss', { sourcemaps: debug } )
			.pipe(
				sass( config.sass )
			)
			.pipe( autoprefixer( { browsers: package.browserlist } ) )
			.pipe( gulp.dest( config.destPath, { sourcemaps: debug } ) );
	}
}

gulp.task('build:js', js_task( false ) );
gulp.task('build:scss', scss_task( false ) );

gulp.task('dev:js', js_task( true ) );
gulp.task('dev:scss', scss_task( true ) );


gulp.task('watch', cb => {
	gulp.watch('./src/scss/**/*.scss',gulp.parallel('dev:scss'));
	gulp.watch('./src/js/**/*.js',gulp.parallel('dev:js'));
});

gulp.task('dev',gulp.series('dev:scss','dev:js','watch'));

gulp.task('i18n', gulp.series( /*'i18n:strings-from-json',*/'i18n:make-pot'));

gulp.task('build', gulp.series('build:js','build:scss', 'i18n'));

gulp.task('default',cb => {
	console.log('run either `gulp build` or `gulp dev`');
	cb();
});

module.exports = {
	build:gulp.series('build')
}
