class CalendarActivityChartCtrl {
    constructor ($location) {
        this.colors = {
                'complete': ['#009688', '#00695C'],
                'complete-warn': ['#FF9800', '#EF6C00'],
                'complete-error': ['#F44336', '#C62828'],
                'dismiss': ['#F44336', '#C62828'],
                'coming': ['#E0E0E0', '#BDBDBD'],
                'not-specified': ['#E0E0E0', '#BDBDBD'],
                'template': ['#EEEEEE', '#E0E0E0']
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

        this.d = [[0, 0], ...this.data, [1, 0]]
            .map(([x, y], i) => i? `H ${x} V ${y}` : `M ${x} ${y}`)
            .join(' ');

        this.color = this.colors[this.status];
        this.url = window.hasOwnProperty('ionic') ?
            '' :
            `${window.location.protocol}//${window.location.host}${window.location.pathname}${window.location.search}`; //this.$location.absUrl();//.replace(/(\w+)#(\w+)/,$1);//`${this.$location.protocol()}//${this.$location.host()}:${this.$location.port()}${this.$location.path()}`;//

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