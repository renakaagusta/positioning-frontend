export interface RouteInterface {
  id?: string;
  from: string;
  to: Array<string>;
}

export interface RouteCollectionInterface {
  id?: string;
  type: string;
  routes: Array<RouteInterface>;
}
