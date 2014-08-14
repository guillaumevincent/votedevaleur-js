var gulp = require('gulp'),
    concat = require('gulp-concat'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    autoprefix = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    glob = require('glob');

var paths = {
    css: [
        'bower_components/foundation/css/normalize.css',
        'bower_components/foundation/css/foundation.css',
        'bower_components/angular/angular-csp.css',
        'public/css/votedevaleur.css'
    ],
    images: [
        'public/img/*'
    ],
    js: [
        'bower_components/angular/angular.js',
        'bower_components/angular-hotkeys/build/hotkeys.js',
        'public/js/opinionApplication.js',
        'public/js/voteApplication.js'
    ]
};

gulp.task('css', function () {
    gulp.src(paths.css)
        .pipe(concat('votedevaleur.min.css'))
        .pipe(autoprefix('last 2 versions'))
        .pipe(minifycss({keepSpecialComments: 0}))
        .pipe(gulp.dest('public/css'));
});

gulp.task('js', function () {
    return gulp.src(paths.js)
        .pipe(concat('votedevaleur.min.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('public/js'));
});

gulp.task('watch', function () {
    gulp.watch(paths.css, ['css', 'js']);
});

gulp.task('default', ['css', 'js', 'watch']);

