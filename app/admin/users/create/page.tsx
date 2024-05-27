'use client';
import Breadcrumb from '@/components/common/Breadcrumb';
import { Checkbox } from '@/components/common/Checkbox';
import { Input } from '@/components/common/Input';
import Loading from '@/components/common/Loading';
import { useAppRouter } from '@/hooks/routes';
import { IRoute } from '@/utils/interfaces/system';
import { FormEvent, Suspense, useState } from 'react';
import { toast } from 'react-toastify';

interface UserForm {
  firstName?: string;
  lastName?: string;
  password?: string;
  confirmPassword?: string;
  email?: string;
  canStream?: boolean;
}

const CreateUserPage = () => {
  const { onBack } = useAppRouter();

  const routes: IRoute[] = [
    { title: 'Home', url: '/' },
    { title: 'User Management', url: '/admin/users' },
    { title: 'Create New User', url: '' },
  ];

  const [formData, setFormData] = useState<UserForm>({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    email: '',
    canStream: false,
  });

  const [errors, setErrors] = useState<UserForm>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/v1/users', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        return setErrors(await response.json());
      }
      setFormData({
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        email: '',
        canStream: false,
      });
      toast.success('Create new user successfully');
    } catch (error: any) {
      setErrors(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Suspense fallback={<Loading />}>
      {
        <div className="p-4">
          <Breadcrumb routes={routes} />
          <h3 className="py-4 font-bold text-lg">Create new user</h3>
          <form onSubmit={onSubmit} className="form w-full">
            <Input
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors['email']}
            />

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
            <div className="flex gap-4">
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
            </div>

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
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      }
    </Suspense>
  );
};

export default CreateUserPage;
