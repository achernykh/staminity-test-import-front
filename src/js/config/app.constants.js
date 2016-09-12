export const _AppConstants = {
    api: 'ws://193.124.181.87/'
    //api: 'http://localhost:8000/api'
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