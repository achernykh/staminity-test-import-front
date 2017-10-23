import { Component, Input } from "@angular/core";
import { IUserProfile } from "../../../../api/user/user.interface";
import { UserBackgroundPipe } from '../pipes/user-background.pipe';
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";

@Component({
    selector: 'st-application-menu',
    providers: [],
    template: require('./application-menu.component.html') as string,
    styles: [require('./application-menu.component.scss').toString()]
})
export class ApplicationMenuComponent {

    @Input() user: IUserProfile;

    constructor(private UserBackgroundPipe: UserBackgroundPipe,
                private sanitizer: DomSanitizer) {

    }

    userBackground(url: string): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(
            `linear-gradient(to bottom, rgba(0,0,0, 0.1), rgba(0, 0, 0, 0.2) 30%, rgba(0, 0, 0, 0.4) 60%, rgba(0, 0, 0, 0.5)), 
            url(${this.UserBackgroundPipe.transform(url)})`);
    }

}