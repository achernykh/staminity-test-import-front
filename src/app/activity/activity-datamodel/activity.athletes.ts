import { IUserProfile } from "@api/user";

export class ActivityAthletes {

    isRecalculateMode: boolean;
    list: Array<{profile: IUserProfile, active: boolean}> = [];

    constructor(private owner: IUserProfile, private currentUser: IUserProfile) {

        if(this.currentUser.connections.hasOwnProperty('allAthletes') && this.currentUser.connections.allAthletes){
            this.list = this.currentUser.connections.allAthletes.groupMembers
                .filter(user => user.hasOwnProperty('trainingZones'))
                .map(user => ({profile: user, active: user.userId === this.owner.userId}));

        }

        if(this.list.length === 0 || !this.list.some(athlete => athlete.active)) {
            this.list.push({profile: this.owner, active: true});
        }

        /**if (this.template && this.data && this.data.userProfileCreator) {
            this.list = [{ profile: this.data.userProfileCreator, active: true }];
        }**/
    }

    set (list, mode: boolean): void {

    }

    /**
     * Первый активный атлет
     * @returns {Array<{profile: IUserProfile, active: boolean}>|IUserProfile|null}
     */
    first (): IUserProfile {
        return this.list && this.list.filter(a => a.active)[0].profile || null;
    }

    /**
     * Много пользователей для планирования
     * @returns {Array<{profile: IUserProfile, active: boolean}>|boolean}
     */
    multi (): boolean {
        return this.list && this.list.filter(a => a.active).length > 1 || false;
    }

}