import { IComponentController, IComponentOptions } from "angular";
import { IBillingTariff, IGroupManagementProfile, IGroupManagementProfileMember, IUserProfile } from "../../../api";
import GroupService from "../core/group.service";
import { inviteDialogConf } from "../management/invite/invite.dialog";
import { createSelector } from "../share/utility";
import { arrays, functions } from "../share/utility";
import "./athletes.component.scss";
import { athletesOrderings, getMemberUsername, isBillByUser } from "./athletes.functions";
import { AthletesService } from "./athletes.service";

class AthletesCtrl implements IComponentController {

    /*
     * bind
     */
    public user: IUserProfile;
    public management: IGroupManagementProfile;

    public search: string = "";
    public orderBy: string = "username";
    public checked: IGroupManagementProfileMember[] = [];

    /**
     * Отфильтрованный и отсортированный список членов
     * @returns {Array<Member>}
     */
    public getRows: () => IGroupManagementProfileMember[] = createSelector([
        () => this.management,
        () => this.search,
        () => this.orderBy,
    ], (management: IGroupManagementProfile, search: string, orderString: string) => {
        const isReverseOrder = orderString.startsWith("-");
        const order = athletesOrderings[isReverseOrder ? orderString.slice(1) : orderString];
        return functions.pipe([
            arrays.filter((member) => getMemberUsername(member).includes(search)),
            arrays.orderBy(order),
            isReverseOrder ? arrays.reverse : functions.id,
        ]) (management.members);
    });

    public static $inject = ["$scope", "$mdDialog", "$translate", "GroupService", "AthletesService", "dialogs", "$mdMedia", "$mdBottomSheet", "SystemMessageService", "GroupService"];

    constructor(
        private $scope: any,
        private $mdDialog: any,
        private $translate: any,
        private groupService: GroupService,
        private athletesService: AthletesService,
        private dialogs: any,
        private $mdMedia: any,
        private $mdBottomSheet: any,
        private systemMessageService: any,
    ) {

    }

    /**
     * Обновить
     */
    public update() {
        return this.groupService.getManagementProfile(this.management.groupId, "coach")
            .then((management) => {
                this.management = management;
                this.checked = [];
                this.$scope.$asyncApply();
            }, (error) => {
                this.systemMessageService.show(error);
            });
    }

    /**
     * Доступна ли при выбранных строчках кнопка "Удалить"
     * @returns {boolean}
     */
    public isRemoveAvailable(): boolean {
        return this.athletesService.isRemoveAvailable(this.user, this.checked);
    }

    /**
     * Доступна ли при выбранных строчках кнопка "Тарифы"
     * @returns {boolean}
     */
    public isEditTariffsAvailable(): boolean {
        return this.athletesService.isEditTariffsAvailable(this.user, this.checked);
    }

    /**
     * Действие над выбранными строчками по кнопке "Тарифы"
     */
    public editTariffs() {
        this.athletesService.editTariffs(this.user, this.management, this.checked)
        .then((result) => {
            if (result) {
                this.update();
            }
        }, (error) => {
            if (error) {
                this.systemMessageService.show(error);
                this.update();
            }
        });
    }

    /**
     * Действие над выбранными строчками по кнопке "Удалить"
     */
    public remove() {
        this.athletesService.remove(this.management, this.checked)
        .then((result) => {
            if (result) {
                this.update();
            }
        }, (error) => {
            if (error) {
                this.systemMessageService.show(error);
            }
        });
    }

    /**
     * Действие по кнопке "Меню" члена клуба в мобильной версии
     * @param member: Member
     */
    public showActions(member: IGroupManagementProfileMember) {
        this.checked = [member];

        this.$mdBottomSheet.show({
            template: require("./member-actions.html"),
            scope: this.$scope,
            preserveScope: true,
        });
    }

    /**
     * Оплачен ли счёт по тарифу текущим пользователем
     * @param bill: IBillingTariff
     * @returns {boolean}
     */
    public isBillByUser(bill: IBillingTariff): boolean {
        return isBillByUser(this.user.userId, bill);
    }

    /**
     * Действие по кнопке "Пригласить в клуб"
     * @param $event
     */
    public invite($event) {
        this.$mdDialog.show(inviteDialogConf(this.user.connections.Athletes.groupId, $event));
    }

    /**
     * Использовать ли мобильную вёрстку
     * @returns {boolean}
    */
    public isMobileLayout(): boolean {
        return this.$mdMedia("max-width: 959px");
    }
};

const AthletesComponent: IComponentOptions = {

    bindings: {
        view: "<",
        user: "<",
        management: "<",
    },

    require: {
        app: "^staminityApplication",
    },

    controller: AthletesCtrl,

    template: require("./athletes.component.html"),

} as any;

export default AthletesComponent;
