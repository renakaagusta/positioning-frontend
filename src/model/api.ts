export enum StatusResponse {
  Success = 'success',
  Failed = 'failed',
}
export default interface ApiResponseInterface {
  status: StatusResponse;
  data: any;
  message: string;
}
