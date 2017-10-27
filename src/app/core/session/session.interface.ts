import { IUserProfile } from "../../../../api";

export interface ISession {
    userProfile?: IUserProfile;
    token?: string;
    systemFunctions?: Object;
}