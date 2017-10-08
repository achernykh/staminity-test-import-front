import {translateSport, translateCategories, translateActivity} from "./activity.translate";
import {StateDeclaration} from "@uirouter/angular";
import {DisplayView, DefaultTemplate} from "../core/display.constants";
import {CalendarService} from "../calendar/calendar.service";
import MessageService from "../core/message.service";
import {ICalendarItem} from "../../../api/calendar/calendar.interface";
import UserService from "../core/user.service";

function configure($translateProvider:any,
                   $stateProvider: any) {

    $stateProvider
        .state('activity', <StateDeclaration> {
            url: '/activity/:calendarItemId',
            loginRequired: true,
            authRequired: ['user'],
            resolve: {
                view: () => new DisplayView('activity'),
                item: ['CalendarService', 'message','$stateParams', (CalendarService: CalendarService, message:MessageService, $stateParams) =>
                   CalendarService.getCalendarItem(null,null,null,null, $stateParams.calendarItemId)
                       .then(response => response && response[0])
                       .catch(error => {
                           message.systemWarning(error);
                           throw error;
                       })],
                athlete: ['item','UserService','message', (item:ICalendarItem, UserService: UserService, message:MessageService) =>
                    UserService.getProfile(item.userProfileOwner.userId).then(user =>  user, error => {
                        message.systemWarning(error);
                        throw error;
                    })]
            },
            views: {
                "application": {
                    component: "activity",
                    bindings: {
                        view: 'view.application'
                    }
                }
            }
        });

    // Текст представлений
    $translateProvider.translations('en', {activity: translateActivity['en']});
    $translateProvider.translations('ru', {activity: translateActivity['ru']});
    $translateProvider.translations('en', {sport: translateSport['en']});
    $translateProvider.translations('ru', {sport: translateSport['ru']});
    $translateProvider.translations('en', {category: translateCategories['en']});
    $translateProvider.translations('ru', {category: translateCategories['ru']});
}

configure.$inject = ['$translateProvider','$stateProvider'];

export default configure;