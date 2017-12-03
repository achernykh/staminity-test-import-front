import {IComponentController, IComponentOptions, IPromise} from "angular";
import { IUserNotifications } from "../../../../api/user/user.interface";
import "./settings-notification.component.scss";
import { groupStructure, INotificationGroup } from "./settings-notification.config";

class SettingsNotificationCtrl implements IComponentController {

    notifications: IUserNotifications;
    onChange: () => IPromise<void>;

    private list: IUserNotifications;
    private listGroup: INotificationGroup = {};

    static $inject = [];

    constructor() {

    }

    $onInit() {
        this.list = Object.assign({}, this.notifications);
        this.prepareNotificationGroup();
    }

    private prepareNotificationGroup(): void {

        if (!this.list) { return; }

        Object.keys(this.list).map((settings) => {
                Object.keys(groupStructure).map((group) => {
                    Object.keys(groupStructure[group]).map((subGroup) => {
                        if (groupStructure[group][subGroup].indexOf(settings) !== -1) {
                            if (!this.listGroup.hasOwnProperty(group)) {
                                this.listGroup[group] = {};
                            }
                            if (!this.listGroup[group].hasOwnProperty(subGroup)) {
                                this.listGroup[group][subGroup] = {};
                            }
                            this.listGroup[group][subGroup][settings] = this.list[settings];
                        }
                    });
                });
            },
        );
    }

    private change(name, value): void {

        this.list[name] = value;
        this.notifications = Object.assign({}, this.list);
        this.onChange();
    }

}

const SettingsNotificationComponent: IComponentOptions = {
    bindings: {
        notifications: "<",
        onChange: "&",
    },
    require: {
        //component: '^component'
    },
    controller: SettingsNotificationCtrl,
    template: require("./settings-notification.component.html") as string,
};

export default SettingsNotificationComponent;
