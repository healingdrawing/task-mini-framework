export class Router {
  private routes: Record<string, Function>;

  constructor() {
    this.routes = {};
  }

  addRoute(path: string, handler: Function) {
    this.routes[path] = handler;
  }

  navigate(path: string) {
    const handler = this.routes[path];
    if (handler) {
      handler();
    } else {
      console.log('Route not found');
    }
  }
}
