'use server';
import { z } from 'zod';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { ENDPOINT_URL } from '@/constants';

export async function handleChangeRequest(
  req: NextApiRequest,
  res: NextApiResponse,
  resourceSchema: z.ZodObject<any, any>,
) {
  const session = await getServerSession(req, res, authOptions);
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${(session as any).token}`,
  };

  if (req.body) {
    const parsed = resourceSchema.safeParse(JSON.parse(req.body));
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        errors[issue.path[0]] = issue.message;
      });
      console.log('pramod');
      return res.status(400).json(errors);
    }
  }

  const apiResponse = await fetch(`${ENDPOINT_URL}${req.url}`, {
    method: req.method,
    body: req.body,
    headers,
  });

  if (!apiResponse.ok) {
    const { errors, status } = await apiResponse.json();
    return res.status(status).json(errors);
  }

  return res.status(200).json(await apiResponse.json());
}

export async function handleGetRequest(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${(session as any).token}`,
  };

  const apiResponse = await fetch(`${ENDPOINT_URL}${req.url}`, {
    method: req.method,
    headers,
  });

  if (!apiResponse.ok) {
    const { errors, status } = await apiResponse.json();
    return res.status(status).json(errors);
  }

  return res.status(200).json(await apiResponse.json());
}

export async function handleDeleteRequest(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${(session as any).token}`,
  };

  const apiResponse = await fetch(`${ENDPOINT_URL}${req.url}`, {
    method: req.method,
    headers,
  });

  if (!apiResponse.ok) {
    const { errors, status } = await apiResponse.json();
    return res.status(status).json(errors);
  }

  return res.status(200).json({});
}
