import { Injectable } from '@angular/core';

@Injectable()
export class NewPageDialogService {

    constructor() { }

    print(text: string){
        console.log('NewPageDialogService: print value ', text);
    }

}