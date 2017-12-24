import { IRESTService, PostFile } from "../core/rest.service";

export class ImagesService {
    static $inject = ['RESTService'];

    constructor (private RESTService: IRESTService) {

    }

    /**
     * Загрузка картинки
     * @param image
     * @returns {Promise<string>}
     */
    postImage (image: any) : Promise<string> {
        return this.RESTService.postFile(new PostFile(`/imageStore/contentImage/1`, image))
        .then((response: any) => response.fileName);
    }
}