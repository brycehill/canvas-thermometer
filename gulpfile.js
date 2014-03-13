var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename')

gulp.task('build', function() {
    return gulp.src('./src/Thermometer.js')
        .pipe(uglify())
        .pipe(rename('thermometer.min.js'))
        .pipe(gulp.dest('./dist'));
})