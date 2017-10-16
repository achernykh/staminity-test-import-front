import { Component, OnDestroy } from "@angular/core";
import { SessionService, getUser } from "../../core/session/session.service";
import { IUserProfile } from "../../../../api/user/user.interface";
import { Subject } from "rxjs/Rx";

@Component({
    selector: 'st-application',
    providers: [],
    template: require('./application.component.html') as string,
    styles: [require('./application.component.scss').toString()]
})
export class ApplicationComponent implements OnDestroy{

    user: IUserProfile;

    private destroy: Subject<any> = new Subject();

    constructor(private session: SessionService) {

        session.getObservable()
            .takeUntil(this.destroy)
            .map(getUser)
            .subscribe(profile => this.user = profile);

    }

    ngOnDestroy() {
        this.destroy.next();
        this.destroy.complete();
    }
}

