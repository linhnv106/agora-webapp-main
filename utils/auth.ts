import { API_KEY, ENDPOINT_URL, NEXTAUTH_SECRET } from '@/constants';
import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

const refreshToken = async (tokens: JWT): Promise<JWT> => {
  const res = await fetch(`${ENDPOINT_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${tokens.refreshToken}`,
      'api-key': API_KEY,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch refresh token');
  }

  const response = await res.json();

  return { ...tokens, ...response };
};

export const authOptions: NextAuthOptions = {
  secret: NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      id: 'email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const res = await fetch(`${ENDPOINT_URL}/api/v1/auth/login`, {
          method: 'POST',
          headers: {
            'api-key': API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });

        if (res.status !== 200) {
          return false;
        }

        return await res.json();
      },
    }),
  ],
  callbacks: {
    async jwt(params) {
      if (params?.user) {
        params.token = params.user as unknown as JWT;
      }

      if (params.token) {
        const tokenExpires = params.token.tokenExpires as number;
        const currentDate = new Date().getTime();

        if (tokenExpires <= currentDate) {
          return await refreshToken(params.token);
        }
      }

      return params.token;
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user as any;
        (session as any).token = token.token;
      }

      return session;
    },
  },
};
