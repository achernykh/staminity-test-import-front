import { Subject } from 'rxjs/Subject';

export class LoaderService {
	private showRequestedSource = new Subject<string>();
	private hideRequestedSource = new Subject<string>();

	constructor() { }

	showRequested$ = this.showRequestedSource.asObservable();
	hideRequested$ = this.hideRequestedSource.asObservable();

	show() {
		console.log('LoaderService => show');
		this.showRequestedSource.next(null);
	}

	hide() {
		console.log('LoaderService => hide');
		this.hideRequestedSource.next(null);
	}
}
