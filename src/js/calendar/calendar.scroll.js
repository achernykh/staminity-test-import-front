const times = (n) => [...new Array(n)].map((_, i) => i)


export class Datasource {
  constructor (item) {
    this.item = item
    this.range = [0, 1]
    this.items = []
    this.isLoadingUp = false
    this.isLoadingDown = false
    this.onLoad = () => {}
  }
  
  up (n = 10) {
    if (this.isLoadingUp) return
    console.log('up')
    this.isLoadingUp = true
    
    let i0 = this.range[0]
    this.range[0] -= n
    
    let items = times(n)
      .map((i) => i0 - i)
      .map(this.item)
      
    return Promise.all(items)
      .then((items) => { this.items = [...items.reverse(), ...this.items] })
      .then(() => { this.isLoadingUp = false })
      .then(() => this.onLoad())
  }
  
  down (n = 10) {
    if (this.isLoadingDown) return
    console.log('down')
    this.isLoadingDown = true
    
    let i0 = this.range[1]
    this.range[1] += n
    
    let items = times(n)
      .map((i) => i0 + i)
      .map(this.item)
      
    return Promise.all(items)
      .then((items) => { this.items = [...this.items, ...items] })
      .then(() => { this.isLoadingDown = false })
      .then(() => this.onLoad())
  }
}