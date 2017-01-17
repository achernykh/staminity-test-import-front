import moment from 'moment/src/moment';
import './calendar-item-measurement.component.scss';

class CalendarItemMeasurementData {

    constructor(mode, data, UserService) {
        debugger;
        if (mode == 'post')
            Object.assign(this,
                {
                    revision: null,
                    calendarItemId: null,
                    dateStart: (data.hasOwnProperty('date') && moment(data.date).format('YYYY-MM-DD')) || new Date(),
                    dateEnd: (data.hasOwnProperty('date') && moment(data.date).format('YYYY-MM-DD')) || new Date(),
                    calendarItemType: 'measurement',
                    userProfileOwner: {
                        userId: UserService.profile.userId,
                        public: UserService.profile.public
                    },
                    measurementHeader: {
                        sizes: {},
                        generalMeasures: {},
                        sleepData: {},
                        feeling: {}
                    }
                })
        else
            Object.assign(this, data)

        this._dateStart = new Date(this.dateStart)
        this._dateEnd = new Date(this.dateEnd)
    }

    prepare() {
        this.dateStart = moment(this._dateStart).format();
        this.dateEnd = this.dateStart;
        return this
    }

    compile(response) {
        console.log('response',response);
        this.revision = response.value.revision;
        this.calendarItemId = response.value.id;
    }
}
//CalendarItemMeasurementData.$inject = ['UserService'];

class CalendarItemMeasurementCtrl {
    constructor(CalendarService, UserService) {
        this.CalendarService = CalendarService;
        this.UserService = UserService;

        this.feeling = [
            'sentiment_very_satisfied',
            'sentiment_satisfied',
            'sentiment_neutral',
            'sentiment_dissatisfied',
            'sentiment_very_dissatisfied'
        ]

    }

    $onInit() {
        console.log('data=',this);
        this.item = new CalendarItemMeasurementData(this.mode, this.data, this.UserService);
    }

    onSave() {
        console.log('save',this.item);
        if (this.mode == 'post') {
            this.CalendarService.postItem(this.item.prepare())
                .then((response)=> {
                    this.item.compile(response) // сохраняем id, revision в обьекте
                    console.log('result=',this.item)
                    this.onAnswer({response: {type:'post',item:this.item}})
                })
        }
        if (this.mode == 'put') {
            this.CalendarService.putItem(this.item.prepare())
                .then((response)=> {
                    this.item.compile(response) // сохраняем id, revision в обьекте
                    console.log('result=',this.item)
                    this.onAnswer({response: {type:'put',item:this.item}})
                })
        }
    }

    onDelete() {
        this.CalendarService.deleteItem('F', [this.item.calendarItemId])
            .then((response)=> {
                console.log('delete result=',response)
                this.onAnswer({response: {type:'delete',item:this.item}})
            })
    }
}
CalendarItemMeasurementCtrl.$inject = ['CalendarService','UserService'];

export let CalendarItemMeasurementComponent = {
    bindings: {
        data: '=',
        mode: '@',
        onCancel: '&',
        onAnswer: '&'
    },
    transclude: true,
    controller: CalendarItemMeasurementCtrl,
    template: require('./calendar-item-measurement.component.html')
};

export default CalendarItemMeasurementComponent;