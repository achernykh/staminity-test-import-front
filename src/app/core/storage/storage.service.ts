export class StorageService {

    private readonly location: string = "localStorage";
    private storage: any;

    constructor() {
        this.storage = window[ this.location ];
    }

    public get(key: string): any {
        return JSON.parse(this.storage.getItem(key)) || null;
    }

    public set(key: string, data: any): void {
        this.storage.setItem(key, JSON.stringify(data));
    }

    public remove(key: string) {
        this.storage.removeItem(key);
    }

}
