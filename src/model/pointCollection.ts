export interface GeometryInterface {
  coordinates: Array<number>;
  type?: string;
}

export interface PropertyInterface {
  text: string;
}

export interface PointInterface {
  id?: string;
  geometry: GeometryInterface;
  properties?: PropertyInterface;
  type?: string;
}

export interface PointCollectionInterface {
  id?: string;
  type: string;
  data: Array<PointInterface>;
}
