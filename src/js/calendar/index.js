import Calendar from './calendar.component';
import { CalendarDay } from './day/calendar.day.component.js'
import { CalendarTotal } from './total/calendar.total.component.js'
import { CalendarActivity } from './item/calendar.activity.component.js'


const scrollFire = () => ({
  scope: {
    scrollFire: '&'
  },

  link (scope, element, attrs) {
    let parent = element.parent()
    
    setInterval(check, 50)
    
    function check() {
      if (isBelowTop() && isAboveBottom()) scope.$apply(scope.scrollFire)
    }
    
    function isAboveBottom() {
      return element[0].getBoundingClientRect().top < parent[0].getBoundingClientRect().bottom
    }
    
    function isBelowTop() {
      return element[0].getBoundingClientRect().bottom > parent[0].getBoundingClientRect().top
    }
  }
})


const keepScrollPosition = () => ({
  scope: {
  },

  link (scope, element, attrs) {
    var pivot
    var height, scrollPosition
    
    check()
    
    function check() {
      pivot = element[0].querySelector('.keep-scroll-position-pivot')
      let newHeight = getHeight()
      let newScrollPosition = getScrollPosition()
      if (newHeight != height) {
        console.log(newScrollPosition - scrollPosition)
        element[0].scrollTop += newScrollPosition - scrollPosition
      }
      height = newHeight
      scrollPosition = newScrollPosition
      requestAnimationFrame(check)
    }
  
    function getHeight() {
      let first = element[0].firstElementChild
      let last = element[0].lastElementChild
      return last.getBoundingClientRect().bottom - first.getBoundingClientRect().top
    }
    
    function getScrollPosition() {
      return pivot.getBoundingClientRect().top
    }
  }
})

export const calendar  = angular.module('staminity.calendar',[])
                            .component('calendarDay', CalendarDay)
                            .component('calendarTotal', CalendarTotal)
                            .component('calendarActivity', CalendarActivity)
                            .component('calendar', Calendar)
                            .directive('scrollFire', scrollFire)
                            .directive('keepScrollPosition', keepScrollPosition);

export default calendar;