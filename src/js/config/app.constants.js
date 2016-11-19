export const _AppConstants = {
    api: '193.124.181.87'
};
export const _UserRoles = {
    all: '*',
    admin: 'admin',
    user: 'user',
    proUser: 'proUser',
    coach: 'coach'
};
export const _PageAccess = {
    calendar: [_UserRoles.user, _UserRoles.proUser, _UserRoles.coach]
}