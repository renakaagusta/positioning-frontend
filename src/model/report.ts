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
  rejectedBy?: Array<string>;
  createdAt: Date;
}
