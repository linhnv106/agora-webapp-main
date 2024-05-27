import { UserRole } from '@/utils/enums';
import { getSession } from '@/utils/session';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const session = await getSession();

  if (session.user.role !== UserRole.Admin) {
    return (
      <div className="hero h-[calc(100vh-120px)] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Access denied</h1>
            <p className="py-6">
              You do not have permission to access this page. Please contact
              your system administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <div className="w-full h-full">{props.children}</div>;
}
