'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Breadcrumb from '@/components/common/Breadcrumb';
import Loading from '@/components/common/Loading';
import UserForm from '@/components/UserForm';
import { IStreamerViewer, IUser } from '@/utils/interfaces/user';
import { IRoute } from '@/utils/interfaces/system';
import AsyncSelect from 'react-select/async';
import { SelectOption } from '@/utils/interfaces/react-select';
import { MultiValue } from 'react-select';
import { UserRole } from '@/utils/enums';

function Page({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<IUser>();
  const [viewers, setViewers] = useState<SelectOption[]>([]);
  const [gradingError, setGradingError] = useState<string | undefined>();
  const [isGrading, setIsGrading] = useState<boolean>(false);
  
  const routes: IRoute[] = [
    { title: 'Home', url: '/' },
    { title: 'Stream Management', url: '/admin/users' },
    { title: 'Update Stream', url: '' },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`/api/v1/users/${params.id}`, {
        method: 'GET',
      });
      const user: IUser = await response.json();

      setUser(user);
    };

    fetchUser();
  }, [params.id]);


  useEffect(() => {
    if (user?.accessViewers) {
      const defaultUsers =
        user?.accessViewers?.reduce(
          (acc: SelectOption[], item: IStreamerViewer) => {
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
  }, [user]);
  const onUpdate = (body: string): Promise<Response> => {
    return fetch(`/api/v1/users/${params.id}`, { method: 'PATCH', body });
  };

  const onSuccess = (): void => {
    toast.success('Update user successfully');
  };

  const onFail = (errors: any): void => {
    toast.error('Update user failed');
  };

  const onGrandChange = (newValue: MultiValue<SelectOption>): void => {
    setViewers([...newValue]);
  };

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

    const onGrandeViewAccess = async (): Promise<void> => {
      setIsGrading(true);
  
      const records = viewers.map((item: SelectOption) => {
        return { user: { id: item.value } };
      });
      
      const response = await fetch(`/api/v1/streams/streamer/${params.id}/access`, {
        method: 'POST',
        body: JSON.stringify({ records }),
      });
  
      setIsGrading(false);
      if (!response.ok) {
        toast.error('Grand user access to streamer failed');
        return;
      }
      toast.success('Grand user access to streamer successfully');
    };

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="p-4">
      <Breadcrumb routes={routes} />
      <div className="border-solid border-2 rounded-md p-4 mt-4">
        <h3 className="pb-4 font-bold text-lg">Update stream</h3>
        <UserForm
          initData={user}
          onSubmit={onUpdate}
          onSuccess={onSuccess}
          onFail={onFail}
        />
      </div>
      {user.role == UserRole.Streamer && (
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
      )
      }
      
    </div>
  );
}

export default Page;
