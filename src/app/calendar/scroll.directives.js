import * as angular from 'angular';
import * as Rx from "rxjs/Rx";
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/interval'

import { maybe, entries, timer, log } from './../share/util'


const findChildInViewport = (element) => {
  let { scrollTop, scrollHeight } = element
  return Array.from(element.children).find(({ offsetTop, offsetHeight }) => offsetTop >= scrollTop)
}

const loop = (f) => {
  var stop
  
  const frame = () => {
    if (!stop) {
      f()
      requestAnimationFrame(frame)
    }
  }
  
  frame()
  
  return () => { stop = true }
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
    
    let firstChildChanges = scrollContainer.scrollings
      // .throttleTime(200)
      .map(() => findChildInViewport(element[0]))
      .subscribe(scrollContainer.firstChildChanges)
        
    let scroll = Rx.Observable.fromEvent(element[0], 'scroll')
      .subscribe(scrollContainer.scrollings)
    
    let unsubscribe = {
      frames: loop(() => scrollContainer.frames.next()),
      firstChildChanges: () => firstChildChanges.unsubscribe(),
      scroll: () => scroll.unsubscribe()
    }
  
    scope.$on('$destroy', () => {
      for (let key in unsubscribe) {
        unsubscribe[key] ()
      }
    })
  },
  controller () {
    this.frames = new Rx.Subject()
    this.scrollings = new Rx.Subject()
    this.firstChildChanges = new Rx.Subject()
  }
})


export const onScrollHitTop = () => ({
  require: '^scrollContainer',
  link (scope, element, attrs, scrollContainer) {
    scrollContainer.frames
    .throttleTime(200)
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
    let bottomPad = element[0].querySelector('.scroll__bottom-pad')
    scrollContainer.frames
    .map(() => scrollContainer.getScrollState())
    .filter(({ scrollTop, scrollHeight, offsetHeight }) => bottomPad.offsetTop - scrollTop <= offsetHeight)
    .subscribe(() => { 
      scope.$applyAsync(attrs.onScrollHitBottom) 
    })
  }
})


/*
* Пытается устранять прыжки видимого положения скроллинга из-за изменения контента
*/
export const scrollKeepPosition = () => ({
  require: 'scrollContainer',
  link (scope, element, attrs, scrollContainer) {
    var snapshot
    
    let frame = () => {
      if (snapshot) {
        let offset = snapshot.child.offsetTop
        if (offset !== snapshot.offset) {
          let shift = offset - snapshot.offset
          element[0].scrollTop += shift
          console.log('scrollKeepPosition', snapshot.selector, shift)
        }
      }

      snapshot = maybe (attrs.scrollKeepPosition) 
      (selector => element[0].querySelector(attrs.scrollKeepPosition)) 
      (child => ({
        child,
        offset: child.offsetTop,
        selector: attrs.scrollKeepPosition
      })) 
      ()
    }
    
    scrollContainer.scrollings
    .merge(scrollContainer.frames)
    .subscribe(frame)
  }
})
