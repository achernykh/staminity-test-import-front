import {IUserProfileShort, IUserProfile, ITrainingZonesType} from "../../../api/user/user.interface";

export const profileShort = (user: IUserProfile):IUserProfileShort => ({userId: user.userId, public: user.public});

export const getFTP = (zones: Array<ITrainingZonesType>, measure: string, sport: string):number => {
    return  (zones.hasOwnProperty(measure) && zones[measure].hasOwnProperty(sport) && zones[measure][sport]['FTP']) ||
            (zones.hasOwnProperty(measure) && zones[measure].hasOwnProperty('default') && zones[measure]['default']['FTP']) || null;
};