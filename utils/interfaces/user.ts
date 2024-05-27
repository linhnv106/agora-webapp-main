import { StatusEnum, UserRole } from '../enums';

export interface IStreamerViewer {
  userID: string;
  user?: IUser;
  streamerID: string;
}

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  canStream: boolean;
  role: UserRole;
  status: StatusEnum;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  __entity: string;
  fullName: string;
  accessViewers?: IStreamerViewer[];
}

export interface UpdateUserDto
  extends Pick<IUser, 'email' | 'firstName' | 'lastName' | 'canStream'> {}
