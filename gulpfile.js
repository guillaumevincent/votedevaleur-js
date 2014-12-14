var gulp = require('gulp'),
    concat = require('gulp-concat'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    autoprefix = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    glob = require('glob'),
    sass = require('gulp-sass');

var paths = {
    css: [
        'bower_components/angular/angular-csp.css',
        'public/css/votedevaleur.css'
    ],
    scss: ['public/scss/styles.scss'],
    images: ['public/img/*'],
    js: [
        'bower_components/angular/angular.js',
        'bower_components/angular-route/angular-route.js',
        'bower_components/angular-hotkeys/build/hotkeys.js',
        'public/application.votedevaleur.js'
    ]
};

gulp.task('scss', function () {
    return gulp.src(paths.scss)
        .pipe(sass())
        .pipe(concat('votedevaleur.css'))
        .pipe(autoprefix('last 2 versions'))
        .pipe(gulp.dest('public/css'));
});

gulp.task('css', ['scss'], function () {
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
    gulp.watch(paths.css, ['css']);
    gulp.watch(paths.scss, ['scss']);
    gulp.watch(paths.js, ['js']);
});

gulp.task('default', ['css', 'js', 'watch']);

