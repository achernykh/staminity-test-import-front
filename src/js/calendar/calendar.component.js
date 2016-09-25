import {CalendarSettings} from './calendar.constants.js';
import {_PageAccess} from '../config/app.constants.js';

/**
 *
 */
class CalendarCtrl {
    constructor($log, $q, $timeout,$anchorScroll, $location, $rootScope, Auth, AppMessage) {
        'ngInject';
        this._$log = $log;
        this._$q = $q;
        this._$timeout = $timeout;
        this._$anchorScroll = $anchorScroll;
        this._$location = $location;
        this._$rootScope = $rootScope;
        // this._$scope = $scope;
        this._Auth = Auth;
        this._AppMessage = AppMessage;
        // this.grid = {};
        // this.datasource = {}; // bad test
        var self = this;
        this.grid = {
            cache: {
                initialize: function() {
                    this.isEnabled = true;
                    this.weeks = {};
                    this.getPure = self.grid.get;
                    return self.grid.get = this.getCached;
                },
                getCached: (index, count, successCallback) => {
                    var self;
                    self = this.grid.cache;
                    if (self.isEnabled) {
                        if (self.getWeeks(index, count, successCallback)) {
                            return;
                        }
                        return self.getPure(index, count, function(result) {
                            self.saveWeeks(index, count, result);
                            return successCallback(result);
                        });
                    }
                    return self.getPure(index, count, successCallback);
                },
                toggle: function() {
                    this.isEnabled = !this.isEnabled;
                    return this.weeks = {};
                },

                saveWeeks: function(index, count, resultWeeks) {
                    var i, item, j, len, results;
                    results = [];
                    for (i = j = 0, len = resultWeeks.length; j < len; i = ++j) {
                        item = resultWeeks[i];
                        if (!this.weeks.hasOwnProperty(index + i)) {
                            results.push(this.weeks[index + i] = item);
                        } else {
                            results.push(void 0);
                        }
                    }
                    return results;
                },

                getWeeks: function(index, count, successCallback) {
                    var i, isCached, j, ref, ref1, result;
                    result = [];
                    isCached = true;
                    for (i = j = ref = index, ref1 = index + count - 1; j <= ref1; i = j += 1) {
                        if (!this.weeks.hasOwnProperty(i)) {
                            isCached = false;
                            return;
                        }
                        result.push(this.weeks[i]);
                    }
                    successCallback(result);
                    return true;
                }
            },
            get: (index, count, success) => {
                this._$timeout( () => {
                    this._$log.info(`get grid index=${index} count=${count}`);
                    this._$log.info("grid=",this.grid, this.scrollAdapter);
                    // let result = [];
                    let i, grid, j, ref, ref1,result;
                    result = [];
                    // i,j,ref - указывают на первый элемент запрошенных данных
                    // ref1 - количество запрошенных данных
                    for (i = j = ref = index, ref1 = index + count - 1;
                         ref <= ref1 ? j <= ref1 : j >= ref1;
                         i = ref <= ref1 ? ++j : --j) {
                        let currWeek     = moment().weekday(i),
                          startDay    = moment(currWeek).add(i,'w'),
                          endDay      = moment(currWeek).add(i+1,'w');

                        let week = {};
                        week = this.getCalendarWeek(startDay, endDay);

                        // [start.format('YYYYWW')]
                        grid ={
                            id: i,
                            month: moment(startDay).format('YYYY MMMM'),
                            weekId: moment(currWeek).format('YYYYWW'),
                            week: week
                        };
                        this._$log.debug("Calendar grid", grid);

                        result.push(grid);
                    }
                    success(result);
                }, 100);
            }
        };

        this.grid.cache.initialize();
        this.scrollAdapter = {};
        /**
         * Слушаем события, которые могут обновить данные Календаря:
         * 1) newActivity - добавлена новая запись
         * 2) deleteActivity - удалена запись
         * 3) modifyActivity - изменена запись
         * 4) changeAthlete - изменен атлет
         */
        this._$rootScope.$on('addActivity', (event, data) => {
            this.$onPutActivity(data);
        });
        // Смена атлета тренера в основном окне приложения, необходмо перезагрузить все данные
        this._$rootScope.$on('changeAthlete', (event, data) => {
            this.$onInit();
        })

    }
    /**
     * Инициализация компонента
     * Последовательно выполняются задачи 1) формирование календарной сетки от текущей даты 2) получение записей
     * календаря из кэша браузера (если имеются) и вывод на экран 3) запрос актуализации кэша на стороне сервера
     * 4) получение актуальных данных от сервера, обновление представление на экране
     */
    $onInit() {

        // первый день текущей недели currDay
        let currDay     = moment().weekday(0); //,
            // startDay    = moment(currDay).add(-CalendarSettings.weekRange,'w'),
            // endDay      = moment(currDay).add(CalendarSettings.weekRange,'w');


        //this._$timeout(()=>angular.noop, 0).then(
        //    () => {
                this._$log.debug('Calendar: $onInit for user=',
                    this.app.currentUser, this.app.currentAthlete);
        //    });


        // this.getCalendarGrid(startDay, endDay).then(
        //     (success) => {
        //         this.grid = success;
        //         // var grid = {};
        //         //
        //         // grid.get = (index, count, success) =>{
        //         //     index = index <= 0 ? index + 1 : index -1;
        //         //     success(result.slice(index, index + count));
        //         // };
        //         //
        //         // this.grid = grid;
        //
        //
        //         this._$log.debug('Calendar: getCalendarGrid', this.grid);

                this.getActivityList(moment(currDay).add(0,'w'), moment(currDay).add(2,'w')).then(
                    (success) => {
                        this.activity = success;
                        /*this.showActivity(this.activity).then(
                            (success) => {
                                this._$log.debug('Calendar: grid after showActivity', this.grid);
                            }
                        )*/
                    }
                );
        //     },
        //     (error) => this._$log.debug('Calendar: onInit, getCalendar error', error),
        //     (week) => this._$log.debug('Calendar: onInit, getCalendar notify', week)
        // );

    }

    /**
     * Стандартная функция, срабатывает после успешного перехода на представление
     * Проверяем полученные параметры в ссылке url
     * @param next
     */
    $routerOnActivate(next){
        // Если передан параметр 'athlete' в ссылке, то календарь загружаем для данного атлета, а не текущего
        // пользователя
        if(next.params.athlete)
            this._$log.debug('Calendar: $routerOnActivate with athlete number', next.params.athlete);
    }
    /**
     * Функции обмена данными с сервером -------------------------------------------------------------------------------
     */
    /**
     * Получение списка событий календаря за период времени
     */
    getActivityList(){

    }
    /**
     * Изменение активности
     */
    postActivity(){

    }

    /**
     * Удаление активности
     */
    deleteActivity(){

    }

    /**
     * Обработка событий со стороны пользователя -----------------------------------------------------------------------
     */
    /**
     * Копирование активности
     */
    onCopyActivity(){

    }
    onDeleteActivity(){

    }
    onCopyDay(){

    }
    onDeleteDay(){

    }
    /**
     * Функции обновления данных по новым событиям со стороны сервера --------------------------------------------------
     */
    $onPutActivity(activity){
        this._$log.debug('Calendar: $onPutActivity', activity);
    }
    $onDeleteActivity(){

    }
    $onModifyActivity(){

    }

    mockGetActivityList(){

        this.showActivity(this.activity).then(
            (success) => {
                this._$log.debug('Calendar: grid after showActivity', this.grid);
            }
        )
    }
    mockClearActivityList(){

        this.activity.forEach( activity => {
            let iW = moment(activity.value.startTimestamp, 'X').format('YYYYWW'),
                iD = moment(activity.value.startTimestamp, 'X').format('YYYYMMDD');

            this.grid[iW][iD].activity = [];
        });
    }

    //TODO переделать под текущую сетку и ui-scroll
    showActivity(data){
        let result = this._$q.defer();
        this._$log.debug('Calendar: showActivity, new task to data', data);

            //
            // let iW = moment(data[8].value.startTimestamp, 'X').format('YYYYWW'),
            //   iD = moment(data[8].value.startTimestamp, 'X').format('YYYYMMDD');
            // this._$log.debug('Calendar: showActivity, ID', iD);
            // this.addActivity({iw: iW, id:iD, value: data[10]});
            // //this.grid[iW][iD].activity.push(activity.value);



        data.forEach( activity => {

            let iW = moment(activity.value.startTimestamp, 'X').format('YYYYWW'),
                iD = moment(activity.value.startTimestamp, 'X').format('YYYYMMDD');

            this.addActivity({iw: iW, id:iD, value: activity.value});
            //this.grid[iW][iD].activity.push(activity.value);


        });
        result.resolve(true);
        return result.promise;
    }

    /**
     *
     * @returns {Object}
     */
    // возращает дни недели.
    getCalendarWeek(startDay, endDay){
        let start = startDay, end = endDay;
        let diff = end.diff(start,'d'),
          day = {
              title: null,
              activity: []
          },
          week = {};
        // перебераем все дни недели.
        while (diff != 0) {

            day.title = start.format('DD');
            day.month = start.format('MMM');
            day.day = start.format('dd');
            angular.extend(week, {[start.format('YYYYMMDD')]: day});

            //this._$log.debug('Calendar: getCalendarGrid, curr day=', start.format('DD MMM'), diff, diff % 7);
            //Проверяем все дни на соответствие текущему, если соответствует - добавляем свойство today: true в
            //объект day. Далее с помощь ng-class добавляем класс today
            if (( start.format('DD MMM YYYY') ==  moment().format('DD MMM YYYY'))) {
                day.today = true;
            }
            day = {
                title: null,
                month: null,
                day: null,
                activity: []
            };

            start.add(1,'d');
            diff = end.diff(start,'d');
        }
        return week;
    }

    // Goto week
    gotoAnchor(index){
        // this._$mdToast.show(
        //   this._$mdToast.simple()
        //   .textContent('Simple Toast!')
        //   .position("top right")
        //   .hideDelay(3000)
        // );
        this._$log.info(`scrollto index= ${index}`);
        this._$log.debug("Calendar: hash", this._$location.hash());
        let newHash = 'anchor' + index;
        if (this._$location.hash() !== newHash) {
            // set the $location.hash to `newHash` and
            // $anchorScroll will automatically scroll to it
            this._$location.hash('anchor' + index);

        } else {
            // call $anchorScroll() explicitly,
            // since $location.hash hasn't changed
            this._$anchorScroll();
        }
    }

    // TODO добавить проверку на содержание в кэше, необходимой недели/дня.
    gotoIndex(index) {
        this._$log.info(`goto index= ${index}`);
        index = parseInt(index, 10);
        index = isNaN(index) ? 1 : index;
        this.scrollAdapter.reload(index);
    }

    //for test activity
    addActivity(data) {
        let weekId = data.iw, day = data.id, value = data.value;

        this._$log.debug("Calendar Activity",this.activity);

        this._$log.info(`add activity to weekId= ${weekId} day= ${day}`);
        return this.scrollAdapter.applyUpdates( (week, scope) => {

            let activity = [];
            try{
                if (week.weekId == weekId) {
                    let index = week.id;
                    this._$log.debug("week add data", week);
                    let setHere = week.week[day];
                    setHere.activity.push(value);
                    // for (let i=0; i <=60; i++) {
                    //     setHere.activity.push('activity #'+i);
                    // }
                    this._$log.debug("applyUpdates=", week, scope, index);

                    // week.activity = activity;
                }
            } catch (error){
                this._$log.error("Calendar error ", error);
            }


            return week;
        });
    }

    /**
     *
     * @returns {Array}
     */
    // getCalendarGrid(startDay, endDay){
    //     let start = startDay, end = endDay;
    //     let result = this._$q.defer(),
    //         grid = {},
    //         index = 0,
    //         diff = end.diff(start,'d'),
    //         day = {
    //             title: null,
    //             activity: []
    //         },
    //         week = {};
    //
    //     this._$log.debug('Calendar: getCalendarGrid, new request from', start.format('DD MMM'), 'to', end.format('DD MMM'));
    //     // Проходим циклом по всем дням от начала до конца. На вход передается первый день недели начала и последний
    //     // день недели окончания, таким образом работаем с полными неделями
    //     while (diff != 0){
    //         (start.format('DD') == '01') ? day.title = start.format('DD MMM') : day.title = start.format('DD');
    //         angular.extend(week, {[start.format('YYYYMMDD')]: day});
    //         //this._$log.debug('Calendar: getCalendarGrid, curr day=', start.format('DD MMM'), diff, diff % 7);
    //         day = {
    //             title: null,
    //             activity: []
    //         };
    //
    //         //
    //         if ((diff % 7 == 1) || diff == 0){
    //
    //             week = { [start.format('YYYYWW')]: week };
    //             angular.extend(grid,week);
    //             result.notify(week);
    //             week = {};
    //         }
    //
    //         start.add(1,'d');
    //         diff = end.diff(start,'d');
    //     }
    //     result.resolve(grid);
    //     return result.promise;
    // }

    /**
     * Запрашивает на сервере сводные данные по тренировкам с период в ремени (с, по)
     * @param start - начальная дата запроса
     * @param end - конечная дата запроса
     * @returns {*}
     */
    getActivityList(start, end){
        let result = this._$q.defer();
        let list = [];
        this._$log.debug('Calendar: getActivityList, new request from', start.format('DD MMM'), 'to', end.format('DD MMM'));
        // Генерируем случайные тестовые данные по всему диапазону запроса
        let diff = end.diff(start,'d');
        let activity = {};
        let mock = {
            type: ['бег','велосипед','плавание'],
            subType: ['Короткие интервалы', 'Длинные интервалы', 'Восстановление', 'Развитие мощности', 'Длинный' +
            ' темп', 'Работа на уровне МПК','Работа на уровне ПАНО'],
            timeDay: ['утро','день','вечер', null],
            result: {
                status: ['success','success','success','success','success','success','success','success','success',
                    'warning','warning','warning',
                    'error','error',
                    'noplan','noplan'],
            }
        };
        while (diff != 0){

            for (var i= 0; i <= Math.floor(Math.random() * 3)-1; i++) {
                activity = {};
                activity = {
                    activityId: i,
                    startTimestamp: start.format('X'),
                    activityCategory: {
                        code: mock.subType[Math.floor(Math.random() * mock.subType.length)]
                    },
                    activityType: {
                        code: mock.type[Math.floor(Math.random() * mock.type.length)]
                    },
                    social: {
                        userLikesCount: Math.floor(Math.random()*3),
                        userCommentsCount: Math.floor(Math.random()*2)
                    },
                    intervals: [
                        {
                            type: 'W',
                            assessment: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
                            duration: Math.floor(Math.random() * (180 - 40 + 1)) + 40,
                            distance: Math.floor(Math.random() * (50 - 3 + 1)) + 3,
                            TSS: Math.floor(Math.random() * (300 - 50 + 1)) + 50,
                            bpmAvr: Math.floor(Math.random() * (180 - 120 + 1)) + 120,
                            status: mock.result.status[Math.floor(Math.random() * mock.result.status.length)]
                        }
                    ]
                };
                list.push({type: 'activity', value: activity});
                //this._$log.debug('Calendar: getActivityList, mock activity=', activity);
            }

            start.add(1,'d');
            diff = end.diff(start,'d');
        }
        //this._$log.debug('Calendar: getActivityList, mock list=', list);
        result.resolve(list);
        return result.promise;
    }

}
/**
 * Компонент Calendar
 * @type {{bindings: {$router: string}, require: {}, transclude: boolean, controller,
 * templateUrl: string, $canActivate: Function}}
 */
let Calendar = {
    bindings: {
        $router: '<'
    },
    require: {
        app: '^staminityApplication'
    },
    transclude: false,
    controller: CalendarCtrl,
    templateUrl: 'calendar/calendar.html',
    /*$routeConfig: [
        {path: '/',    name: 'Calendar',   component: 'calendar', useAsDefault: true},
        {path: '/:id', name: 'Calendar', component: 'calendar'}
    ],*/
    $canActivate: function($log, $timeout, $nextInstruction, $prevInstruction, Auth, AppMessage, $rootRouter) {
        'ngInject';
        /**
         * Выполняем проверку полномочий с задержкой на 100мс на случай, если пользотватель не перешел на данную
         * страницу, а запустил ее сразу. При таком варианте инициализация сессии пользователя еще не завершиться и
         * проверка полномочий вернет ошибку
         */
        return new Promise((resolve, reject) => {
            $timeout(()=>angular.noop,500).then(
                () => {
                    $log.debug('Calendar: check auth=', $rootRouter, _PageAccess[$nextInstruction.componentType]);
                    let authorizedRoles = _PageAccess[$nextInstruction.componentType];
                    if (!Auth.isAuthorized(authorizedRoles)) {
                        $log.debug('Calendar: check auth false');
                        if (Auth.isAuthenticated())
                            AppMessage.show({
                                status: 'warning',
                                title: 'Ошибка авторизации',
                                text: 'К сожалению у вас не достаточно прав для просмотра запрашиваемой страницы.' +
                                ' Необхоимы полномочия '+ authorizedRoles
                            });
                        else {
                            AppMessage.show({
                                status: 'warning',
                                title: 'Ошибка аутентификации',
                                text: 'Для просмотра данной страницы необходимо пройти аутентификацию'
                            });
                        }
                        if ($prevInstruction == undefined) $rootRouter.navigate(['SignIn']);
                        return reject(false);
                    } else {
                        $log.debug('Calendar: check auth success');
                        return resolve(true);
                    }
                    //return reject;
                }
            )
        })
    }
};

export default Calendar;