var port = process.env.PORT;

var src = 'src/',
    bower = 'bower_components/',
    npm = 'node_modules/',
    dist = 'dist/',
    build = 'build/';

var jsLibs = [
    bower+"angular/angular.js",
    bower+"angular-component-router/angular_1_router.js",
    bower+"angular-animate/angular-animate.js",
    bower+"angular-aria/angular-aria.js",
    bower+"angular-material/angular-material.js",
    bower+"angular-translate/angular-translate.js",// перевод интерфейса пользователя
    bower+"angular-messages/angular-messages.js", // подсказки в формах ввода
    bower+"angular-material-icons/angular-material-icons.js", // добавление иконок (УДАЛИТЬ)
    bower+"angular-mocks/angular-mocks.js", // httpBackend
    bower+"angular-sanitize/angular-sanitize.js",
    bower+"angular-websocket/dist/angular-websocket.js", // веб-сокеты
    //bower+"AngularJS-Toaster/toaster.js", // нотификация
    //bower+"angular-moment/angular-moment.js", // директивы и фильтры для работы с датой
    bower+"moment/min/moment.min.js", // библиотека для работы с датой и временем
    bower+"moment/locale/ru.js", // библиотека для работы с датой и временем
    //bower+"angular-vs-repeat/src/angular-vs-repeat.js", //библиотека для бесконечного скрола
    //bower+"angular-leaflet-directive/dist/angular-leaflet-directive.js",
    //bower+"leaflet/dist/leaflet.js",
    //bower+"leaflet-plugins/layer/tile/Google.js",
    //bower+"d3/d3.js",
    //bower+"nvd3/build/nv.d3.js",
    //bower+"angular-nvd3/dist/angular-nvd3.js",
    bower+"angular-scroll/angular-scroll.js",
    bower+"localforage/dist/localforage.min.js",
    npm+"angular-ui-router/release/angular-ui-router.min.js",
    bower+"angular-ui-scroll/dist/ui-scroll.js", // бесконечный скролл
    bower+"angular-ui-scroll/dist/ui-scroll-jqlite.js", // дополнение к бесконечному скролу
    bower+"angular-drag-and-drop-lists/angular-drag-and-drop-lists.min.js", // библиотека drug & drop
	bower+"angular-read-more/dist/readmore.min.js" // библиотека для показа больших текстов [hm.readmore]
];

var cssLibs = [
    //bower+"normalize-css/normalize.css",
    bower+"angular-material/angular-material.min.css",
    bower+"animate.css/animate.min.css"
    //bower+"angular-material/angular-material.layouts.css",
    //bower+"leaflet/dist/leaflet.css",
    //bower+"nvd3/build/nv.d3.css",
    //bower+"angular-material-date-picker/dist/am-date-picker.min.css"
];

module.exports = {
    gulp: './gulp.config.js',
    src: {
        index: src + 'index.html',
        jsLibs: jsLibs,
        app: src + 'js/app.js',
        jsApp: [src + 'js/**/*.js', src + 'js/**//**/*.js' ],
        cssLibs: cssLibs,
        assets: src + 'assets/**/*.*',
        sass: src + 'sass/app.scss',
        sassFiles: [src + 'sass/app.scss' , src + 'js/**/*.scss', src + 'js/**/**/*.scss', src + 'sass/*.scss'],
        templates: [src + 'js/**/*.html', src + 'js/**/**/*.html', src + 'js/**/**/**/*.html']
    },
    dist: dist,
    build: build,
    serve: {
        server: "./build",
        port: port || 4000,
        notify: false,
        ui: {
            port: 4001
        }
    },
    localServer: {
        port: port || 8000,
        host: process.env.HOST || "0.0.0.0",
        livereload: {
            enable: false
        },
        directoryListing: false,
        defaultFile: 'index.html',
        fallback: 'index.html'
    }
};
