import { _connection } from '../services/api/api.constants'

const image = () => (relativeUrl) => _connection.content + '/content' + relativeUrl

const avatar = () => (user) => `url(${user && user.public && user.public.avatar? image() ('/user/avatar/' + user.public.avatar) : '/assets/avatar/default.png'})`

const username = () => (user) => `${user.public.firstName} ${user.public.lastName}`


const userInfo = {
    bindings: {
        user: "<"
    },
    
    templateUrl: 'components/userInfo.html'
}


class GroupActionsController {
    
    constructor ($scope, dialogs, GroupService, UserService) {
        'ngInject';
        this.dialogs = dialogs
        this.GroupService = GroupService
        this.UserService = UserService
    }
  
    joinGroup (group) {
        return this.dialogs.confirm()
            .then((confirmed) => { if (!confirmed) throw new Error() })
            .then(() => this.GroupService.join(group.groupId, this.UserService.profile.userId))
            .then(() => this.onUpdate())
    }
    
    leaveGroup (group) {
        return this.dialogs.confirm()
            .then((confirmed) => { if (!confirmed) throw new Error() })
            .then(() => this.GroupService.leave(group.groupId, this.UserService.profile.userId))
            .then(() => this.onUpdate())
    }
    
    openMenu ($mdOpenMenu, event) {
        $mdOpenMenu(event)
    }
}


const groupActions = {
    bindings: {
        group: '<',
        onUpdate: '&'
    },
    
    controller: GroupActionsController,
    
    templateUrl: 'components/groupActions.html'
}


function onFiles() {
    return {
        scope: {
            onFiles: "<"
        },

        link (scope, element, attributes) {
            let onFiles = (event) => (scope) => { scope.onFiles(event.target.files) }
            element.bind("change", (event) => { scope.$apply(onFiles(event)) })
        }
    }
}


angular.module('staminity.components', [])
    .filter('avatar', avatar)
    .filter('image', image)
    .filter('username', username)
    .component('userInfo', userInfo)
    .component('groupActions', groupActions)
    .directive("onFiles", onFiles)