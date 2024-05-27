import { DefaultUser } from 'next-auth';
import { IUser } from './user';

export interface ISession {
  user: IUser;
  token: string;
}

export interface IRoute {
  title: string;
  url: string;
}

export interface IObject {
  [key: string]: any;
}

export interface TokenResponse {
  token: string;
  refreshToken: string;
  tokenExpires: number;
  user?: DefaultUser;
}
