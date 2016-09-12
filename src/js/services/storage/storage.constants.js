const StorageSettings = {
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
    }
}
export default StorageSettings
