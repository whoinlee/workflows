var gulp = require('gulp'),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass'),
	connect = require('gulp-connect'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	minifyHTML = require('gulp-minify-html'),
	jsonminify = require('gulp-jsonminify'),
	concat = require('gulp-concat');

var env,
	coffeeSources,
	jsSources,
	htmlSources,
	sassSources,
	jsonSources,
	outputDir,
	sassStyle;

env = process.env.NODE_ENV || 'development';
if (env === 'development') {
	outputDir = 'builds/development/';
	sassStyle = 'expanded';
} else {
	outputDir = 'builds/production/';
	sassStyle = 'compressed';
};

//-- 'log' task, $gulp log
// gulp.task('log', function() {
// 	gutil.log('Workflows are awesome');
// });


coffeeSources = ['components/coffee/tagline.coffee'];
jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
];
var sassSources = ['components/sass/style.scss'];
var htmlSources = [outputDir + '*.html'];
var jsonSources = [outputDir + 'js/*.json'];

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
	.pipe(gulpif(env === "production", uglify()))
	.pipe(gulp.dest(outputDir + 'js'))
});
//-- 'compass' task
gulp.task('compass', function() {
	gulp.src(sassSources)
	.pipe(compass({
		sass: 'components/sass',
		image: outputDir + 'images',
		style: sassStyle
		})
		.on('error', gutil.log))
	.pipe(gulp.dest(outputDir + 'css'))
	.pipe(connect.reload())
});
//-- 'connect' task
gulp.task('connect', function() {
	connect.server({
		root: outputDir,
		livereload: true
	});
});
//-- 'html' task
gulp.task('html', function() {
	gulp.src('builds/development/*.html')
		.pipe(gulpif(env === 'production', minifyHTML()))
		.pipe(gulpif(env === 'production', gulp.dest(outputDir)))
		.pipe(connect.reload())
});
//-- 'json' task
gulp.task('json', function() {
	gulp.src('builds/development/js/*.json')
		.pipe(gulpif(env === 'production', jsonminify()))
		.pipe(gulpif(env === 'production', gulp.dest('builds/production/js')))
		.pipe(connect.reload())
});
//-- 'watch' task
gulp.task('watch', function() {
	//whenever coffeeSources files change, the task 'coffee' is executed
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(jsSources, ['js']);
	gulp.watch('components/sass/*.scss', ['compass']);
	gulp.watch('builds/development/*.html', ['html']);
	gulp.watch('builds/development/js/*.json', ['json']);
});


// gulp.task('all', ['coffee', 'js', 'compass']);
gulp.task('default', ['coffee', 'js', 'compass', 'connect', 'json', 'html', 'watch']);