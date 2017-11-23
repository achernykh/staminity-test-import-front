import { ICalendarItemDialogOptions } from "@app/calendar-item/calendar-item-dialog.interface";
import { IUserProfileShort } from "@api/user";
export class ActivityAuth {

    constructor (
        private owner: IUserProfileShort,
        private creator: IUserProfileShort,
        private options: ICalendarItemDialogOptions) {

    }

    get isOwner (): boolean {
       return this.owner.userId === this.options.currentUser.userId;
    }

    get isCreator (): boolean {
        return this.creator.userId === this.options.currentUser.userId;
    }

    get isPro (): boolean {
        return this.options.isPro;
    }

    // TODO не корректная логика определения тренера
    get isMyCoach (): boolean {
        return this.creator.userId === this.options.currentUser.userId;
    }

}