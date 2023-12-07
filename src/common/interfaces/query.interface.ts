export interface IPagination {
  page?: number;
  size?: number;
}

export interface ITimerQuery extends IPagination {
  startTime?: Date;
  endTime?: Date;
}

export enum Sort {
  Asc = 1,
  Desc = -1,
}

export type QueryFields<T> = Partial<T>;

export type OrderFields<T> = Partial<Record<keyof T, Sort>>;

export interface IQueryMessage<T> extends ITimerQuery {
  queryFields: QueryFields<T>;
  orderFields: OrderFields<T>;
}
