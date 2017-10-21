import { Injectable, Component, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Observable } from "rxjs";

@Injectable()
export class DialogService {

    constructor(private dialog: MatDialog) {

    }

    alert(message: string): void {

        this.dialog.open(DialogAlert, {
            width: "200px",
            height: "400px",
            data: {
                title: `message.${message}.title`,
                content: `message.${message}.text`
            }
        });

    }

    confirm(): Observable<boolean> {

        let dialogRef = this.dialog.open(DialogConfirm, {
            width: "200px",
            height: "400px",
            data: {
                title: '',
                content: ''
            }
        });

        return dialogRef.afterClosed();

    }

}

@Component({
    selector: 'st-dialog-alert',
    template: require('./dialog-alert.template.html') as string,
})
export class DialogAlert {

    constructor(
        public dialogRef: MatDialogRef<DialogAlert>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onClick(): void {
        this.dialogRef.close();
    }
}

@Component({
    selector: 'st-dialog-confirm',
    template: require('./dialog-confirm.template.html') as string,
})
export class DialogConfirm {

    constructor(
        public dialogRef: MatDialogRef<DialogConfirm>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

}
