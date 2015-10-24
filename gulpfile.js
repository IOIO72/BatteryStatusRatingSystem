'use strict';

var gulp = require('gulp'),
    jade = require('gulp-jade'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    gulpCopy = require('gulp-copy'),
    cleanDest = require('gulp-clean-dest'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

gulp.task('copy:bower', function () {
    gulp.src([
        './bower_components/jquery/dist/jquery.min.js'
    ])
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
        .pipe(cleanDest('./build/css'))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build/css'))
});

gulp.task('default', [
        'copy:bower',
        'copy',
        'templates',
        'sass'
    ]
);

gulp.task('serve', ['default'], function () {
    browserSync({
        notify: false,
        server: {
            baseDir: ['build'],
            routes: {
                '/bower_components': 'bower_components'
            }
        }
    });
    gulp.watch('source/jade/**/*.jade', ['templates', reload]);
    gulp.watch('source/js/**/*.js', ['copy', reload]);
    gulp.watch('source/sass/**/*.{scss,sass}', ['sass', reload]);
});
