import { ISeasonPlan, IPeriodizationScheme } from "@api/seasonPlanning/seasonPlanning.interface";
import { IUserProfileShort } from "@api/user/user.interface";

export class TrainingSeason implements ISeasonPlan {

    id: number;
    revision:number;
    userProfileOwner: IUserProfileShort;
    userProfileCreator: IUserProfileShort;
    code: string;
    description: string;
    dateStart: string;
    dateEnd: string;
    periodizationScheme: IPeriodizationScheme;

    constructor (data: ISeasonPlan | any) {
        Object.assign(this, data);
    }

}