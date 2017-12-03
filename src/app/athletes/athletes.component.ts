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
    user: IUserProfile;
    management: IGroupManagementProfile;

    search: string = "";
    orderBy: string = "username";
    checked: IGroupManagementProfileMember[] = [];

    /**
     * Отфильтрованный и отсортированный список членов
     * @returns {Array<Member>}
     */
    getRows: () => IGroupManagementProfileMember[] = createSelector([
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

    static $inject = ["$scope", "$mdDialog", "$translate", "GroupService", "AthletesService", "dialogs", "$mdMedia", "$mdBottomSheet", "SystemMessageService", "GroupService"];

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
    update() {
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
    isRemoveAvailable(): boolean {
        return this.athletesService.isRemoveAvailable(this.user, this.checked);
    }

    /**
     * Доступна ли при выбранных строчках кнопка "Тарифы"
     * @returns {boolean}
     */
    isEditTariffsAvailable(): boolean {
        return this.athletesService.isEditTariffsAvailable(this.user, this.checked);
    }

    /**
     * Действие над выбранными строчками по кнопке "Тарифы"
     */
    editTariffs() {
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
    remove() {
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
    showActions(member: IGroupManagementProfileMember) {
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
    isBillByUser(bill: IBillingTariff): boolean {
        return isBillByUser(this.user.userId, bill);
    }

    /**
     * Действие по кнопке "Пригласить в клуб"
     * @param $event
     */
    invite($event) {
        this.$mdDialog.show(inviteDialogConf(this.user.connections.Athletes.groupId, $event));
    }

    /**
     * Использовать ли мобильную вёрстку
     * @returns {boolean}
    */
    isMobileLayout(): boolean {
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
