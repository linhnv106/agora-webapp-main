import { ViewStatusEnum } from '@/utils/enums';
import { handleChangeRequest } from '@/utils/request';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const schema = z.object({
  records: z.array(
    z.object({
      status: z.enum([ViewStatusEnum.Idle, ViewStatusEnum.Viewing]),
      user: z.object({
        id: z.string().min(1, { message: 'User is required' }),
      }),
    }),
  ),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case 'POST':
      return handleChangeRequest(req, res, schema);

    default:
      throw new Error(`Unsupported method ${req.method}`);
  }
}
