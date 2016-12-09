const gulp = require('gulp');
const jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var pump = require('pump');

gulp.task('default', function() {
    return gulp.src('arc-progress.js')
        .pipe(jshint())
        .pipe(uglify())
});


gulp.task('compress', function(cb) {
    pump([
            gulp.src('arc-progress.js'),
            uglify(),
            gulp.dest('dist')
        ],
        cb
    );
});