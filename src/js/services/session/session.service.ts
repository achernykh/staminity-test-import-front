export default class SessionService {
  static $inject = ['$window'];

  private memoryStore: any;
  private storageType: string;

  constructor(private $window: any) {
    this.storageType = 'localStorage';
    this.memoryStore = {};
  }

  get(key: string): string {
    try {
      return this.$window[this.storageType].getItem(key);
    } catch (e) {
      return this.memoryStore[key];
    }
  }

  set(key: string, value: string): void {
    try {
      this.$window[this.storageType].setItem(key, value);
    } catch (e) {
      this.memoryStore[key] = value;
    }
  }

  remove(key: string): void {
    try {
      this.$window[this.storageType].removeItem(key);
    } catch (e) {
      delete this.memoryStore[key];
    }
  }

}
