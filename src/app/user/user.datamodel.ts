import {
    IUserProfile,
    IUserProfilePersonal,
    IUserProfilePrivate,
    IUserProfileDisplay,
    IUserProfilePublic,
    ITrainingZones,
    IPrivacy,
    IUserExternalAccount,
    IUserConnections,
    IUserNotifications,
    IUserProfileShort
} from "@api/user";
import { IBillingTariff, IBill } from "@api/billing";
import { fullImageUrl } from "../share/image/image.functions";
import { IUserManagementProfile } from "../../../api/group/group.interface";

export class User implements IUserProfile {

    userId?: number;
    revision?: number;
    isYourCoach?: boolean;
    public?: IUserProfilePublic;
    personal?: IUserProfilePersonal;
    private?: IUserProfilePrivate;
    display?: IUserProfileDisplay;
    trainingZonesLastChanged?: Date; // дата + время последнего изменения зон
    trainingZones?: ITrainingZones; //Array<ITrainingZonesType>;
    privacy?: IPrivacy[];
    // настройки синхронизации с внешними провайдерами данных
    externalDataProviders?: IUserExternalAccount[];
    // данные о доступных OAuth аутентификациях
    OAuthData?: {ProviderName: any;}; //данные, полученные от OAuth провайдера
    // Billing
    billing?: {
        tariffs: IBillingTariff[]; // детали по тарифным планам, активным на дату зароса информации из профиля
        bills: IBill[]; // счета, срок которых покрывает дату зароса информации из профиля
    };
    connections?: IUserConnections; // Connections
    notifications?: IUserNotifications; // Notifications

    constructor (data: IUserProfile | IUserProfileShort | IUserProfilePublic | IUserManagementProfile) {
        Object.assign(this, data);
    }

    get location (): string {
        return `${this.personal && this.personal.country || '-'} ${this.personal && this.personal.city || '-'}`;
    }

    get avatarPath (): string {
        return this.public && this.public.avatar && fullImageUrl()('/user/avatar/', this.public.avatar) || null;
    }

    get backgroundPath (): string {
        return this.public && this.public.background && fullImageUrl()('/user/background/', this.public.background) || null;
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

    get isJoinToCoach () {
        return this.connections.hasOwnProperty('Athletes') &&
            this.connections.Athletes.hasOwnProperty('availableInteractions') &&
            this.connections.Athletes.availableInteractions.btnJoinGroup && !this.isYourCoach &&
            (this.hasOwnProperty('private') && this.private.hasOwnProperty('isFree') || !this.hasOwnProperty('private'));
    }

    get isCoachRequestCancel () {
        return this.connections.hasOwnProperty('Athletes') &&
            this.connections.Athletes.hasOwnProperty('availableInteractions') &&
            this.connections.Athletes.availableInteractions.btnCancelJoinGroup;
    }

    get isLeaveCoach () {
        return this.connections.hasOwnProperty('Athletes') &&
            this.connections.Athletes.hasOwnProperty('availableInteractions') &&
            this.connections.Athletes.availableInteractions.btnLeaveGroup;
    }

}
