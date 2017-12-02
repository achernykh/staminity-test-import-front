import './training-season-builder.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import { TrainingSeason } from "../training-season/training-season.datamodel";
import { IUserProfile } from "../../../../api/user/user.interface";
import { ICalendarItem } from '@api/calendar';
import { TrainingSeasonData } from "../training-season-data/training-season-data.datamodel";
import { CalendarService } from "../../calendar/calendar.service";
import MessageService from "../../core/message.service";
import { TrainingSeasonService } from "../training-season.service";

class TrainingSeasonBuilderCtrl implements IComponentController {
    // bind
    season: TrainingSeason;
    currentUser: IUserProfile;
    owner: IUserProfile;

    // private
    private competitions: Array<ICalendarItem>;
    private data: TrainingSeasonData;

    // inject
    static $inject = ['CalendarService', 'TrainingSeasonService', 'message'];

    constructor (
        private calendarService: CalendarService,
        private trainingSeasonService: TrainingSeasonService,
        private messageService: MessageService) {

    }

    $onInit() {
        this.season = new TrainingSeason({
            code: '2018',
            description: 'Подготовка к стартам сезона 2018 года. Основная задача это улучшение...',
            dateStart: '2017.10.30',
            dateEnd: '2018.10.10'
        });

        this.trainingSeasonService.get()
            .then(
                success => {  },
                error => {  }
            );

        this.calendarService.search({
            userIdOwner: this.currentUser.userId,
            calendarItemTypes: ['competition']
        }).then(
            result => this.data.setCompetitions(result.arrayResult),
            error => { }
        );

        this.data = new TrainingSeasonData(this.season, []);
    }
}

const TrainingSeasonBuilderComponent:IComponentOptions = {
    bindings: {
        season: '<',
        currentUser: '<',
        owner: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingSeasonBuilderCtrl,
    template: require('./training-season-builder.component.html') as string
};

export default TrainingSeasonBuilderComponent;