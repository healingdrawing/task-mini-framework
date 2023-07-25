export class Events {
  private events: Record<string, Function[]>;

  constructor() {
    this.events = {};
  }

  on(eventName: string, callback: Function) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  emit(eventName: string, data?: any) {
    const callbacks = this.events[eventName];
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }
}
