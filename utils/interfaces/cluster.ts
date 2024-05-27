import { StatusEnum } from '../enums';
import { IStream } from './stream';

export interface ICluster {
  id: number;
  domain: string;
  username?: string;
  password?: string;
  status: StatusEnum;
  streams?: IStream[];
  createdAt: Date;
}
