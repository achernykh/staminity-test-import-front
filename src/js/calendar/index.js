import { CalendarService } from './calendar.service.ts';
import Calendar from './calendar.component';
import { CalendarDay } from './day/calendar.day.component.js';
import { CalendarTotal } from './total/calendar.total.component.js';
import { CalendarActivity } from './item/calendar.activity.component.js';
import { CalendarActivityChart } from './activity-chart/activity.chart.component.js';
import { CalendarTotalChart } from './total-chart/total.chart.component.js';
import { scrollCurrentItem, scrollFire, keepScrollPosition } from './scroll.directives';
import {_measurement, _activity_measurement_view, _measurement_calculate, _measurement_system_calculate} from '../calendar-item/activity.constants'

export const calendar  = angular.module('staminity.calendar',[])

                            .filter('measureCalc', (UserService)=>{
                                return (data, sport, measure) => {
                                    if (!!data) {
                                        let unit = ((_activity_measurement_view[sport].hasOwnProperty(measure)) && _activity_measurement_view[sport][measure].unit) || _measurement[measure].unit
                                        let fixed = ((_activity_measurement_view[sport].hasOwnProperty(measure)) && _activity_measurement_view[sport][measure].fixed) || _measurement[measure].fixed
                                        if(unit !== _measurement[measure].unit)
                                            data = data * _measurement_calculate[_measurement[measure].unit][unit]
                                        if(UserService.displaySettings.units !== 'metric')
                                            data = data * _measurement_system_calculate[unit].multiplier
                                        return Number(data).toFixed(fixed)
                                    }
                                }
                            })
                            .filter('measureUnit', (UserService)=>{
                                return (measure, sport) => {
                                    let unit = ((_activity_measurement_view[sport].hasOwnProperty(measure)) && _activity_measurement_view[sport][measure].unit) || _measurement[measure].unit
                                    return (UserService.displaySettings.units === 'metric') ? unit : _measurement_system_calculate[unit].unit
                                }
                            })
                            .filter('duration', ()=> {
                                return (second = 0) => {
                                    return moment().startOf('day').seconds(second).format('H:mm:ss')
                                }
                            })
                            .service('CalendarService', ['SocketService',CalendarService])
                            .component('calendarActivityChart', CalendarActivityChart)
                            .component('calendarTotalChart', CalendarTotalChart)
                            .component('calendarDay', CalendarDay)
                            .component('calendarTotal', CalendarTotal)
                            .component('calendarActivity', CalendarActivity)
                            .component('calendar', Calendar)
                            .directive('scrollFire', scrollFire)
                            .directive('keepScrollPosition', keepScrollPosition)
                            .directive('scrollCurrentItem', scrollCurrentItem);

export default calendar;