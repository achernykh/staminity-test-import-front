const gulp          = require('gulp');
const concat        = require('gulp-concat');
const del           = require('del');
const notify        = require('gulp-notify');
const source        = require('vinyl-source-stream');
const browserify    = require('browserify');
const babelify      = require('babelify');
const ngAnnotate    = require('browserify-ngannotate');
const sass          = require('gulp-sass');
const autoprefixer  = require('gulp-autoprefixer');
//const browserSync   = require('browser-sync').create();
const server        = require('gulp-server-livereload');
const rename        = require('gulp-rename');
const templateCache = require('gulp-angular-templatecache');
const uglify        = require('gulp-uglify');
const merge         = require('merge-stream');
//const sftp_new      = require('gulp-sftp-new');
const gutil         = require('gulp-util');
//const ftp           = require('gulp-ftp');
const imagemin      = require('gulp-imagemin');
const cssmin        = require('gulp-cssmin');
const open          = require('gulp-open');
const template      = require('gulp-template');
const gulpif        = require('gulp-if');
const order         = require("gulp-order");
const ftp           = require('vinyl-ftp' );

// Get/set letiables
const config = require('./gulp.config');
const pass = require('./pass');
const ENV = process.env.npm_lifecycle_event;

// Where our files are located
const jsFiles   = "src/js/**/*.js";
const viewFiles = "src/js/**/*.html";

const interceptErrors = function(error) {
    'use strict';
    let args = Array.prototype.slice.call(arguments);

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

// let ts = require("gulp-typescript");
const tsify = require('tsify');
const watchify = require('watchify');
 
// Compile application
gulp.task('jsApp', ['templates'], function() {
    // let b = browserify(config.src.babel)
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
    'use strict';
    let html = gulp.src(["build/index.html", "build/browserconfig.xml", "build/favicon.ico"])
        .pipe(gulp.dest('./dist/'));

    let css = gulp.src('build/css/*.css')
        .pipe(cssmin())
        //.pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/css/'));

    let js = gulp.src("build/js/**.js")
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'));

    let assets = gulp.src("build/assets/**")
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

// Copy assets: icon, locale, picture
gulp.task('copy-assets', function() {
    return gulp.src(config.src.assets)
        .pipe(gulp.dest('./'+ENV+'/assets'));
});

gulp.task('ftp-dev1-full', function () {
    'use strict';
    let src = './'+ENV;
    return gulp.src('dev1/**/*')
        .pipe(ftp(pass.dev1))
        .pipe(gutil.noop());
});

gulp.task('ftp-dev2-full', function () {
    'use strict';
    let src = './'+ENV;
    return gulp.src('dev2/**/*')
        .pipe(ftp(pass.dev2))
        .pipe(gutil.noop());
});

gulp.task('ftp-dev3-full', function () {
    'use strict';
    let src = './'+ENV;
    return gulp.src('dev3/**/*')
        .pipe(ftp(pass.dev3))
        .pipe(gutil.noop());
});

gulp.task('ftp-dev1', function () {
    'use strict';
    let src = './'+ENV;
    return gulp.src(['dev1/assets/css/**','dev1/assets/js/**','dev1/index.html'])
        .pipe(ftp(pass.dev1))
        .pipe(gutil.noop());
});

gulp.task('ftp-dev2-full', function () {
    'use strict';
    let src = './'+ENV;
    return gulp.src('dev2/**/*')
        .pipe(ftp(pass.dev2))
        .pipe(gutil.noop());
});

gulp.task('ftp-dev2', function () {
    'use strict';
    let src = './'+ENV;
    return gulp.src(['dev2/assets/css/**','dev2/assets/js/**','dev2/index.html'])
        .pipe(ftp(pass.dev2))
        .pipe(gutil.noop());
});

gulp.task('ftp-prd-full', function () {
    'use strict';
    let src = './'+ENV;
    return gulp.src('prd/**/*')
        .pipe(ftp(pass.prd))
        .pipe(gutil.noop());
});

gulp.task('ftp-prd', function () {
    'use strict';
    let src = './'+ENV;
    return gulp.src(['prd/assets/css/**','prd/assets/js/**','prd/index.html'])
        .pipe(ftp(pass.prd))
        .pipe(gutil.noop());
});

gulp.task('set-env', function() {
    return gulp.src('src/app/core/env.template.ts')
        .pipe(template(config.backend[ENV]))
        .pipe(rename({basename: 'api.constants'}))
        .pipe(gulp.dest('src/app/core/'))
});

gulp.task('ftp', () => {
    'use strict';
    let trg = gutil.env['trg'];
    let scope = gutil.env['scope'];
    let conn = ftp.create(pass[trg]);
    let files = {
        core: [trg+'/assets/css/**',trg+'/assets/js/**',trg+'/index.html'],
        assets: [trg+'/assets/icon/**',trg+'/assets/images/**',trg+'/assets/locale/**',trg+'/assets/picture/**']
    };

    gutil.log(gutil.env['trg'], gutil.env['scope']);

    return gulp
        .src(files[scope], {base: trg+'/', buffer: false})
        .pipe(order(files[scope]))
        //.pipe(conn.newer('/')) // only upload newer files
        .pipe(conn.dest('/'));
        /*.pipe(gulpif(scope === 'full',
            gulp.src([trg+'/assets/icon/**',trg+'/assets/images/**',trg+'/assets/locale/**',trg+'/assets/picture/**'],{base: trg+'/', buffer: false})
                .pipe( conn.newer( '/' ))
                .pipe( conn.dest('/'))));*/

    /*return gulp
        .src([trg+'/assets/css/**',trg+'/assets/js/**',trg+'/index.html'], {base: trg+'/', buffer: false})
        .pipe(order([trg+'/assets/css/**',trg+'/assets/js/**',trg+'/index.html']))
        .pipe(ftp(pass[trg]));*/
        /**.pipe(gulpif(scope === 'full',
            gulp.src([trg+'/assets/icon/**',trg+'/assets/images/**',trg+'/assets/locale/**',trg+'/assets/picture/**'])
                .pipe(ftp(pass[trg]))));**/

});


