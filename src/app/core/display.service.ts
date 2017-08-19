export default class DisplayService {

    static $inject = ['$translate'];

    constructor(private $translate: any) {

    }

    setLanguage(lng:string = 'en'):void {
        this.$translate.use(lng);
    }

    getLanguage():string {
        return this.$translate.use();
    }

}