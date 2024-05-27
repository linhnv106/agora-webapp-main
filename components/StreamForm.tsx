import React, { FormEvent, useEffect, useState } from 'react';
import { CreateStreamDto, IStream } from '@/utils/interfaces/stream';
import { Input } from './common/Input';
import { Select } from './common/Select';
import { ICluster } from '@/utils/interfaces/cluster';
import { useAppRouter } from '@/hooks/routes';

interface Props {
  initData?: IStream;
  clusters: ICluster[];
  onSubmit: (body: string) => Promise<Response>;
  onSuccess?: (data: any) => void;
  onFail?: (data: any) => void;
}

function StreamForm({
  initData,
  clusters,
  onSubmit,
  onSuccess,
  onFail,
}: Props) {
  const { onBack } = useAppRouter();
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateStreamDto>({
    name: '',
    address: '',
    clusterID: undefined,
  });

  useEffect(() => {
    if (initData) {
      setFormData({
        ...initData,
        clusterID: initData.cluster?.id,
      });
    }
  }, [initData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cluster = clusters.find(
      (cluster) => cluster.id === Number(formData.clusterID),
    );

    if (!cluster) {
      return setErrors({ ...errors, clusterID: 'Please select a cluster' });
    }

    setIsLoading(true);
    setErrors({});

    const payload = {
      name: formData.name,
      address: formData.address,
      cluster,
    };

    const response = await onSubmit(JSON.stringify(payload));
    setIsLoading(false);

    if (!response.ok) {
      const errorData = await response.json();
      setErrors(errorData);
      onFail?.(errorData);
    }

    const data = await response.json();

    onSuccess?.(data);
  };

  return (
    <form onSubmit={handleOnSubmit} className="form w-full">
      <div className="flex gap-4">
        <Input
          name="name"
          label="Name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          error={errors['name']}
        />
        <Select
          name="clusterID"
          label="Cluster"
          type="text"
          disabled={!!initData}
          options={
            clusters?.map((cluster) => ({
              name: cluster.domain,
              value: cluster.id,
            })) ?? []
          }
          value={formData.clusterID}
          onChange={handleInputChange}
          error={errors['clusterID']}
        />
      </div>
      <div className="flex gap-4 items-center">
        <Input
          name="address"
          label="Address"
          type="text"
          value={formData.address}
          onChange={handleInputChange}
          error={errors['address']}
        />
        {initData?.status && (
          <Input
            name="status"
            label="Status"
            type="text"
            disabled={!!initData}
            value={initData?.status}
            error={errors['status']}
          />
        )}
      </div>
      <div className="flex mt-4 justify-end gap-4 w-full">
        <div className="btn" onClick={onBack}>
          Back
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Submitting...' : initData ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}

export default StreamForm;
