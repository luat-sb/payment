export interface IJwtPayload {
  userId: string;
  exp?: number;
}

export interface ICustomRequest extends Request {
  user: IJwtPayload;
}
