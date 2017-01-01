import { _connection } from '../services/api/api.constants'


const avatar = () => (user) => _connection.content + (user? '/avatar/' + user.public.avatar : '/assets/avatar/default.png')

const username = () => (user) => `${user.public.firstName} ${user.public.lastName}`


const userInfo = {
    bindings: {
        user: "<"
    },
    
    templateUrl: 'components/userInfo.html'
}


class GroupActionsController {
    labels = {
        Athletes: {
            join: 'Начать тренироваться',
            joined: 'Ваш тренер',
            leave: 'Прекратить тренироваться'
        },
        Followers: {
            join: 'Подписаться',
            joined: 'Вы подписаны',
            leave: 'Отписаться'
        }
    }
    
    constructor ($scope, dialogs, GroupService) {
        'ngInject';
        this.dialogs = dialogs
        this.GroupService = GroupService
    }
  
    joinGroup (group) {
        return this.dialogs.confirm()
            .then((confirmed) => { if (!confirmed) throw new Error() })
            .then(() => this.GroupService.join(group.groupId, this.userId))
            .then(() => this.onUpdate())
    }
    
    leaveGroup (group) {
        return this.dialogs.confirm()
            .then((confirmed) => { if (!confirmed) throw new Error() })
            .then(() => this.GroupService.leave(group.groupId, this.userId))
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
    .filter('username', username)
    .component('userInfo', userInfo)
    .component('groupActions', groupActions)
    .directive("onFiles", onFiles)