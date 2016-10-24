var gulp = require('gulp'),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass'),
	connect = require('gulp-connect'),
	concat = require('gulp-concat');

//-- 'log' task, $gulp log
// gulp.task('log', function() {
// 	gutil.log('Workflows are awesome');
// });


var coffeeSources = ['components/coffee/tagline.coffee'];
var jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
];
var sassSources = ['components/sass/style.scss'];

//-- 'coffee' task
gulp.task('coffee', function() {
	gulp.src(coffeeSources)
	.pipe(coffee({ bare: true })
		.on('error', gutil.log))
	.pipe(gulp.dest('components/scripts'))
});
//-- 'js' task
gulp.task('js', ['coffee'], function() {
	gulp.src(jsSources)
	.pipe(concat('script.js'))
	.pipe(browserify())
	.pipe(gulp.dest('builds/development/js'))
});
//-- 'compass' task
gulp.task('compass', function() {
	gulp.src(sassSources)
	.pipe(compass({
		sass: 'components/sass',
		image: 'builds/development/images',
		style: 'expanded'
		})
		.on('error', gutil.log))
	.pipe(gulp.dest('builds/development/css'))
});
//-- 'connect' task
gulp.task('connect', function() {
	connect.server({
		root: 'builds/development/',
		livereload: true
	});
});
//-- 'watch' task
gulp.task('watch', function() {
	//whenever coffeeSources files change, the task 'coffee' is executed
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(jsSources, ['js']);
	gulp.watch('components/sass/*.scss', ['compass']);
});


// gulp.task('all', ['coffee', 'js', 'compass']);
gulp.task('default', ['coffee', 'js', 'compass', 'connect', 'watch']);