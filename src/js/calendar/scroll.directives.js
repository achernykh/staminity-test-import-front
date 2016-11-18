export const scrollCurrentItem = () => ({
  link (scope, element, attrs) {
    var currentItem
    
    check()
    
    function check() {
      let item = [...element[0].children].find(isCurrent)
      if (item != currentItem) {
        let itemElement = angular.element(item)
        let itemScope = itemElement.scope()
        let itemHandler = itemElement.attr('on-scroll-current-item')
        itemScope && itemHandler && itemScope.$apply(itemHandler)
        currentItem = item
      }
      requestAnimationFrame(check)
    }
    
    function isCurrent(child) {
      return child.getBoundingClientRect && child.getBoundingClientRect().bottom > element[0].getBoundingClientRect().top && angular.element(child).attr('on-scroll-current-item')
    }
  }
})


export const scrollFire = () => ({
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


export const keepScrollPosition = () => ({
  link (scope, element, attrs) {
    var pivot = getPivot(), prevPivot = pivot
    var height = getHeight(), prevHeight = height
    var scrollPosition = getScrollPosition(pivot), prevScrollPosition = scrollPosition
    
    check()
    
    function check() {
      [pivot, prevPivot] = [getPivot(), pivot];
      [height, prevHeight] = [getHeight(), height];
      [scrollPosition, prevScrollPosition] = [getScrollPosition(pivot), scrollPosition];
      if (pivot && prevPivot && height != prevHeight) {
        let shift = getScrollPosition(prevPivot) - prevScrollPosition
        element[0].scrollTop += shift
      }
      requestAnimationFrame(check)
    }
    
    function getPivot() {
      return element[0].querySelector('.keep-scroll-position-pivot')
    }

    function getHeight() {
      let first = element[0].firstElementChild
      let last = element[0].lastElementChild
      return last.getBoundingClientRect().bottom - first.getBoundingClientRect().top
    }
    
    function getScrollPosition(pivot) {
      return pivot && pivot.getBoundingClientRect().top
    }
  }
})