import {
  handleChangeRequest,
  handleDeleteRequest,
  handleGetRequest,
} from '@/utils/request';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const schema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Email is invalid' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
  confirmPassword: z.string(),
});

schema.superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Passwords do not match',
    });
  }
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
