import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { DialogService } from "../dialog/dialog.service";

@Injectable()
export class MessageService {

    constructor(private toastBar: MatSnackBar, private dialog: DialogService) {}

    system(code: string, status: string = 'error', context: Object = null, delay: number = 10) {
        this.dialog.alert(code);
    }

    systemError(code: string, context?: {}, delay?: number) {
        this.system(code,'error',context,delay);
    }

    systemWarning(code: string, context?: {}, delay?: number) {
        this.system(code,'warning',context,delay);
    }

    systemSuccess(code: string, context?: {}, delay?: number) {
        this.system(code,'success',context,delay);
    }

    toast(code: string, status: string = 'error', context: {} = null, delay: number = 3 * 1000) {
        this.toastBar.open(code, null, { duration: delay });
    }

    toastError(code: string, context?: {}, delay?: number) {
        this.toast(code,'error',context,delay);
    }

    toastWarning(code: string, context?: {}, delay?: number) {
        this.toast(code,'warning',context,delay);
    }

    toastInfo(code: string, context?: {}, delay?: number) {
        this.toast(code,'info',context,delay);
    }

}