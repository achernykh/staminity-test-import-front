import moment from 'moment/src/moment.js';
import { times, id, pipe, groupBy, log, map, entries, fold, filter } from '../share/util.js';

const date = (x) => x[0]
const type = (x) => x[1]
const time = (x) => x[2] || 0
const count = (x) => x[3] || 0
const dist = (x) => x[4] || 0

const sum = (xs, f = id) => xs.reduce((x, y) => x + f(y), 0)

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


class SummaryStatisticsCtrl {

    constructor ($scope, $mdDialog, dialogs, UserService, GroupService, SystemMessageService) {
        'ngInject';
        this.$scope = Object.assign($scope, { Boolean });
        this.$mdDialog = $mdDialog;
        this.dialogs = dialogs;
        this.UserService = UserService;
        this.GroupService = GroupService;
        this.message = SystemMessageService;
        this.isMe = this.user.userId === UserService.profile.userId;

        this.ranges = [{
            name: 'Обзор года',
            groupBy: 'month',
            periodName: (x) => moment().add(-x, 'years').format('YYYY'),
            start: (x) => moment().startOf('year').add(-x, 'years').format('YYYY-MM-DD'),
            end: (x) => moment().startOf('year').add(-x + 1, 'years').format('YYYY-MM-DD'),
            data: (series) => Array.from({ length: 12 })
                .map((_, month) => {
                    let monthSeries = series.filter(item => moment(date(item)).month() === month)
                    
                    return {
                        label: !(month % 2)? moment(new Date(0, month)).format('MMM') : '',
                        value: sum(monthSeries, this.valueType.f)
                    };
                })
        }, {
            name: 'Обзор месяца',
            groupBy: 'day',
            periodName: (x) => moment().add(-x, 'months').format('YYYY-MM'),
            dateLabel: (s) => moment(s).format('DD'),
            start: (x) => moment().startOf('month').add(-x, 'months').format('YYYY-MM-DD'),
            end: (x) => moment().startOf('month').add(-x + 1, 'months').format('YYYY-MM-DD'),
            data: (series) => Array.from({ length: moment().add(-this.period, 'months').daysInMonth() })
                .map((_, day) => {
                    let daySeries = series.filter(item => moment(date(item)).date() === day + 1)
                    
                    return {
                        label: !(day % 2)? moment(new Date(0, 0, day + 1)).format('DD') : '',
                        value: sum(daySeries, this.valueType.f)
                    };
                })
        }];
        this.range = this.ranges[0];

        this.valueTypes = [
            { name: 'время', f: time },
            { name: 'кол-во трен.', f: count }
        ];
        this.valueType = this.valueTypes[0];

        this.period = 0;

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

    getLabel(value) {
        return this.valueType.name === 'время' ? Number(value/(60*60)).toFixed(1) : value;
    }

    updateStatistics () {
        this.UserService.getSummaryStatistics(this.user.userId, this.range.start(this.period),  this.range.end(this.period), this.range.groupBy)
            .then((summaryStatistics) => this.summaryStatistics = summaryStatistics)
            .then(() => {
                pipe(
                    this.range.data,
                    (data) => { this.chart.setData(data); }
                ) (this.summaryStatistics.series)

                this.chart.tableRows = pipe(
                    filter(type),
                    groupBy(type),
                    entries,
                    map(([type, series]) => ({
                        sport: type,
                        icon: `assets/icon/${type}.svg`,
                        dist: sum(series, dist),
                        hrs: Math.ceil(sum(series, time) / (60*60)),
                        count: sum(series, count)
                    }))
                ) (this.summaryStatistics.series)

                this.chart.tableTotal = {
                    icon: 'functions',
                    dist: sum(this.summaryStatistics.series, dist),
                    hrs: Math.ceil(sum(this.summaryStatistics.series, time) / (60*60)),
                    count: sum(this.summaryStatistics.series, count)
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
        this.dialogs.usersList(this.user.connections.Coaches, 'Тренеры')
    }

    athletes () {
        this.dialogs.usersList(this.user.connections.allAthletes, 'Спортсмены')
    }

    friends () {
        this.dialogs.usersList(this.user.connections.Friends, 'Друзья')
    }

    subscriptions () {
        this.dialogs.usersList(this.user.connections.Following, 'Подписки')
    }

    subscribers () {
        this.dialogs.usersList(this.user.connections.Followers, 'Подписчики')
    }

    join (group, message) {
        return this.dialogs.confirm(message)
            .then((confirmed) => confirmed && this.GroupService.join(group.groupId, this.user.userId))
            .then((result) => { result && this.update() }, error => this.message.show(error))
    }

    leave (group, message) {
        return this.dialogs.confirm(message)
            .then((confirmed) => confirmed && this.GroupService.leave(group.groupId, this.user.userId))
            .then((result) => { result && this.update() }, error => this.message.show(error))
    }

    cancel (group, message) {
        return this.dialogs.confirm(message)
            .then((confirmed) => confirmed && this.GroupService.processMembership('C', group.groupId))
            .then((result) => { result && this.update() }, error => this.message.show(error))
    }

    openMenu ($mdOpenMenu, event) {
        $mdOpenMenu(event)
    }
};

SummaryStatisticsCtrl.$inject = ['$scope','$mdDialog','dialogs','UserService','GroupService','SystemMessageService'];

export default {
    bindings: {
        user: '<'
    },
    controller: SummaryStatisticsCtrl,
    template: require('./summary-statistics.component.html')
};