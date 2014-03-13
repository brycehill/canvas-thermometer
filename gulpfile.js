var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    livereload = require('gulp-livereload')

gulp.task('build', function() {
    return gulp.src('./src/Thermometer.js')
        .pipe(uglify())
        .pipe(rename('thermometer.min.js'))
        .pipe(gulp.dest('./dist'));
})

gulp.task('watch', function() {
    // var server = livereload()
    gulp.watch('./src/Thermometer.js', ['build'])
})