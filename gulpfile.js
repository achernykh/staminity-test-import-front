var gulp          = require('gulp');
var concat        = require('gulp-concat');
var del           = require('del');
var notify        = require('gulp-notify');
var source        = require('vinyl-source-stream');
var browserify    = require('browserify');
var babelify      = require('babelify');
var ngAnnotate    = require('browserify-ngannotate');
var sass          = require('gulp-sass');
var autoprefixer  = require('gulp-autoprefixer');
var browserSync   = require('browser-sync').create();
var server        = require('gulp-server-livereload');
var rename        = require('gulp-rename');
var templateCache = require('gulp-angular-templatecache');
var uglify        = require('gulp-uglify');
var merge         = require('merge-stream');

// Get/set variables
var config = require('./gulp.config');

// Where our files are located
var jsFiles   = "src/js/**/*.js";
var viewFiles = "src/js/**/*.html";

var interceptErrors = function(error) {
    var args = Array.prototype.slice.call(arguments);

    // Send error to notification center with gulp-notify
    notify.onError({
        title: 'Compile Error',
        message: '<%= error.message %>'
    }).apply(this, args);

    // Keep gulp from hanging on this task
    this.emit('end');
};

// Clean - delete all the content from the build folder
gulp.task('clear', function (cb) {
    del(['*'], {cwd: config.build}, cb);
});

// Compile vendor js libs
gulp.task('jsLibs', function() {
    return gulp.src(config.src.jsLibs)
        .pipe(concat('libs.js'))
        //.pipe(uglify())
        // .pipe(gulpif(getenv(['production','stage']), uglify()))
        .pipe(gulp.dest('js/', { cwd: config.build }));
});

// Compile application
gulp.task('jsApp', ['templates'], function() {
    return browserify(config.src.app)
        .transform(babelify, {presets: ["es2015"]})
        .transform(ngAnnotate)
        .bundle()
        .on('error', interceptErrors)
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('main.js'))
        //.pipe(uglify())
        // Start piping stream to tasks!
        .pipe(gulp.dest('./build/js/'));
});

// Compile vendor css libs
gulp.task('cssLibs', function() {
    return gulp.src(config.src.cssLibs)
        .pipe(concat('libs.css'))
        //.pipe(uglify())
        // .pipe(gulpif(getenv(['production','stage']), uglify()))
        .pipe(gulp.dest('css/', { cwd: config.build }));
});

// Compile sass
gulp.task('sass', function(){

    return gulp.src(config.src.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        //.pipe(uglify())
        .pipe(gulp.dest('css/',{ cwd: config.build }));
        //.pipe(gulp.dest(config.dist.css));

});

// Copy assets
gulp.task('assets', function() {
    return gulp.src(config.src.assets)
        .on('error', interceptErrors)
        .pipe(gulp.dest(config.build+'assets/'));
});

// Copy index.html
gulp.task('html', function() {
    return gulp.src(config.src.index)
        .on('error', interceptErrors)
        .pipe(gulp.dest(config.build));
});

// Pack and cache html templates
gulp.task('templates', function() {
    return gulp.src(config.src.templates)
        .pipe(templateCache({
            standalone: true,
            module: 'staminity.templates'
        }))
        .on('error', interceptErrors)
        .pipe(rename("app.templates.js"))
        .pipe(gulp.dest('./src/js/config/'));
});

// This task is used for building production ready
gulp.task('build', ['html', 'app', 'sass'], function() {
    var html = gulp.src("build/index.html")
        .pipe(gulp.dest('./dist/'));

    var js = gulp.src("build/main.js")
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'));

    return merge(html,js);
});

// Start local http server
gulp.task('serve', function () {
    return gulp.src(config.build)
        .pipe(server(config.localServer));
    //browserSync.init(['./build/**/**.**'], config.serve);
});

// Creates a watch task to watch files and build async
gulp.task('watch', ['default', 'serve'], function () {

    gulp.watch(config.src.index, ['html']);
    gulp.watch(config.src.sassFiles, ['sass']);
    gulp.watch(config.src.gulp, ['jsLibs', 'cssLibs']);
    gulp.watch(config.src.app, ['jsApp']);
    gulp.watch(config.src.jsApp, ['jsApp']);
    gulp.watch(config.src.templates, ['jsApp']);
    gulp.watch(config.src.assets, ['assets']);
});


gulp.task('default', ['html', 'jsLibs', 'cssLibs', 'jsApp', 'sass', 'assets'], function(cb) {
    return gulp.src(config.src.jsApp);
});
