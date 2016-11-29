export default class SessionService {
  static $inject = ['$window'];

  private memoryStore: any;
  private storageType: string;
  private tokenKey: string;
  private userKey: string;

  constructor(private $window: any) {
    this.storageType = 'sessionStorage';
    this.tokenKey = 'authToken';
    this.userKey = 'authToken';
    this.memoryStore = {};
  }

  get(): string {
    try {
      return JSON.parse(this.$window[this.storageType].getItem(this.tokenKey)).token;
    } catch (e) {
      return this.memoryStore[this.tokenKey];
    }
  }

  getUser(): number {
    try {
      return JSON.parse(this.$window[this.storageType].getItem(this.userKey)).userId;
    } catch (e) {
      return this.memoryStore[this.tokenKey];
    }
  }

  set(value: string): void {
    try {
      this.$window[this.storageType].setItem(this.tokenKey, value);
    } catch (e) {
      this.memoryStore[this.tokenKey] = value;
    }
  }

  remove(): void {
    try {
      this.$window[this.storageType].removeItem(this.tokenKey);
    } catch (e) {
      delete this.memoryStore[this.tokenKey];
    }
  }

}
