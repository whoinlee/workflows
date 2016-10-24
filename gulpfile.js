var gulp = require('gulp');
var gutil = require('gulp-util');

//-- log task, $gulp log
gulp.task('log', function() {
	gutil.log('Workflows are awesome');
});