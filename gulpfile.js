
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var cleanCss = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var del = require('del');

// <-- image compression -->
var imagemin = require('gulp-imagemin');
var imageminPngquant = require('imagemin-pngquant');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');

// <-- file paths -->
var css_path = 'public/css/**/*.css';
var dist_path = 'public/dist';
var images_path = 'public/images/**/*.{png,jpeg,jpg,svg,gif}';
// =====================================================


// STYLE TASK - CSS
gulp.task('styles-css', function() {
    console.log('starting STYLE (CSS) task');
    // goes into public folder -> css folder and first fetches the reset.css file then all* files with the extension .css
    return gulp.src(['public/css/reset.css', css_path])
        .pipe(plumber(function(err) {
            console.log('styles task error');
            console.log(err);
            this.emit('end');
        }))
        // show sourcemaps what files looked like before
        .pipe(sourcemaps.init())
        // passes files into autoprefixer plugin
        .pipe(autoprefixer())
        // concats files into one file called styles.css
        .pipe(concat('fonts.css'))
        // pass styles.css into clean css plugin to minify
        .pipe(cleanCss())
        // writes sourcemaps files based on what init saw
        .pipe(sourcemaps.write())
        // saves files in dist folder
        .pipe(gulp.dest(dist_path))
        // trigger livereload
        .pipe(livereload())
});
// // =====================================================


// STYLE TASK - SASS/SCSS
gulp.task('styles-scss', function () {
    console.log('starting STYLE (SCSS) task');
    return gulp.src('public/scss/main.scss')
        // error catcher plumber allows watch to continue to run
        .pipe(plumber(function (err) {
            console.log('styles task error');
            console.log(err);
            this.emit('end');
        }))
        // show sourcemaps what files looked like before
        .pipe(sourcemaps.init())
        // concats files into one file called main.css
        .pipe(sass({ outputStyle: 'compressed' }))
         // passes files into autoprefixer plugin
        .pipe(autoprefixer())
        // writes sourcemaps files based on what init saw
        .pipe(sourcemaps.write())
        // saves files in dist folder
        .pipe(gulp.dest(dist_path))
        // trigger livereload
        .pipe(livereload())
});
// =====================================================


// IMAGES TASK
gulp.task('images', function () {
    return gulp.src(images_path)
        // recompress images
        .pipe(imagemin([
            imagemin.gifsicle(),
            imagemin.jpegtran(),
            imagemin.optipng(),
            imagemin.svgo(),
            imageminPngquant(),
            imageminJpegRecompress()
        ]))
        // saves to a image folder inside of the dist folder
        .pipe(gulp.dest(dist_path + '/images'));
});
// =====================================================


// CLEAN TASK
gulp.task('clean', function () {
    return del.sync([
        // deletes dist folder
        dist_path
    ]);
});
// =====================================================


// DEFAULT TASK
gulp.task('default', ['clean', 'images', 'styles-css', 'styles-scss'], function () {
    console.log('starting DEFAULT task');
});
// =====================================================


// WATCH TASK
gulp.task('watch', ['default'], function () {
    console.log('starting WATCH task');
    require('./server.js');
    livereload.listen();
    // gulp.watch(css_path, ['styles-css']);
    gulp.watch('public/scss/**/*.scss', ['styles-scss']);
});
// =====================================================