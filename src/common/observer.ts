export class Observer {
  private subscribes: Record<string, Function[]> = {};

  on(event: string, callback: Function) {
    if (!this.subscribes.hasOwnProperty(event)) {
      this.subscribes[event] = [];
    }
    this.subscribes[event].push(callback);
    return callback;
  }

  dispatch(event: string, ...args: any[]) {
    if (this.subscribes.hasOwnProperty(event)) {
      this.subscribes[event].forEach((callback) => {
        callback(...args);
      });
    }
  }

  off(event: string, callback: Function) {
    if (this.subscribes.hasOwnProperty(event)) {
      const eventSubscribes = this.subscribes[event];
      const index = eventSubscribes.indexOf(callback);
      if (index !== -1) {
        if (eventSubscribes.length === 1) {
          Reflect.deleteProperty(this.subscribes, event);
        } else {
          this.subscribes[event].splice(index, 1);
        }
      }
    }
  }
}
