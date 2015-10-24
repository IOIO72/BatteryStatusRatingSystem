'use strict';

var gulp            = require('gulp'),
    jade            = require('gulp-jade'),
    html5lint       = require('gulp-html5-lint'),
    sass            = require('gulp-sass'),
    autoprefixer    = require('gulp-autoprefixer'),
    sourcemaps      = require('gulp-sourcemaps'),
    csslint         = require('gulp-csslint'),
    gulpCopy        = require('gulp-copy'),
    jshint          = require('gulp-jshint'),
    cleanDest       = require('gulp-clean-dest'),
    browserSync     = require('browser-sync'),
    reload          = browserSync.reload;

gulp.task('copy:bower', function () {
    gulp.src([
        './bower_components/jquery/dist/jquery.min.js'
    ])
        .pipe(gulpCopy('./source/js/vendor', {prefix: 3}))
    ;
});

gulp.task('copy:js', function () {
    gulp.src([
        './source/js/**/*.js'
    ])
        .pipe(cleanDest('./build/js'))
        .pipe(gulpCopy('./build/js', {prefix: 2}))
    ;
});

gulp.task('lint', function() {
    return gulp.src('./source/js/app/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
    ;
});

gulp.task('templates', function () {
    gulp.src('./source/jade/*.jade')
        .pipe(cleanDest('./build'))
        .pipe(jade({pretty:true}))
        .pipe(html5lint())
        .pipe(gulp.dest('./build'))
    ;
});

gulp.task('sass', function () {
    gulp.src('./source/sass/**/*.scss')
        .pipe(cleanDest('./build/css'))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['Chrome > 42', 'Firefox > 37', 'Safari > 9', 'Opera > 31'], // browser versions that support the API
            cascade: false,
            add: true
        }))
        .pipe(csslint())
        .pipe(csslint.reporter('text'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build/css'))
    ;
});

gulp.task('build', [
        'copy:bower',
        'copy:js',
        'templates',
        'sass'
    ]
);

gulp.task('watch', ['build'], function () {
    gulp.watch('source/jade/**/*.jade', ['templates']);
    gulp.watch('source/js/**/*.js', ['copy:js', 'lint']);
    gulp.watch('source/sass/**/*.{scss,sass}', ['sass']);
});

gulp.task('serve', ['build'], function () {
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
    gulp.watch('source/js/**/*.js', ['copy:js', 'lint', reload]);
    gulp.watch('source/sass/**/*.{scss,sass}', ['sass', reload]);
});

gulp.task('default', ['watch']);
