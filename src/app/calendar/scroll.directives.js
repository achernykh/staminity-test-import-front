import * as angular from 'angular';
import * as Rx from "rxjs/Rx";
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/interval'

import { timer, log } from './../share/util'


const findChildInViewport = (element) => {
  let { scrollTop } = element
  return Array.from(element.children).find(({ offsetTop, offsetHeight }) => offsetTop >= scrollTop)
}


const loop = (f) => {
  f()
  requestAnimationFrame(() => { loop(f) })
}


/* 
* Создаёт контроллер скроллинга, применяется к контейнеру.
* Опции:
*   onScrollContainerNotOverflown - выражение, выполняется, когда контент не заполняет контейнер и скроллинга нет
* Контроллер:
*   scrollings
*/
export const scrollContainer = () => ({
  require: 'scrollContainer',
  link (scope, element, attrs, scrollContainer) {
    scrollContainer.getScrollState = () => { 
      let { scrollTop, scrollHeight, offsetHeight } = element[0]
      return { scrollTop, scrollHeight, offsetHeight }
    }
    
    Observable.interval(500)
    .map(() => findChildInViewport(element[0]))
    .subscribe(scrollContainer.firstChildChanges)
    
    Rx.Observable.fromEvent(element[0], 'scroll').subscribe(scrollContainer.scrollings)
  },
  controller () {
    this.scrollings = new Rx.Subject()
    this.firstChildChanges = new Rx.Subject()
  }
})


export const onScrollHitTop = () => ({
  require: '^scrollContainer',
  link (scope, element, attrs, scrollContainer) {
    Observable.interval(200)
    .map(() => scrollContainer.getScrollState())
    .filter(({ scrollTop }) => scrollTop === 0)
    .subscribe(() => { 
      scope.$applyAsync(attrs.onScrollHitTop) 
    })
  }
})


export const onScrollHitBottom = () => ({
  require: '^scrollContainer',
  link (scope, element, attrs, scrollContainer) {
    Observable.interval(0)
    .map(() => scrollContainer.getScrollState())
    .filter(({ scrollTop, scrollHeight, offsetHeight }) => scrollHeight - scrollTop <= offsetHeight)
    .subscribe(() => { 
      scope.$applyAsync(attrs.onScrollHitBottom) 
    })
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
* Пытается устранять прыжки видимого положения скроллинга из-за изменения контента
*/
export const scrollKeepPosition = () => ({
  require: 'scrollContainer',
  link (scope, element, attrs, scrollContainer) {
    var snapshot
    
    let snap = () => {
      let child = findChildInViewport(element[0])
      if (child) {
        let offset = child.offsetTop
        let scroll = element[0].scrollTop
        let position = offset 
        snapshot = { child, offset, position, scroll }
      } else {
        snapshot = null
      }
    }
    
    let frame = () => {
      if (snapshot) {
        let offset = snapshot.child.offsetTop
        if (offset !== snapshot.offset) {
          let scroll = element[0].scrollTop
          let position = offset
          let shift = offset - snapshot.offset
          element[0].scrollTop += shift
          console.log('scroll back', shift)
        }
      }
      snap()
    }
    
    loop(frame)
    
    scrollContainer.scrollings.subscribe(() => { 
      frame()
    })
  }
})
