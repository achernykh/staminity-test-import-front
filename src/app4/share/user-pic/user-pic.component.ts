import { Component, Input } from "@angular/core";
import { IUserProfile } from "../../../../api/user/user.interface";

@Component({
    selector: 'st-user-pic',
    providers: [],
    template: require('./user-pic.component.html') as string,
    styles: [require('./user-pic.component.scss').toString()]
})
export class UserPicComponent {

    @Input() profile: IUserProfile;
    @Input() size: string;
    @Input() isPremium: boolean;

    constructor() {}
}