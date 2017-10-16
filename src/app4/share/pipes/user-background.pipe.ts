import { Pipe, PipeTransform } from "@angular/core";
import * as env from '../../../app/core/env.js';

@Pipe({ name: 'userBackground' })
export class UserBackgroundPipe implements PipeTransform {

    transform(url: string): string {
        return url && url !== 'default.jpg' ?
            env.content + '/content/user/background/' + url :
            '/assets/picture/default_background.jpg';
    }
}