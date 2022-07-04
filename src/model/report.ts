import { LocationInterface } from './user';

export enum ReportCategory {
  TrafficJam = 'Traffic Jam',
  Accident = 'Accident',
}

export enum ReportStatus {
  Created = 'Created',
  Confirmed = 'Confirmed',
  Rejected = 'Rejected',
}

export enum ReportType {
  Simulation = 'Simulation',
  Real = 'Real',
}
export interface PositionInterface {
  label?: string;
  lat: number;
  lng: number;
}
export interface ReportInterface {
  id?: string;
  rider: string;
  handler?: string;
  handlerLocation?: LocationInterface;
  title: string;
  description: string;
  location?: LocationInterface;
  category: ReportCategory;
  status: ReportStatus;
  routes?: Array<PositionInterface>;
  type: ReportType;
  rejectedBy?: Array<string>;
  createdAt: any;
}
