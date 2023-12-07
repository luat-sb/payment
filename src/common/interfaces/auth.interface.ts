export interface IJwtPayload {
  userId: string;
  id?: string;
  exp?: number;
}

export interface ICustomRequest extends Request {
  user: IJwtPayload;
}
