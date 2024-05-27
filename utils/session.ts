import 'server-only';
import { cache } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { ISession } from './interfaces/system';

export const preload = () => {
  void getServerSession(authOptions);
};

export const getSession = cache(async (): Promise<ISession> => {
  return (await getServerSession(authOptions)) as ISession;
});
