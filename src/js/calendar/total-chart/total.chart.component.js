class CalendarTotalChartCtrl {
    constructor () {
        this.colors = {
            'ok': { under: '#009688', over: '#009688' },
            'warning': { under: '#FF9800', over: '#FF9100' },
            'failure': { under: '#F44336', over: '#ff1744' },
            'disabled': { under: '#E0E0E0', over: '#90A4AE' },
        };
    }

    $onInit(){
        //console.debug('CalendarTotalChartCtrl: $onInit=>', this.value, this.max, this.status);
    }

    get isOver () {
        //console.debug('CalendarTotalChartCtrl: isOver=>', this.value, this.max, this.status);
        return typeof this.max === 'number' && this.value > this.max
    }

    get valueOver () {
        return this.isOver? this.value - this.max : 0
    }

    get valueUnder () {
        return this.isOver? this.max : this.value
    }

    get color () {
        return this.colors[this.status]
    }
}

export let CalendarTotalChart = {
    bindings: {
        value: '<',
        max: '<',
        status: '<'
    },
    controller: CalendarTotalChartCtrl,
    templateUrl: 'calendar/total-chart/total.chart.html'
};