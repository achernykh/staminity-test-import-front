import { Subject } from "rxjs/Subject";

class LoaderService {
    private showRequestedSource = new Subject<string>();
    private hideRequestedSource = new Subject<string>();

    constructor() { }

    public showRequested$ = this.showRequestedSource.asObservable();
    public hideRequested$ = this.hideRequestedSource.asObservable();

    public show() {
        console.log("LoaderService => show");
        this.showRequestedSource.next(null);
    }

    public hide() {
        console.log("LoaderService => hide");
        this.hideRequestedSource.next(null);
    }
}

export default LoaderService;
