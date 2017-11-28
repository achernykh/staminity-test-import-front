import './training-season-builder.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import { TrainingSeason } from "../training-season/training-season.datamodel";
import { IUserProfile } from "../../../../api/user/user.interface";
import { TrainingSeasonData } from "../training-season-data/training-season-data.datamodel";

class TrainingSeasonBuilderCtrl implements IComponentController {

    // bind
    season: TrainingSeason;
    currentUser: IUserProfile;
    owner: IUserProfile;

    // private
    data: TrainingSeasonData;

    static $inject = [];

    constructor() {

    }

    $onInit() {
        this.season = new TrainingSeason({
            code: '2018',
            description: 'Подготовка к стартам сезона 2018 года. Основная задача это улучшение...',
            dateStart: '2017.10.30',
            dateEnd: '2018.10.10'
        });

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