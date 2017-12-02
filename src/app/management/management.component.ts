import { IComponentController, IComponentOptions } from "angular";
import { IBillingTariff, IGroupManagementProfile } from "../../../api";
import GroupService from "../core/group.service";
import { createSelector, filtersToPredicate } from "../share/utility";
import { inviteDialogConf } from "./invite/invite.dialog";
import "./management.component.scss";
import { ClubRole, clubRoles, ClubTariff, clubTariffs } from "./management.constants";
import { ManagementService } from "./management.service";
import { Member } from "./member.datamodel";
import { getRows, MembersFilterParams, membersFilters, membersOrderings } from "./members-filter.datamodel";
import { MembersList } from "./members-list.datamodel";

class ManagementCtrl implements IComponentController {

    /**
     * Обработчик биндинга management
     * @param management: IGroupManagementProfile
     */
    set management(management: IGroupManagementProfile) {
        this.membersList = new MembersList(management);
    }

    public clubRoles = clubRoles;
    public clubTariffs = clubTariffs;
    public membersList: MembersList;
    public filterParams: MembersFilterParams = {
        clubRole: null,
        coachUserId: null,
        noCoach: false,
        search: "",
    };
    public orderBy: string = "username";
    public checked: Member[] = [];

    /**
     * Отфильтрованный и отсортированный список членов
     * @returns {Array<Member>}
     */
    public getRows: () => Member[] = createSelector([
        () => this.membersList,
        () => this.filterParams,
        () => this.orderBy,
    ], getRows);

    public static $inject = ["$scope", "$mdDialog", "$mdMedia", "$mdBottomSheet", "SystemMessageService", "GroupService", "ManagementService"];

    constructor(
        private $scope: any,
        private $mdDialog: any,
        private $mdMedia: any,
        private $mdBottomSheet: any,
        private systemMessageService: any,
        private groupService: GroupService,
        private managementService: ManagementService,
    ) {

    }

    /**
     * Обновить
     */
    public update() {
        this.groupService.getManagementProfile(this.membersList.groupId, "club")
        .then((management) => {
            this.management = management;
            this.checked = [];
            this.$scope.$asyncApply();
        }, (error) => {
            this.systemMessageService.show(error);
        });
    }

    /**
     * Выделение строчек таблицы, согласованное с фильтрами
     * @returns {Array<Member>}
     */
    public getChecked(): Member[] {
        return this.getRows().filter((member) => this.checked.indexOf(member) !== -1);
    }

    /**
     * Список всех тренеров (для меню фильтров)
     * @returns {Array<Member>}
     */
    public getCoaches(): Member[] {
        return this.membersList.getCoaches();
    }

    /**
     * Оплачен ли счёт по тарифу клубом
     * @param bill: IBillingTariff
     * @returns {boolean}
     */
    public isBillByClub(bill: IBillingTariff): boolean {
        return this.membersList.isClubBill(bill);
    }

    /**
     * Доступна ли при выбранных строчках кнопка "Тарифы"
     * @returns {boolean}
     */
    public isEditTariffsAvailable(): boolean {
        return this.managementService.isEditTariffsAvailable(this.membersList, this.getChecked());
    }

    /**
     * Доступна ли при выбранных строчках кнопка "Тренеры"
     * @returns {boolean}
     */
    public isEditCoachesAvailable(): boolean {
        return this.managementService.isEditCoachesAvailable(this.membersList, this.getChecked());
    }

    /**
     * Доступна ли при выбранных строчках кнопка "Спортсмены"
     * @returns {boolean}
     */
    public isEditAthletesAvailable(): boolean {
        return this.managementService.isEditAthletesAvailable(this.membersList, this.getChecked());
    }

    /**
     * Доступна ли при выбранных строчках кнопка "Роли"
     * @returns {boolean}
     */
    public isEditRolesAvailable(): boolean {
        return this.managementService.isEditRolesAvailable(this.membersList, this.getChecked());
    }

    /**
     * Действие над выбранными строчками по кнопке "Тарифы"
     */
    public editTariffs() {
        this.managementService.editTariffs(this.membersList, this.getChecked())
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
     * Действие над выбранными строчками по кнопке "Тренеры"
     */
    public editCoaches() {
        this.managementService.editCoaches(this.membersList, this.getChecked())
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
     * Действие над выбранными строчками по кнопке "Спортсмены"
     */
    public editAthletes() {
        this.managementService.editAthletes(this.membersList, this.getChecked())
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
     * Действие над выбранными строчками по кнопке "Роли"
     */
    public editRoles() {
        this.managementService.editRoles(this.membersList, this.getChecked())
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
        this.managementService.remove(this.membersList, this.getChecked())
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
    public showActions(member: Member) {
        this.checked = [member];

        this.$mdBottomSheet.show({
            template: require("./member-actions.html"),
            scope: this.$scope,
            preserveScope: true,
        });
    }

    /**
     * Действие по кнопке "Пригласить в клуб"
     * @param $event
     */
    public invite($event) {
        this.$mdDialog.show(inviteDialogConf(this.membersList.groupId, $event));
    }

    /**
     * Настройка фильтров членов клуба "Все"
     */
    public clearFilter() {
        this.filterParams = {
            ...this.filterParams,
            clubRole: null,
            coachUserId: null,
            noCoach: false,
        };
    }

    /**
     * Выбрана ли настройка фильтров членов клуба "Все"
     * @returns {boolean}
     */
    public isFilterEmpty(): boolean {
        const { clubRole, coachUserId, noCoach } = this.filterParams;
        return !clubRole && !coachUserId && !noCoach;
    }

    /**
     * Настройка фильтров членов клуба "Без тренера"
     */
    public setFilterNoCoach() {
        this.filterParams = {
            ...this.filterParams,
            clubRole: null,
            coachUserId: null,
            noCoach: true,
        };
    }

    /**
     * Выбрана ли настройка фильтров членов клуба "Без тренера"
     * @returns {boolean}
     */
    public isFilterNoCoach(): boolean {
        return this.filterParams.noCoach;
    }

    /**
     * Настройка фильтров членов клуба "Тренер"
     * @param coach: Member
     */
    public setFilterCoach(coach: Member) {
        this.filterParams = {
            ...this.filterParams,
            clubRole: null,
            noCoach: false,
            coachUserId: coach.userProfile.userId,
        };
    }

    /**
     * Выбрана ли настройка фильтров членов клуба "Тренер"
     * @param coach: Member
     * @returns {boolean}
     */
    public isFilterCoach(coach: Member) {
        return this.filterParams.coachUserId === coach.userProfile.userId;
    }

    /**
     * Настройка фильтров членов клуба "Роль"
     * @param clubRole: ClubRole
     */
    public setFilterRole(clubRole: ClubRole) {
        this.filterParams = {
            ...this.filterParams,
            coachUserId: null,
            noCoach: false,
            clubRole,
        };
    }

    /**
     * Выбрана ли настройка фильтров членов клуба "Роль"
     * @param clubRole: ClubRole
     * @returns {boolean}
     */
    public isFilterRole(clubRole: ClubRole): boolean {
        return this.filterParams.clubRole === clubRole;
    }

    /**
     * Геттер фильтра-поиска
     * @returns {string}
    */
    get search(): string {
        return this.filterParams.search;
    }

    /**
     * Сеттер фильтра-поиска
     * @param search: string
    */
    set search(search: string) {
        this.filterParams = {
            ...this.filterParams,
            search,
        };
    }

    /**
     * Активен ли фильтр-поиск
     * @returns {boolean}
    */
    public isFilterSearch(): boolean {
        return !!this.filterParams.search;
    }

    /**
     * Использовать ли мобильную вёрстку
     * @returns {boolean}
    */
    public isMobileLayout(): boolean {
        return this.$mdMedia("max-width: 959px");
    }
};

const ManagementComponent: IComponentOptions = {
    bindings: {
        view: "<",
        club: "<",
        management: "<",
    },
    require: {
        app: "^staminityApplication",
    },
    controller: ManagementCtrl,
    template: require("./management.component.html"),
} as any;

export default ManagementComponent;
