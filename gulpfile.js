// Generated on 2014-09-20 using generator-jekyllrb-gulp 0.1.1
'use strict';

// Directory reference:
//   css: src/css
//   javascript: src/js

var gulp        = require('gulp');
var browserSync = require('browser-sync');
var cp          = require('child_process');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var browserify  = require('browserify');
var rename      = require('gulp-rename');
var clean       = require('gulp-clean');
var minifyCSS   = require('gulp-minify-css');
var uglify      = require('gulp-uglify');
var concat      = require('gulp-concat');
var imagemin    = require('gulp-imagemin');
var source      = require('vinyl-source-stream');
var utils       = require('gulp-util');
var connect     = require('gulp-connect');

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
     return cp.spawn('bundle', ['exec', 'jekyll', 'build'], { stdio: 'inherit' })
         .on('close', done);
});

gulp.task('jekyll-rebuild', function () {
  connect.reload();
});

gulp.task('connect', function() {
  connect.server({
    root: '_site',
    livereload: true,
    port: 8000
  });
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('start-server', ['build', 'jekyll-build', 'connect']);

gulp.task('build', ['jekyll-build', 'sass', 'js', "fonts"]);

/**
 * Compile files from src into both _site/dist/css (for live injecting) and dist/css (for future jekyll builds)
 */
gulp.task('sass', function () {
    gulp.src('src/css/**/main.scss')
        .pipe(sass({
            includePaths: ['scss', './node_modules/zurb-foundation/css'],
            sourceMap: true,
            errLogToConsole: true
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(minifyCSS())
        .pipe(rename('build.min.css'))
        .pipe(gulp.dest('_site/dist/css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload());
});

gulp.task('fonts', function () {
  gulp.src('src/fonts/**/*.*')
    .pipe(gulp.dest('dist/fonts'))
    .pipe(gulp.dest('_site/dist/fonts'))
    .pipe(connect.reload());
});

gulp.task('js', function () {
  gulp.src('src/js/*.js')
    // Start piping stream to tasks!
    .pipe(gulp.dest('./dist/js/'))
    .pipe(gulp.dest('_site/dist/js'));

  gulp.src('bower_components/**/*.*')
    .pipe(gulp.dest('_site/bower_components'))
    .pipe(connect.reload());
});

gulp.task('images', function() {
    gulp.src('src/img/**/*.+(png|jpeg|jpg|gif|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('_site/dist/img'))
        .pipe(gulp.dest('dist/img'))
        .pipe(connect.reload());
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch('src/css/*.scss', ['sass']);
    gulp.watch(['index.html', '_layouts/*.html', '_posts/*', '_config.yml', '_includes/*.html', '_data/**/*'], ['jekyll-build']);
    gulp.watch('src/js/*.js', ['js']);
    gulp.watch('src/images/**/*.+(png|jpeg|jpg|gif|svg)', ['images']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['start-server', 'watch']);
