export interface IJwtPayload {
  id?: string;
  exp?: number;
  userId: string;
  fullName: string;
}

export interface ICustomRequest extends Request {
  user: IJwtPayload;
}
