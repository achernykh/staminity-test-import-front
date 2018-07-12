import moment from 'moment/min/moment-with-locales.js';
import { times, id, pipe, groupBy, prop, log, map, entries, fold, filter } from '../share/util.js';
// import { parseYYYYMMDD } from '../share.module.ts'


const date = (x) => x[0];
const type = (x) => x[1];
const time = (x) => (x[2] || 0) / (60*60);
const count = (x) => x[3] || 0;
const distance = (x) => x[4] || 0;

const valueTypes = [
    { key: 'time', value: time },
    { key: 'count', value: count },
    { key: 'distance', value: distance }
];

const sum = (xs, f = id) => xs.reduce((x, y) => x + f(y), 0);
const max = (xs, f = id) => xs.reduce((x, y) => Math.max(x, f(y)), 0);
const linearScale = ([x0, x1], [y0, y1]) => (x) => y0 + (y1 - y0) * (x - x0) / (x1 - x0);


const chartParams = {
    width: 430,
    height: 150,
    barWidth: 20
};


class SummaryStatisticsCtrl {

    constructor ($scope, $mdDialog, dialogs, SessionService, UserService, GroupService, SystemMessageService) {
        'ngInject';
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.dialogs = dialogs;
        this.SessionService = SessionService;
        this.UserService = UserService;
        this.GroupService = GroupService;
        this.message = SystemMessageService;
        this.chartParams = chartParams;

        this.ranges = [{
            key: 'month',
            periodLabel: (x) => moment().add(-x, 'years').format('YYYY'),
            start: (x) => moment().startOf('year').add(-x, 'years').format('YYYY-MM-DD'),
            end: (x) => moment().startOf('year').add(-x + 1, 'years').format('YYYY-MM-DD'),
            dates: (start) => times(12, (_, i) => moment(start).add(i, 'months').format('YYYY-MM-DD')),
            dateLabel: (date, i) => !(i % 2)? moment(date).format('MMM') : ''
        }, {
            key: 'day',
            periodLabel: (x) => moment().add(-x, 'months').format('YYYY-MM'),
            start: (x) => moment().startOf('month').add(-x, 'months').format('YYYY-MM-DD'),
            end: (x) => moment().startOf('month').add(-x + 1, 'months').format('YYYY-MM-DD'),
            dates: (start) => times(
                moment(start).daysInMonth(),
                (_, i) => moment(start).add(i, 'days').format('YYYY-MM-DD')
            ),
            dateLabel: (date, i) => !(i % 2)? moment(date).format('DD') : ''
        }];
        this.range = this.ranges[0];

        this.valueTypes = valueTypes;
        this.valueType = this.valueTypes[0];

        this.period = 0;
    }

    $onInit(){
        this.isMe = this.auth && this.SessionService.isCurrentUserId(this.user.userId);
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

    updateChart (series) {
        let { width, height, barWidth } = this.chartParams;

        let data = pipe(
            this.range.start,
            this.range.dates,
            map((d, i) => { 
                let label = this.range.dateLabel(d, i);
                let items = series.filter((item) => date(item) === d);
                let value = sum(items, this.valueType.value);
                return { label, value };
            })
        ) (this.period);

        let maxValue = max(data, prop('value'));
        let x = linearScale([-0.5, data.length + 0.5], [0, width]);
        let y = linearScale([0, maxValue], [0, height]);
        let levels = times(4, (_, i) => maxValue * (i + 1) / 4);

        this.chart = {
            width, height, barWidth,
            x, y, data, levels
        };
    }

    updateTable (series) {
        this.tableRows = pipe(
            filter(type),
            groupBy(type),
            entries,
            map(([type, series]) => ({
                sport: type,
                distance: sum(series, distance),
                time: sum(series, time),
                count: sum(series, count)
            }))
        ) (series);

        this.tableTotal = {
            distance: sum(series, distance),
            time: sum(series, time),
            count: sum(series, count)
        };
    }

    updateStatistics () {
        this.UserService.getSummaryStatistics(this.user.userId, this.range.start(this.period),  this.range.end(this.period), this.range.key)
        .then((summaryStatistics) => {
            this.summaryStatistics = summaryStatistics;
            this.updateChart(summaryStatistics.series);
            this.updateTable(summaryStatistics.series);
            this.$scope.$apply();
        });

        console.log(this);
    }

    getGradientUrl () {
        return `url(${window.location.protocol}//${window.location.host}${window.location.pathname}${window.location.search}#chart-bars)`;
    }
};

SummaryStatisticsCtrl.$inject = ['$scope','$mdDialog','dialogs','SessionService','UserService','GroupService','SystemMessageService'];

export default {
    bindings: {
        user: '<',
        auth: '<'
    },
    controller: SummaryStatisticsCtrl,
    template: require('./summary-statistics.component.html')
};