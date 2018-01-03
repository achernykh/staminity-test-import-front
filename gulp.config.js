const port = process.env.PORT;

const src = 'src/',
    bower = 'bower_components/',
    npm = 'node_modules/',
    dist = 'dist/',
    build = 'build/';

const jsLibs = [
    npm+"angular/angular.js",
    //bower+"angular-component-router/angular_1_router.js",
    npm+"angular-animate/angular-animate.js",
    npm+"angular-aria/angular-aria.js",
    npm+"angular-material/angular-material.js",
    npm+"angular-translate/dist/angular-translate.js",// перевод интерфейса пользователя
    npm+"angular-messages/angular-messages.js", // подсказки в формах ввода
    //bower+"angular-material-icons/angular-material-icons.js", // добавление иконок (УДАЛИТЬ)
    //bower+"angular-mocks/angular-mocks.js", // httpBackend
    npm+"angular-sanitize/angular-sanitize.js",
    npm+"angular-websocket/dist/angular-websocket.js", // веб-сокеты
    //bower+"AngularJS-Toaster/toaster.js", // нотификация
    //bower+"angular-moment/angular-moment.js", // директивы и фильтры для работы с датой
    npm+"moment/min/moment.min.js", // библиотека для работы с датой и временем
    npm+"moment/locale/ru.js", // библиотека для работы с датой и временем
    //bower+"angular-vs-repeat/src/angular-vs-repeat.js", //библиотека для бесконечного скрола
    //bower+"angular-leaflet-directive/dist/angular-leaflet-directive.js",
    //bower+"leaflet/dist/leaflet.js",
    //bower+"leaflet-plugins/layer/tile/Google.js",
    //bower+"d3/d3.js",
    //bower+"nvd3/build/nv.d3.js",
    //bower+"angular-nvd3/dist/angular-nvd3.js",
    npm+"angular-scroll/angular-scroll.js",
    npm+"localforage/dist/localforage.min.js",
    npm+"angular-ui-router/release/angular-ui-router.js",
    //npm+"angular-ui-scroll/dist/ui-scroll.js", // бесконечный скролл
    //npm+"angular-ui-scroll/dist/ui-scroll-jqlite.js", // дополнение к бесконечному скролу
    npm+"angular-drag-and-drop-lists/angular-drag-and-drop-lists.min.js", // библиотека drug & drop
    bower+"angular-read-more/dist/readmore.min.js", // библиотека для показа больших текстов [hm.readmore]
    npm+"jsoneditor/dist/jsoneditor.min.js", // json editor
    npm+"ng-jsoneditor/ng-jsoneditor.js", // json editor directive
    //npm+'rxjs/dist/rx.all.min.js',
    //npm+'rx-angular/dist/rx.angular.min.js',
    npm+'smDateTimeRangePicker/src/picker.js'
];

const cssLibs = [
    npm+"normalize-css/normalize.css",
    npm+"angular-material/angular-material.min.css",
    npm+"animate.css/animate.min.css",
    npm+"jsoneditor/dist/jsoneditor.css",
    npm+'smDateTimeRangePicker/src/picker.css'
    //bower+"angular-material/angular-material.layouts.css",
    //bower+"leaflet/dist/leaflet.css",
    //bower+"nvd3/build/nv.d3.css",
    //bower+"angular-material-date-picker/dist/am-date-picker.min.css"
];

const backend = {
    build: {
        protocol_ws: 'wss://',
        protocol_rest: 'https://',
        server: 'testapp.staminity.com:8080', 
        content: 'https://testapp.staminity.com:8080', 
        frontend: 'https://dev2.staminity.com/'
    },
    dev1: {
        protocol_ws: 'wss://',
        protocol_rest: 'https://',
        server: 'testapp.staminity.com:8080',
        content: 'https://testapp.staminity.com:8080',
        frontend: 'http://dev1.staminity.com/'
    },
    dev2: {
        protocol_ws: 'wss://',
        protocol_rest: 'https://',
        server: 'testapp.staminity.com:8080',
        content: 'https://testapp.staminity.com:8080',
        frontend: 'http://dev2.staminity.com/'
    },
    dev3: {
        protocol_ws: 'wss://',
        protocol_rest: 'https://',
        server: 'app.staminity.com',
        content: 'https://app.staminity.com',
        frontend: 'http://dev3.staminity.com/'
    },
    prd: {
        protocol_ws: 'wss://',
        protocol_rest: 'https://',
        server: 'app.staminity.com',
        content: 'https://app.staminity.com',
        frontend: 'https://staminity.com/'
    }
};

module.exports = {
    gulp: './gulp.config.js',
    src: {
        other: [src + 'browserconfig.xml', src + 'favicon.ico', src + 'manifest.json'],
        jsLibs: jsLibs,
        babel: { 
            cache: {}, 
            packageCache: {},
            entries: [src + 'js/app.js']
        },
        app: src + 'js/app.js',
        jsApp: [src + 'js/**/*.js', src + 'js/**/*.ts' ],
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
    },
    backend: backend
};
