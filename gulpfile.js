'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var gulpCopy = require('gulp-copy');
var cleanDest = require('gulp-clean-dest');

gulp.task('copy:bower', function () {
    gulp.src([
        './bower_components/jquery/dist/jquery.min.js'
    ])
        .pipe(cleanDest('./source/js/vendor'))
        .pipe(gulpCopy('./source/js/vendor', {prefix: 3}))
});

gulp.task('copy', function () {
    gulp.src([
        './source/js/**/*'
    ])
        .pipe(cleanDest('./build/js/'))
        .pipe(gulpCopy('./build/js/', {prefix: 2}))
});

gulp.task('templates', function () {
    var YOUR_LOCALS = {};

    gulp.src('./source/jade/*.jade')
        .pipe(jade({
            locals: YOUR_LOCALS
        }))
        .pipe(cleanDest('./build/'))
        .pipe(gulp.dest('./build/'))
});

gulp.task('sass', function () {
    gulp.src('./source/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanDest('./build/css'))
        .pipe(gulp.dest('./build/css'));
});

gulp.task('watch:js', function () {
    var watchJS = gulp.watch('.source/js/**/*.js', ['copy']);
    watchJS.on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('watch:sass', function () {
    var watchSASS = gulp.watch('./source/sass/**/*.scss', ['sass']);
    watchSASS.on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('watch', [
        'watch:js',
        'watch:sass'
    ]
);

gulp.task('default', [
        'copy:bower',
        'copy',
        'templates',
        'sass'
    ]
);