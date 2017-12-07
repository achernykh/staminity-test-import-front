import moment from 'moment/min/moment-with-locales.js';
import { ISeasonPlan, IPeriodizationScheme } from "@api/seasonPlanning/seasonPlanning.interface";
import { IUserProfileShort } from "@api/user/user.interface";
import { IRevisionResponse } from "../../../../api/core/core";

export class TrainingSeason implements ISeasonPlan {

    id: number;
    revision:number;
    userProfileOwner: IUserProfileShort;
    userProfileCreator: IUserProfileShort;
    code: string;
    description: string;
    dateStart: string;
    dateEnd: string;
    durationMeasure: 'trainingLoad' | 'distance' | 'movingDuration';
    periodizationScheme: IPeriodizationScheme;

    private _dateStart: Date;
    private _dateEnd: Date;
    private keys: Array<string> = ['keys', 'revision', '_dateStart', '_dateEnd'];

    constructor (data?: ISeasonPlan | any) {
        Object.assign(this, data);
        this.prepareDefaultData();
    }

    applyRevision (revision: IRevisionResponse): TrainingSeason {
        this.id = revision.value.id;
        this.revision = revision.value.revision;
        return this;
    }

    prepare (keys: Array<string> = this.keys): ISeasonPlan {

        this.dateStart = this._dateStart.toISOString().substring(0, 10); // YYYY-MM-DD
        this.dateEnd = this._dateEnd.toISOString().substring(0, 10);
        this.periodizationScheme.id = Number(this.periodizationScheme.id);

        keys.map(p => delete this[p]);

        return <ISeasonPlan>this;
    }

    private prepareDefaultData (): void {
        if ( !this._dateStart ) { this._dateStart = moment().toDate(); }
        if ( !this._dateEnd ) { this._dateEnd = moment().add(1,'year').toDate(); }
        if ( !this.durationMeasure ) { this.durationMeasure = 'trainingLoad'; }
        if ( !this.periodizationScheme ) { this.periodizationScheme = { id: null }; }
    }

}