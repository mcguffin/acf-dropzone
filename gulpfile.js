var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var gulp = require('gulp');
var gulputil = require('gulp-util');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

function do_scss( src ) {
	var dir = src.substring( 0, src.lastIndexOf('/') );
	return gulp.src( './src/scss/' + src + '.scss' )
		.pipe( sourcemaps.init() )
		.pipe( sass( { outputStyle: 'nested' } ).on('error', sass.logError) )
		.pipe( autoprefixer() )
		.pipe( gulp.dest( './css/' + dir ) )
        .pipe( sass( { outputStyle: 'compressed' } ).on('error', sass.logError) )
		.pipe( rename( { suffix: '.min' } ) )
        .pipe( sourcemaps.write() )
        .pipe( gulp.dest( './css/' + dir ) );

}

function do_js( src ) {
	var dir = src.substring( 0, src.lastIndexOf('/') );
	return gulp.src( './src/js/' + src + '.js' )
		.pipe( sourcemaps.init() )
		.pipe( gulp.dest( './js/' + dir ) )
		.pipe( uglify().on('error', console.log ) )
		.pipe( rename( { suffix: '.min' } ) )
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest( './js/' + dir ) );
}

function concat_js( src, dest ) {
	return gulp.src( src )
		.pipe( sourcemaps.init() )
		.pipe( concat( dest ) )
		.pipe( gulp.dest( './js/' ) )
		.pipe( uglify().on('error', gulputil.log ) )
		.pipe( rename( { suffix: '.min' } ) )
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest( './js/' ) );

}


gulp.task('scss', function() {
	return do_scss('admin/acf-dropzone');
});


gulp.task('js-admin', function() {
    return do_js('admin/acf-dropzone');
});


gulp.task( 'js', gulp.parallel( 'js-admin') );


gulp.task('build', gulp.parallel('scss','js' ) );


gulp.task('watch', function() {
	// place code for your default task here
	gulp.watch('./src/scss/**/*.scss',gulp.parallel('scss') );
	gulp.watch('./src/js/**/*.js',gulp.parallel( 'js') );
});

gulp.task( 'dev', gulp.series('build', 'watch') );

gulp.task('default',cb => {
	console.log('run either `gulp build` or `gulp dev`');
	cb();
});

module.exports = {
	build:gulp.series('build')
}
