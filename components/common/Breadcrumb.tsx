import { IRoute } from '@/utils/interfaces/system';
import Link from 'next/link';

function Breadcrumb(props: { routes: IRoute[] }) {
  return (
    <div className="text-sm breadcrumbs">
      <ul>
        {props.routes.map((route, index) => (
          <li key={index}>
            {route.url.length > 0 ? (
              <Link href={route.url}>{route.title}</Link>
            ) : (
              route.title
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Breadcrumb;
