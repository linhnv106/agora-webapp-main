'use client';
import { useEffect, useState } from 'react';
import { MultiValue } from 'react-select';
import { toast } from 'react-toastify';
import AsyncSelect from 'react-select/async';
import StreamForm from '@/components/StreamForm';
import Breadcrumb from '@/components/common/Breadcrumb';
import Loading from '@/components/common/Loading';
import { ViewStatusEnum } from '@/utils/enums';
import { ICluster } from '@/utils/interfaces/cluster';
import { IStream, IStreamViewer } from '@/utils/interfaces/stream';
import { IObject, IRoute } from '@/utils/interfaces/system';
import { IUser } from '@/utils/interfaces/user';
import { SelectOption } from '@/utils/interfaces/react-select';

function Page({ params }: { params: { id: string } }) {
  const [stream, setStream] = useState<IStream>();
  const [viewers, setViewers] = useState<SelectOption[]>([]);
  const [configs, setConfigs] = useState<IObject>({});
  const [clusters, setClusters] = useState<ICluster[]>([]);
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [gradingError, setGradingError] = useState<string | undefined>();

  const routes: IRoute[] = [
    { title: 'Home', url: '/' },
    { title: 'Stream Management', url: '/admin/streams' },
    { title: 'Update Stream', url: '' },
  ];

  useEffect(() => {
    const fetchClusters = async () => {
      const response = await fetch(`/api/v1/clusters`, { method: 'GET' });
      const data = await response.json();

      setClusters(data);
    };

    const fetchSetting = async () => {
      const res = await fetch(`/api/v1/settings`, { method: 'GET' });
      if (!res.ok) {
        setConfigs({});
      } else {
        const data = await res.json();
        setConfigs(data.streams);
      }
    };

    const fetchStream = async () => {
      const response = await fetch(`/api/v1/streams/${params.id}`, {
        method: 'GET',
      });
      const streamObject: IStream = await response.json();

      setStream(streamObject);
    };

    fetchStream();
    fetchSetting();
    fetchClusters();
  }, [params.id]);

  useEffect(() => {
    if (stream?.viewers) {
      const defaultUsers =
        stream?.viewers?.reduce(
          (acc: SelectOption[], item: IStreamViewer) => {
            if (item.user) {
              const option: SelectOption = {
                value: item.user.id,
                label: item.user.fullName,
                isDisabled: false,
              };

              acc.push(option);
            }

            return acc;
          },
          [],
        ) ?? [];

      setViewers(defaultUsers);
    }
  }, [stream]);

  const loadUserOptions = (inputValue: string): Promise<SelectOption[]> =>
    fetch(`/api/v1/users?limit=500&search=${inputValue}&role=Viewer`, {
      method: 'GET',
    }).then(async (res) => {
      if (!res.ok) {
        return [];
      }

      const { data } = await res.json();
      return data?.map(
        (item: IUser): SelectOption => ({
          value: item.id,
          label: item.fullName,
          isDisabled: false,
        }),
      );
    });

  const onUpdate = (body: string): Promise<Response> => {
    return fetch(`/api/v1/streams/${params.id}`, { method: 'PATCH', body });
  };

  const onSuccess = (): void => {
    toast.success('Update stream successfully');
  };

  const onGrandChange = (newValue: MultiValue<SelectOption>): void => {
    setViewers([...newValue]);

    setGradingError(
      newValue.length > configs?.maxViewersPerStream
        ? `Limit reached: Maximum ${configs.maxViewersPerStream} viewers allowed.`
        : undefined,
    );
  };

  const onGrandeViewAccess = async (): Promise<void> => {
    setIsGrading(true);

    const records = viewers.map((item: SelectOption) => {
      const existingRecord = stream?.viewers?.find(
        (sv) => sv.userID === item.value,
      );
      const status = existingRecord?.status || ViewStatusEnum.Idle;

      return { status, user: { id: item.value } };
    });

    const response = await fetch(`/api/v1/streams/${params.id}/access`, {
      method: 'POST',
      body: JSON.stringify({ records }),
    });

    setIsGrading(false);
    if (!response.ok) {
      toast.error('Grand user access to stream failed');
      return;
    }
    toast.success('Grand user access to stream successfully');
  };

  const onFail = (errors: any): void => {
    toast.error('Update stream failed');
  };

  if (!stream) {
    return <Loading />;
  }

  return (
    <div className="p-4">
      <Breadcrumb routes={routes} />
      <div className="border-solid border-2 rounded-md p-4 mt-4">
        <h3 className="pb-4 font-bold text-lg">Update stream</h3>
        <StreamForm
          initData={stream}
          clusters={clusters}
          onSubmit={onUpdate}
          onSuccess={onSuccess}
          onFail={onFail}
        />
      </div>
      <div className="border-solid border-2 rounded-md p-4 mt-4">
        <h3 className="pb-4 font-bold text-lg">View access</h3>
        <AsyncSelect
          isMulti
          cacheOptions
          defaultOptions
          value={viewers}
          onChange={onGrandChange}
          loadOptions={loadUserOptions}
        />
        {gradingError && (
          <label className="label">
            <span className="label-text text-error">{gradingError}</span>
          </label>
        )}
        <div className="flex mt-4 justify-end gap-4 w-full">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onGrandeViewAccess}
            disabled={isGrading || !!gradingError}
          >
            {isGrading ? 'Grading...' : 'Grand Access'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
