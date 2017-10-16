import { Pipe, PipeTransform } from "@angular/core";
import * as env from '../../../app/core/env.js';

@Pipe({ name: 'image' })
export class ImagePipe implements PipeTransform{
    transform(sub: string, url: string = 'default.jpg'): string {
        return url.indexOf('http') !== -1 ? url : env.content + '/content' + sub + url;
    }
}