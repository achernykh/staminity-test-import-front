import { path } from "../share/utility/path";
import {
    IGroupProfile, IGroupProfileShort, IGroupProfilePublic, IGroupAvailableInteractions,
    IGroupInnerGroups, IGroupManagementProfile
} from "@api/group";
import { fullImageUrl } from "../share/image/image.functions";
import { User } from "../user/user.datamodel";
import { IUserProfile, IUserProfileShort } from "../../../api/user/user.interface";

export const isMember = (user: IUserProfile, club: IGroupProfile): boolean => path([
    "groupMembers", (members) => members.find((member) => member.userId === user.userId),
]) (club);

export const isManager = (user: IUserProfile, club: IGroupProfile): boolean => path([
    "innerGroups", "ClubManagement", "groupMembers", (managers) => managers.find((manager) => manager.userId === user.userId),
]) (club);

export class Club implements IGroupProfile{
    groupId: number;
    revision: number;
    groupIdParent: number; // ссылка на родительскую группу
    groupCode: string;
    groupName: string;
    groupType: string; //club/group тип отображения профиля группы
    groupUri: string; // суффикс относительного адреса страницы профиля группы в системе. Пример: /<groupType>/<uri>
    public: IGroupProfilePublic;
    isSystem: boolean; // системная группа или нет
    joinPolicy: string; // Каким образом возможно стать членом данной группы:
                        // [I] - By Invitation Only;
                        // [R] - By Invitation or By Request;
                        // [O] - Open Group - вход без необходимости подтверждения владельцем;
                        // [C] - Closed Group - закрытая группа для личных целей владельца;
                        // [M] - Mirrored -  техническая группа, зеркальное членство в которой копируется из других групп
    leaveByRequest: boolean; // необходимо ли подтверждение владельца для выхода из группы
    // члены группы
    groupMembersCount: number; // кол-во членов группы. Отсутствует, если владелец группы скрыл состав членов на уровне
    // настроек приватности.
    groupMembers: IUserProfileShort[];
    innerGroups: IGroupInnerGroups;
    // кнопки возможного взаимодействия, доступные посетителю профиля
    // доступны только для групп с joinPolicy = R/O
    availableInteractions?: IGroupAvailableInteractions;

    constructor (data: IGroupProfile | IGroupProfileShort | IGroupManagementProfile) {
        Object.assign(this,data);
    }

    get name (): string {
        return this.public && this.public.name;
    }

    get location (): string {
        return `${this.public && this.public.country || '-'} ${this.public && this.public.city || '-'}`;
    }

    get avatarPath (): string {
        return this.public.hasOwnProperty('directAvatar') && this.public.directAvatar ||
            this.public && this.public.avatar && fullImageUrl()('/group/avatar/', this.public.avatar) || null;
    }

    get backgroundPath (): string {
        return this.public && this.public.background && fullImageUrl()('/group/background/', this.public.background) || null;
    }

    get iconStyle (): Object {
        return {
            'background-image': `url(${this.avatarPath})`,
            'background-position': 'center',
            'background-size': 'cover',
            //'position': 'relative',
            'cursor': 'pointer'
        };
    }

    get backgroundStyle (): Object {
        return {
            'background-image': `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) 30%, rgba(0, 0, 0, 0.5) 60%, rgba(0, 0, 0, 0.7)), url(${this.backgroundPath})`,
            'background-color': 'grey',
            'background-size': 'cover',
            'background-position': 'center',
            'position': 'relative'
        };
    }

    get coaches (): Array<User> {
        return this.innerGroups.ClubCoaches.groupMembers.map(m => new User(m));
    }

    get athletes (): Array<User> {
        return this.innerGroups.ClubAthletes.groupMembers.map(m => new User(m));
    }

}

