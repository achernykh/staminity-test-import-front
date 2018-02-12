import { IPromise } from 'angular';
import { content } from "./env.js";
import { IRESTService, PostFile } from "./rest.service";

const isAbsoluteUrl = (url) => url.startsWith('https://') || url.startsWith('http://');

export class ImagesService {
    static $inject = ['RESTService'];

    constructor (private RESTService: IRESTService) {

    }

    /**
     * Загрузка картинки
     * @param image
     * @returns {Promise<string>}
     */
    postImage (image: any) : IPromise<any> {
        return this.RESTService.postFile(new PostFile(`/imageStore/contentImage/1`, image))
        .then((response: any) => {
            const url = response.fileName;
            return isAbsoluteUrl(url) ? url : content + url;
        });
    }
}