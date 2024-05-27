import React, { FormEvent, useEffect, useState } from 'react';
import { useAppRouter } from '@/hooks/routes';
import { IUser, UpdateUserDto } from '@/utils/interfaces/user';
import { Input } from './common/Input';
import { Checkbox } from './common/Checkbox';

interface Props {
  initData?: IUser;
  onSubmit: (body: string) => Promise<Response>;
  onSuccess?: (data: any) => void;
  onFail?: (data: any) => void;
}

function UserForm({ initData, onSubmit, onSuccess, onFail }: Props) {
  const { onBack } = useAppRouter();
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateUserDto>({
    email: '',
    firstName: '',
    lastName: '',
    canStream: false,
  });

  useEffect(() => {
    if (initData) {
      setFormData(initData);
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

    setIsLoading(true);
    setErrors({});

    const payload: UpdateUserDto = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      canStream: formData.canStream,
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  return (
    <form onSubmit={handleOnSubmit} className="form w-full">
      <div className="flex gap-4">
        <Input
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          error={errors['email']}
          readOnly={!!initData}
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

      <div className="flex gap-4">
        <Input
          name="lastName"
          label="Last Name"
          type="text"
          value={formData.lastName}
          onChange={handleInputChange}
          error={errors['lastName']}
        />
        <Input
          name="firstName"
          label="First Name"
          type="text"
          value={formData.firstName}
          onChange={handleInputChange}
          error={errors['firstName']}
        />
      </div>
      {/* <div className="flex gap-4">
          <Input
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors['password']}
          />
          <Input
            name="confirmPassword"
            label="Confirm Password"
            type="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={errors['confirmPassword']}
          />
        </div> */}

      <Checkbox
        name="canStream"
        label="Can Stream"
        checked={formData.canStream}
        onChange={handleCheckboxChange}
      />
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

export default UserForm;
