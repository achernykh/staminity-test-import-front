import { StateDeclaration } from "@uirouter/angularjs";

export enum FormMode {
    Post,
    Put,
    View,
    Delete
};

export interface IStaminityState extends StateDeclaration {
    loginRequired: boolean;
    authRequired: any[];
    wsRequired: boolean;
}