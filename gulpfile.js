const fs			= require( 'fs' );
const gulp			= require( 'gulp' );
const glob			= require( 'glob' );
const autoprefixer	= require( 'gulp-autoprefixer' );
const browserify	= require( 'browserify' );
const babelify		= require( 'babelify' );
const buffer		= require( 'vinyl-buffer' );
/*
const sass			= require( 'gulp-sass' );
/*/
const sass			= require('@selfisekai/gulp-sass');
//*/
const source		= require( 'vinyl-source-stream' );
const es			= require( 'event-stream' );
const child_process	= require( 'child_process' );

const package = require( './package.json' );

sass.compiler = require('node-sass');

let bundlemap = {};

const onFile = (target) => function( file, id, parent ) {

	let f = file.replace(__dirname+'/','')
	if ( ! bundlemap[ f ] ) {
		bundlemap[ f ] = [];
	}
	bundlemap[ f ].push('js/'+target)
}
const onPackage = function(bundle) {
	// extract from
	Object.keys(bundlemap).forEach(src => {
		//  distinct
		bundlemap[src] = bundlemap[src].filter( ( val, idx, self ) => self.indexOf( val ) === idx )
	})
	fs.writeFileSync( './src/js/bundlemap.json',JSON.stringify(bundlemap,null,2), {encoding:'utf-8'});
}

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


gulp.task('i18n:fix-pot', cb => {
	try {
		bundlemap = require( './src/js/bundlemap.json')
		glob.sync('./languages/*.pot')
			.map( entry => {
				let contents = fs.readFileSync( entry, {encoding:'utf-8'} );
				Object.keys(bundlemap).forEach( src => {
					let replace = '';
					let search = RegExp( '#:\\s'+ src.replace('.','\\.') + ':(\\d+)\n', 'g' );
					bundlemap[src].forEach( dest => {
						replace += '#: ' + dest + "\n";
					} );
					contents = contents.replace( search, replace ).replace( replace+replace,replace);
				} );
				fs.writeFileSync(entry,contents,{encoding:'utf-8'});
			} )
	} catch(err) {};
	cb();
});
gulp.task('i18n:make-pot',cb => {
	child_process.execSync(`wp i18n make-pot . languages/${package.name}.pot --domain=${package.name} --exclude=./js,tmp`);
	cb();
})
gulp.task('i18n:make-json',cb => {
	// rm -f languages/*.json
	glob.sync('./languages/*.json').map( fs.unlinkSync );
	glob.sync('./languages/*.po').length && child_process.execSync( "wp i18n make-json languages/*.po --no-purge" );
	cb();
});


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
					.on( 'file', onFile(target) )
					.on( 'package', onPackage )
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
	gulp.watch('./languages/*.pot',gulp.parallel('i18n:fix-pot'));
	gulp.watch('./languages/*.po',gulp.parallel('i18n:make-json'));
});

gulp.task('dev',gulp.series('dev:scss','dev:js','watch'));

gulp.task('i18n', gulp.series( 'i18n:strings-from-json','i18n:make-pot','i18n:fix-pot','i18n:make-json'));

gulp.task('build', gulp.series('build:js','build:scss', 'i18n'));

gulp.task('default',cb => {
	console.log('run either `gulp build` or `gulp dev`');
	cb();
});

module.exports = {
	build:gulp.series('build')
}
