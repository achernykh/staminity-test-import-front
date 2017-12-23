import { Activity } from "./activity.datamodel";
import { ICalendarItem } from "@api/calendar";

export class ActivityTrainingPlan {//extends Activity {

    /**constructor (private item: ICalendarItem, private options?: any, private service?: any) {
        super(item, options, service);
    }**/

    isComing (): boolean {
        return true;
    }

}