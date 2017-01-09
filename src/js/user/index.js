import { pipe, groupBy, log, map, entries, fold, filter } from '../util/util'


const date = (x) => x[0]
const type = (x) => x[1]
const time = (x) => x[2] || 0
const count = (x) => x[3] || 0

const icons = {
  run: 'directions_run',
  swim: 'pool',
  fitness: 'fitness_center',
  bike: 'directions_bike'
}


const chart = {
    width: 430,
    height: 150,
    barWidth: 20,
    
    bars: [],
    lines: [],
    tableRows: [],
    tableTotal: {},
    
    setData (data) {
        this.maxValue = data.reduce((m, { value }) => Math.max(m, value), 0)
        this.yScale = this.height / this.maxValue
        this.bars = data.map(({ label, value }) => ({ label, value, height: this.height - this.y(value) }))
        this.lines = [1/4 * this.maxValue | 0, 2/4 * this.maxValue | 0, 3/4 * this.maxValue | 0, 4/4 * this.maxValue | 0].map((value) => ({ label: `${value}`, y: this.y(value) }))
    },

    x (index) {
        return this.bars.length? (index + 0.5) * (this.width / this.bars.length) : 0;
    },

    y (value) {
        return this.height - value * this.yScale;
    }
};


class ProfileCtrl {

    constructor ($scope, $mdDialog, dialogs, UserService, GroupService, API) {
        'ngInject';
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.dialogs = dialogs;
        this.UserService = UserService;
        this.GroupService = GroupService;
        this.API = API;
        
        this.ranges = [{ 
            name: 'Обзор года', 
            groupBy: 'month',
            periodName: (x) => moment().add(-x, 'years').format('YYYY'),
            dateLabel: (s) => moment(s).format('MMM'), 
            start: (x) => moment().add(-(x + 1), 'years').format('YYYY-MM-DD'),
            end: (x) => moment().add(-x, 'years').format('YYYY-MM-DD')
        }, { 
            name: 'Обзор месяца', 
            groupBy: 'day',
            periodName: (x) => moment().add(-x, 'months').format('YYYY-MM'),
            dateLabel: (s) => moment(s).format('DD'), 
            start: (x) => moment().add(-(x + 1), 'months').format('YYYY-MM-DD'),
            end: (x) => moment().add(-x, 'months').format('YYYY-MM-DD')
        }];
        this.range = this.ranges[0];
        this.period = 0;
        
        this.valueTypes = [
            { name: 'время', f: time },
            { name: 'кол-во трен.', f: count }
        ];
        this.valueType = this.valueTypes[0];
        
        this.chart = chart;
        this.updateStatistics();
    }
    
    selectRange (range) {
        this.range = range
        this.period = 0
        this.updateStatistics()
    }
    
    selectValueType (valueType) {
        this.valueType = valueType
        this.updateStatistics()
    }
    
    selectPeriod (period) {
        this.period = period
        this.updateStatistics()
    }
    
    updateStatistics () {
        this.UserService.getSummaryStatistics(this.user.userId, this.range.start(this.period),  this.range.end(this.period), this.range.groupBy)
        .then((summaryStatistics) => this.summaryStatistics = summaryStatistics)
        .then(() => {
            pipe(
                filter(type),
                groupBy(date),
                entries,
                map(([date, series]) => ({ 
                    label: this.range.dateLabel(date), 
                    value: fold((a, x) => a + this.valueType.f(x), 0) (series)
                })),
                (data) => { this.chart.setData(data); }
            ) (this.summaryStatistics.series)
            
            this.chart.tableRows = pipe(
                filter(type),
                groupBy(type),
                entries,
                map(([type, series]) => ({ 
                    icon: icons[type], 
                    dist: '-', 
                    hrs: fold((a, x) => a + time(x), 0) (series), 
                    count: fold((a, x) => a + count(x), 0) (series)
                }))
            ) (this.summaryStatistics.series)
            
            this.chart.tableTotal = { 
                icon: 'functions', 
                dist: '-', 
                hrs: fold((a, x) => a + time(x), 0) (this.summaryStatistics.series), 
                count: fold((a, x) => a + count(x), 0) (this.summaryStatistics.series)
            }  
        })
        .then(() => { this.$scope.$apply() })
    }
  
    update () {
        return this.UserService.getProfile(this.user.userId)
            .then((user) => { this.user = user })
            .then(() => { this.$scope.$apply() })
    }
    
    coaches () {
        this.dialogs.group(this.user.connections.Coaches, 'Тренеры')
    }
    
    athletes () {
        this.dialogs.group(this.user.connections.Athletes, 'Спортсмены')
    }
    
    friends () {
        this.dialogs.group(this.user.connections.Friends, 'Друзья')
    }
    
    subscriptions () {
        this.dialogs.group(this.user.connections.Following, 'Подписки')
    }
    
    subscribers () {
        this.dialogs.group(this.user.connections.Followers, 'Подписчики')
    }
    
    joinAthletes (group) {
        return this.dialogs.confirm('Отправить запрос тренеру?')
            .then((confirmed) => { if (!confirmed) throw new Error() })
            .then(() => this.GroupService.join(this.user.connections.Athletes.groupId, this.UserService.profile.userId))
            .then(() => this.update())
    }
    
    leaveAthletes (group) {
        return this.dialogs.confirm('Покинуть тренера?')
            .then((confirmed) => { if (!confirmed) throw new Error() })
            .then(() => this.GroupService.leave(this.user.connections.Athletes.groupId, this.UserService.profile.userId))
            .then(() => this.update())
    }
    
    cancelAthletes () {
        return this.dialogs.confirm('Отменить заявку?')
            .then((confirmed) => { if (!confirmed) throw new Error() })
            .then(() => this.GroupService.processGroupMembership(this.user.connections.Athletes.groupId, 'C'))
            .then(() => this.update())
    }
    
    openMenu ($mdOpenMenu, event) {
        $mdOpenMenu(event)
    }
};


const user = {

    bindings: {
        view: '<',
        user: '<',
        summaryStatistics: '<'
    },

    require: {
        app: '^staminityApplication'
    },

    transclude: false,

    controller: ProfileCtrl,

    templateUrl: 'user/user.html',

    $routeConfig: [
        { path: '/', name: 'Profile', component: 'user', useAsDefault: true },
        { path: '/:id', name: 'Profile', component: 'user' }
    ]

};


angular.module('staminity.user', ['ngMaterial', 'staminity.components'])
    .component('user', user);
