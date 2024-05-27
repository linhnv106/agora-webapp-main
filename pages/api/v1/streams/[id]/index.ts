import {
  handleChangeRequest,
  handleDeleteRequest,
  handleGetRequest,
} from '@/utils/request';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  address: z.string().min(1, { message: 'Location is required' }),
  cluster: z.object({
    id: z.number().int('Cluster must be selected'),
  }),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case 'PUT':
    case 'PATCH':
    case 'POST':
      return handleChangeRequest(req, res, schema);

    case 'DELETE':
      return handleDeleteRequest(req, res);

    case 'GET':
      return handleGetRequest(req, res);

    default:
      throw new Error(`Unsupported method ${req.method}`);
  }
}
