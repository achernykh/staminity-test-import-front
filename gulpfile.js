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
var sftp_new      = require('gulp-sftp-new');
var gutil         = require('gulp-util');
var ftp           = require('gulp-ftp');
var imagemin      = require('gulp-imagemin');
var cssmin        = require('gulp-cssmin');
var open          = require('gulp-open');

// Get/set variables
var config = require('./gulp.config');
var ENV = process.env.npm_lifecycle_event;

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

// var ts = require("gulp-typescript");
const tsify = require('tsify');
const watchify = require('watchify');
 
// Compile application
gulp.task('jsApp', ['templates'], function() {
    // var b = browserify(config.src.babel)
    //     .plugin(watchify)
    //     .plugin(tsify)
    //     .transform(babelify, {presets: ["es2015"]})
    //     .transform(ngAnnotate);

    // b.on('update', bundle);
    // bundle();

    // function bundle() {
    //     console.log('rebundle')
    //     b.bundle()
    //     .pipe(source('main.js'))
    //     .pipe(gulp.dest('./build/js/'));
    // }
    return browserify(config.src.app)
        .plugin(watchify)
        .plugin(tsify)
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
        //.pipe(imagemin())
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

gulp.task('version', function () {
    gulp.src(['build/css/app.css', 'build/js/app.js'])
        .pipe(assetsVersionReplace({
            replaceTemplateList: [
                'build/index.html'
            ]
        }))
        .pipe(gulp.dest('build/'))
});

// This task is used for building production ready
gulp.task('build', function() {
    var html = gulp.src(["build/index.html", "build/browserconfig.xml", "build/favicon.ico"])
        .pipe(gulp.dest('./dist/'));

    var css = gulp.src('build/css/*.css')
        .pipe(cssmin())
        //.pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/css/'));

    var js = gulp.src("build/js/**.js")
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'));

    var assets = gulp.src("build/assets/**")
        //.pipe(imagemin())
        .pipe(gulp.dest('./dist/assets/'));

    return merge(html,js, css, assets);
});

// Start local http server
gulp.task('serve', function () {
    return gulp.src(config.build)
        .pipe(server(config.localServer));
    //browserSync.init(['./build/**/**.**'], config.serve);
    //browserSync.init({
    //    server: {
    //        baseDir: "./build",
    //        index: 'index.html'
    //        //middleware: [ historyApiFallback() ]
    //    },
    //    cors: true
    //});
});

gulp.task('sftp', function () {
    return gulp.src('build/**')
        .pipe(sftp_new({
            host: 'ftp.staminity.com:21',
            user: 'dev1ftpuser@dev1.staminity.com',
            pass: 'DpziUbiqPJ84w9xIf3ll',
            remotePath: '/'
        }));
});

gulp.task('ftp-dev', ['build'], function () {
    return gulp.src('dist/**')
        .pipe(ftp({
            host: 'ftp.staminity.com',
            user: 'dev1ftpuser@dev1.staminity.com',
            pass: 'DpziUbiqPJ84w9xIf3ll'
        }))
        .pipe(gutil.noop());
});
gulp.task('ftp-dev-core', ['build'], function () {
    return gulp.src(['dist/index.html','dist/css/**','dist/js/**'])
        .pipe(ftp({
            host: 'ftp.staminity.com',
            user: 'dev1ftpuser@dev1.staminity.com',
            pass: 'DpziUbiqPJ84w9xIf3ll'
        }))
        .pipe(gutil.noop());
});
gulp.task('ftp-prd', ['build'], function () {
    return gulp.src('dist/**')
        .pipe(ftp({
            host: 'ftp.staminity.com',
            user: 'ih207328ac@staminity.com',
            pass: 'kgQ6uPqTP4271FQe'
        }))
        .pipe(gutil.noop());
});
gulp.task('ftp-prd-core', ['build'], function () {
    return gulp.src(['dist/index.html','dist/css/**','dist/js/**'])
        .pipe(ftp({
            host: 'ftp.staminity.com',
            user: 'ih207328ac@staminity.com',
            pass: 'kgQ6uPqTP4271FQe'
        }))
        .pipe(gutil.noop());
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

// Copy assets
gulp.task('icons', function() {
    return gulp.src(config.src.assets)
        .pipe(gulp.dest('./'+ENV+'/assets'));
});

gulp.task('url', function(){
    var sites = {
        dev1: 'http://dev1.staminity.com',
        prd: 'http://staminity.com'
    }
    return gulp.src('./index.html')
        .pipe(open({uri: 'http://www.google.com'}));
});

gulp.task('ftp-copy', function () {
    var src = './'+ENV;
    return gulp.src('dev1/**/*')
        .pipe(ftp({
            host: 'ftp.staminity.com',
            user: 'dev1ftpuser@dev1.staminity.com',
            pass: 'DpziUbiqPJ84w9xIf3ll'
        }))
        .pipe(gutil.noop());
});


