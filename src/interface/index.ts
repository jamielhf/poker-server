export interface IBaseResp<T = {}> {
  status: EStatus;
  msg: string;
  data: T;
}

export enum EStatus {
  success = 200,
  fail = -1,
}
