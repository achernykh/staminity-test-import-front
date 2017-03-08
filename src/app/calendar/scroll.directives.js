import * as angular from 'angular';
import * as Rx from "rxjs/Rx";

import { timer, log } from './../share/util'


const findChildInViewport = (element) => {
  let { scrollTop, offsetHeight } = element
  return Array.from(element.children).find(({ offsetTop }) => scrollTop <= offsetTop && offsetTop <= scrollTop + offsetHeight)
}


/* 
* Создаёт контроллер скроллинга, применяется к контейнеру.
* Опции:
*   onScrollHitTop, onScrollHitBottom - выражение, выполняется при приближении к краю
*   scrollHitPadding - расстояние от крёв, на котором срабатывает hit
*   onScrollContainerNotOverflown - выражение, выполняется, когда контент не заполняет контейнер и скроллинга нет
* Контроллер:
*   scrollState - имеет вид { scrollTop, scrollHeight, offsetHeight } - это положение скролла, размер контента и размер контейнера
*   scrollings, domChanges, scrollStateChanges - потоки событий (Observable)
*/
export const scrollContainer = () => ({
  require: 'scrollContainer',
  link (scope, element, attrs, scrollContainer) {
    scrollContainer.scrollStateChanges
    .subscribe(() => { 
      let { scrollTop, scrollHeight, offsetHeight } = element[0]
      scrollContainer.scrollState = { scrollTop, scrollHeight, offsetHeight }
    })
    
    scrollContainer.domChanges
    .subscribe(() => { scrollContainer.clientRect = element[0].getBoundingClientRect() })
    
    scrollContainer.scrollStateChanges
    .map(() => findChildInViewport(element[0]))
    .distinctUntilChanged()
    .subscribe(scrollContainer.firstChildChanges)
    
    Rx.Observable.fromEvent(element[0], 'scroll').subscribe(scrollContainer.scrollings)
    scrollContainer.scrollStateChanges.next()
    scrollContainer.domChanges.next()
  },
  controller () {
    this.scrollState = null
    this.scrollings = new Rx.Subject()
    this.domChanges = new Rx.Subject()
    this.scrollStateChanges = new Rx.Subject()
    this.firstChildChanges = new Rx.Subject()
    this.scrollings.subscribe(this.scrollStateChanges)
    this.domChanges.subscribe(this.scrollStateChanges)
  }
})


export const scrollHitPadding = () => ({
  require: 'scrollContainer',
  link (scope, element, attrs, scrollContainer) {
    scrollContainer.scrollHitPadding = +scope.$eval(attrs.scrollHitPadding)
  }
})


export const onScrollContainerNotOverflown = () => ({
  require: '^scrollContainer',
  link (scope, element, attrs, scrollContainer) {
    scrollContainer.domChanges
    .merge(Rx.Observable.of(null, Rx.Scheduler.animationFrame))
    .map(() => scrollContainer.scrollState)
    .filter(({ scrollTop, scrollHeight, offsetHeight }) => scrollHeight <= offsetHeight)
    .subscribe(() => { 
      scope.$applyAsync(attrs.onScrollContainerNotOverflown) 
      requestAnimationFrame(() => { scrollContainer.domChanges.next() })
    })
  }
})


export const onScrollHitTop = () => ({
  require: '^scrollContainer',
  link (scope, element, attrs, scrollContainer) {
    scrollContainer.scrollStateChanges
    .merge(Rx.Observable.of(null, Rx.Scheduler.animationFrame))
    .throttleTime(20)
    .map(() => scrollContainer.scrollState)
    .filter(({ scrollTop }) => scrollTop <= (scrollContainer.scrollHitPadding || 0))
    .subscribe(() => { 
      scope.$applyAsync(attrs.onScrollHitTop) 
      requestAnimationFrame(() => { scrollContainer.domChanges.next() })
    })
  }
})


export const onScrollHitBottom = () => ({
  require: '^scrollContainer',
  link (scope, element, attrs, scrollContainer) {
    scrollContainer.scrollStateChanges
    .merge(Rx.Observable.of(null, Rx.Scheduler.animationFrame))
    .throttleTime(20)
    .map(() => scrollContainer.scrollState)
    .filter(({ scrollTop, scrollHeight, offsetHeight }) => scrollHeight - offsetHeight - scrollTop <= (scrollContainer.scrollHitPadding || 0))
    .subscribe(() => { 
      scope.$applyAsync(attrs.onScrollHitBottom) 
      requestAnimationFrame(() => { scrollContainer.domChanges.next() })
    })
  }
})


/*
* Потомок скроллконтейнера, который уведомляет о своем рендеринге
*/
export const scrollItem = () => ({
  require: '^scrollContainer',
  link (scope, element, attrs, scrollContainer) {
    scrollContainer.domChanges.next()
  }
})


/*
* Ставится прямым потомкам скроллконтейнера, выражение-аргумент выполняется, 
* когда элемент оказывается текущим
*/
export const onScrollCurrentItem = () => ({
  require: '^scrollContainer',
  link (scope, element, attrs, scrollContainer) {
    scrollContainer.firstChildChanges
    .filter(child => child === element[0])
    .subscribe(() => { attrs.onScrollCurrentItem && scope.$apply(attrs.onScrollCurrentItem) })
  }
})


/*
* Пытается устранять прыжки видимого положения скроллинга из-за изменения контента,
* параметр - поток событий о добавлениях контента сверху
*/
export const scrollKeepPosition = () => ({
  require: 'scrollContainer',
  link (scope, element, attrs, scrollContainer) {
    
    let updates = scope.$eval(attrs.scrollKeepPosition)
    
    updates
    .map(() => findChildInViewport(element[0]))
    .filter(child => child)
    .subscribe((child) => {
      let t0 = new Date()
      let offsetTop = child.offsetTop
      let position = offsetTop - element[0].scrollTop
      scope.$$postDigest(() => {
        let t1 = new Date()
        if (child.offsetTop !== offsetTop) {
          let shift = (child.offsetTop - element[0].scrollTop) - position
          element[0].scrollTop += shift
          console.log('restored scroll', shift, 'after', t1 - t0)
        } 
      })
    })
  }
})


/* 
*  На случай проблем с производительностью внутри $digest,
*  применяется к прямому потомку скроллконтейнера, 
*  отключает $watch, когда элемент скрывается из вида
*/
export const scrollSuspendWhenOut =  () => ({
  require: '^scrollContainer',
  link (scope, element, attrs, scrollContainer) {
    var watchers = null
    
    scrollContainer.scrollStateChanges
    .map(() => {
      let { top, height } = element[0].getBoundingClientRect()
      let containerRect = scrollContainer.clientRect
      let isVisible = top + height > containerRect.top && top < containerRect.top + containerRect.height
      return isVisible
    })
    .subscribe((isVisible) => {
      if (!isVisible && !watchers) { 
        watchers = scope.$$watchers
        scope.$$watchers = []
      } 
      
      if (isVisible && watchers) { 
        scope.$$watchers = watchers
        watchers = null
      }
    }) 
  }
})