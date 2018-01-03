import { StateDeclaration } from "angular-ui-router";

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