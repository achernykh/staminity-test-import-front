import { IUserProfile } from "../../../api/user/user.interface";
export class User implements IUserProfile {

    constructor(private data: IUserProfile) {

    }

}