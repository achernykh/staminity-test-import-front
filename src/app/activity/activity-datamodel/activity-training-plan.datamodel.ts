import { Activity } from "./activity.datamodel";
import { ICalendarItem } from "@api/calendar";

export class ActivityTrainingPlan extends Activity {

    constructor (private item: ICalendarItem, options?: any, service?: any) {
        super(item);
    }

    isComing (): boolean {
        return true;
    }

}