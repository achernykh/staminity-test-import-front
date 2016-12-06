export let _settings = {
    authToken: {
        format: 'single',
        key: null
    },
    userProfile: {
        format: 'single',
        key: ['userId']
    },
    userGroup: {
        format: 'multi',
        key: 'userGroupId'
    },
    getUserProfile: {

    }
}
export let _requests = {
    getUserProfile: {
        type: 'userProfile',
        key: 'userId'
    }
}