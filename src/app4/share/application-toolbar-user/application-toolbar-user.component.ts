import { Component, Input } from "@angular/core";
import { IUserProfile } from "../../../../api/user/user.interface";

@Component({
    selector: 'st-application-toolbar-user',
    providers: [],
    template: require('./application-toolbar-user.component.html') as string,
    styles: [require('./application-toolbar-user.component.scss').toString()]
})
export class ApplicationToolbarUserComponent {
    @Input() user: IUserProfile;

    constructor() {}
}