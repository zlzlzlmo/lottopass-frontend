class BaseStorage<T> {
  constructor(private key: string) {}

  set(value: T) {
    sessionStorage.setItem(this.key, JSON.stringify(value));
  }

  get(): T | null {
    const item = sessionStorage.getItem(this.key);
    return item ? JSON.parse(item) : null;
  }

  remove() {
    sessionStorage.removeItem(this.key);
  }

  exists(): boolean {
    return sessionStorage.getItem(this.key) !== null;
  }
}

export default BaseStorage;
