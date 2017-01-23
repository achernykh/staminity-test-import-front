class CalendarActivityChartCtrl {
    constructor ($location) {
        this.colors = {
                'complete': ['#009688', '#00695C'],
                'complete warn': ['#FF9800', '#EF6C00'],
                'complete error': ['#F44336', '#C62828'],
                'dismiss': ['#F44336', '#C62828'],
                'planned': ['#E0E0E0', '#9E9E9E']
        };

        this.$location = $location;
        this.d = '';
        this.color = null;
        this.url = null;
    }



    /*$onInit(){
        console.debug('CalendarActivityChartCtrl: $onInit =>', this.data, this.status);
    }*/


    $onInit(){
        "use strict";

        this.d = [[0, 0], ...this.data, [1, 0]]
            .map(([x, y], i) => i? `H ${x} V ${y}` : `M ${x} ${y}`)
            .join(' ');

        this.color = this.colors[this.status];

        this.url = this.$location.absUrl();

        //console.debug('CalendarActivityChartCtrl: $onInit =>', this.d, this.color);

    }

    /*

    set data (data = []) {
        this.d = [[0, 0], ...data, [1, 0]]
            .map(([x, y], i) => i? `H ${x} V ${y}` : `M ${x} ${y}`)
            .join(' ')
    }

    get color () {
        return this.colors[this.status];
    } */
}
CalendarActivityChartCtrl.$inject = ['$location'];

export let CalendarActivityChart = {
    bindings: {
        data: '<',
        status: '<'
    },
    require: {
    //    calendar: '^calendar'
    },
    controller: CalendarActivityChartCtrl,
    template: require('./activity-chart.component.html')
}

export default CalendarActivityChart;