'use client';
import Breadcrumb from '@/components/common/Breadcrumb';
import Loading from '@/components/common/Loading';
import { IRoute } from '@/utils/interfaces/system';
import { Suspense, useEffect, useState } from 'react';
import { ICluster } from '@/utils/interfaces/cluster';
import StreamForm from '@/components/StreamForm';
import { toast } from 'react-toastify';

const Page = () => {
  const [clusters, setClusters] = useState<ICluster[]>([]);
  useEffect(() => {
    const fetchClusters = async () => {
      const response = await fetch(`/api/v1/clusters`, { method: 'GET' });
      const data = await response.json();

      setClusters(data);
    };

    fetchClusters();
  }, []);

  const routes: IRoute[] = [
    { title: 'Home', url: '/' },
    { title: 'Create New', url: '' },
  ];

  const onCreate = (body: string): Promise<Response> => {
    return fetch(`/api/v1/streams`, { method: 'POST', body });
  };

  const onSuccess = (): void => {
    toast.success('Create new stream successfully');
  };

  const onFail = (errors: any): void => {
    toast.error('Create new stream failed');
  };

  return (
    <Suspense fallback={<Loading />}>
      {
        <div className="p-4">
          <Breadcrumb routes={routes} />
          <h3 className="py-4 font-bold text-lg">Create new stream</h3>
          <StreamForm
            clusters={clusters}
            onSubmit={onCreate}
            onSuccess={onSuccess}
            onFail={onFail}
          />
        </div>
      }
    </Suspense>
  );
};

export default Page;
