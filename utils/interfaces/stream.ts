import { StatusEnum, StreamStatusEnum } from '../enums';
import { ICluster } from './cluster';
import { IUser } from './user';

export interface IStreamViewer {
  userID: string;
  user?: IUser;

  streamID: string;
  status: StatusEnum;
}

export interface IStream {
  name?: string;
  address?: string;
  cluster?: ICluster;

  id: string;
  status: StreamStatusEnum;
  createdAt: string;
  createdBy?: IUser;
  updatedAt: string;
  deletedAt: string | null;
  viewers?: IStreamViewer[];

  flvUrl?: string;
  hlsUrl?: string;

  __entity: string;
}

export interface CreateStreamDto
  extends Omit<
    IStream,
    'id' | 'status' | 'createdAt' | 'updatedAt' | 'deletedAt' | '__entity'
  > {
  clusterID?: any;
}
