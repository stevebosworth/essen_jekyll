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

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll', ['build'], { stdio: 'inherit' })
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['build', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

gulp.task('build', ['sass', 'js']);

/**
 * Compile files from src into both _site/dist/css (for live injecting) and dist/css (for future jekyll builds)
 */
gulp.task('sass', function () {
    gulp.src('src/css/**/*.scss')
        .pipe(sass({
            includePaths: ['scss', './node_modules/zurb-foundation/css'],
            onError: browserSync.notify,
            sourceMap: true
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(minifyCSS())
        .pipe(rename('build.min.css'))
        .pipe(gulp.dest('_site/dist/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('js', function () {
  return browserify('./src/js/main.js')
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('main.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('images', function() {
    gulp.src('src/images/**/*.+(png|jpeg|jpg|gif|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('_site/dist/img'))
        .pipe(browserSync.reload({ stream: true }))
        .pipe(gulp.dest('dist/img'));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch('src/css/*.scss', ['sass']);
    gulp.watch(['index.html', '_layouts/*.html', '_posts/*', '_config.yml', '_includes/*.html'], ['jekyll-rebuild']);
    gulp.watch('src/js/*.js', ['js']);
    gulp.watch('src/images/**/*.+(png|jpeg|jpg|gif|svg)', ['images']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);
