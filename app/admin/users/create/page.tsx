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
      let newUserId:any = '';      
    
      const response = await fetch('/api/v1/users', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        return setErrors(await response.json());
      }
      else
      { 
      //Fetch recently added userid
      const jsonData = await response.json();
      newUserId =  jsonData.id;      

      if(formData.canStream 
        && newUserId != ''
        && formData.email != null && formData.email?.indexOf("@streamer.com") > 0)
        {
          
          var viewerName = formData.email.split('@')[0];          
          var viewerFormData = formData;
          viewerFormData.canStream = false;
          viewerFormData.email = viewerName+"@viewer.com";

          const viewerResponse = await fetch('/api/v1/users', {
            method: 'POST',
            body: JSON.stringify(viewerFormData),
          });

          if (!viewerResponse.ok) {
            toast.error('Something went wrong, while creating viewer automatically, pls try again in edit mode.');
          }
          else
          {
            //Fetch recently added viewer userid
            const  viewerData = await viewerResponse.json();
            let viewerId : string =  viewerData.id;

            //Grand access to viewer to recently created streamer
            const records = [{ user: { id: viewerId } }]            
            const accessResponse = await fetch(`/api/v1/streams/streamer/${newUserId}/access`, {
              method: 'POST',
              body: JSON.stringify({ records }),
            });  
            
            if (!accessResponse.ok) {
              toast.error('Something went wrong, while giving access, pls try again int edit mode.');
            } 
          }

        }

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
