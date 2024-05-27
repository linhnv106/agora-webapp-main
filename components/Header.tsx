import Link from 'next/link';
import { getSession } from '@/utils/session';
import { IRoute } from '@/utils/interfaces/system';
import { UserRole } from '@/utils/enums';
import { SignOutButton } from './common/Buttons';
import Dashboard from './Dashboard';

export default async function Header(props: { children: React.ReactNode }) {
  const session = await getSession();

  const routes: IRoute[] = [
    // { title: 'Dashboard', url: '/' },
    { title: 'My Stream', url: '/my-stream' },
  ];

  if (session?.user?.role === UserRole.Admin) {
    routes.push(
      { title: 'A | Users', url: '/admin/users' },
      // { title: 'A | Streams', url: '/admin/streams' },
    );
  }

  const userRoutes: IRoute[] = [{ title: 'Profile', url: '/me' }];

  const getAvatarLetters = (): string => {
    if (session?.user) {
      return session.user.firstName?.[0] + session.user.lastName?.[0];
    }
    return '?';
  };

  if (!session?.user) {
    return <Dashboard />;
  }

  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="w-full navbar bg-base-300">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2">
            <Link href="/">{'Supervisor'}</Link>
          </div>
          <div className="flex-none hidden lg:block">
            <ul className="menu menu-horizontal">
              {routes.map((route) => (
                <li key={route.url}>
                  <Link href={route.url}>{route.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar placeholder"
            >
              <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                <span className="text-xs">{getAvatarLetters()}</span>
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              {userRoutes.map((route) => (
                <li key={route.url}>
                  <Link href={route.url}>{route.title}</Link>
                </li>
              ))}
              <li>
                <SignOutButton />
              </li>
            </ul>
          </div>
        </div>
        <main className="md:min-h-[calc(100vh-120px)]">{props.children}</main>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200">
          {routes.map((route) => (
            <li key={route.url}>
              <Link href={route.url}>{route.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
