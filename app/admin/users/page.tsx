'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Breadcrumb from '@/components/common/Breadcrumb';
import { IRoute } from '@/utils/interfaces/system';
import { IUser, UpdateUserDto } from '@/utils/interfaces/user';
import Table from '@/components/common/Table';
import EditIcon from '@/components/icons/EditIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import { ColumnDef } from '@tanstack/react-table';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useAppRouter } from '@/hooks/routes';
import { StatusEnum, UserRole } from '@/utils/enums';
import { ENDPOINT_URL } from '@/constants';
import { Input } from '@/components/common/Input';
import Email from 'next-auth/providers/email';
import { emit } from 'process';
import { constant } from 'lodash';

const htmlForDelete = 'delete-user-modal';

interface UpdateUser {
  fullName: string;
  status: string;
  firstName:string;
  lastName:string;
  canStream:boolean;
}

export default function Page() {
  const { getEditUserView } = useAppRouter();
  const [deletingID, setDeletingID] = useState<IUser['id'] | null>(null);
  const [myArray, updateMyArray] = useState([]);
  
  const [filteredArray, setFilteredArray] = useState<IUser[]>([]);
  
  const [searchValue, searchFilteredArray] = useState<string>();

  const routes: IRoute[] = [
    { title: 'Home', url: '/' },
    { title: 'User Management', url: '' },
  ];

  const [updateData, setFormData] = useState<UpdateUser>({
    fullName: '',
    status: '',
    firstName:'',
    lastName:'',
    canStream:false,
  });

   async function fetchData(options: { page: number; limit: number }): Promise<{
     data: IUser[];
     total: number;
   }> {
     
     
     let searchEmail = localStorage.getItem("emailSearch") != null ? localStorage.getItem("emailSearch") :"";
     const user: string = document.querySelector<HTMLInputElement>('input[name="email"]').value;
     
     document.querySelector<HTMLInputElement>('input[name="email"]').value = searchEmail;


     let response:any = null;
     if(searchEmail.length > 0 )
      {
        let response = await fetch(
          `/api/v1/users?page=${options.page}&limit=${options.limit}&search=${searchEmail}`,
          { method: 'GET' },
        );
        const { data, total } = await response.json();
        return{data,total};
        
        
      }
      else
      {
        let response = await fetch(
          `/api/v1/users?page=${options.page}&limit=${options.limit}`,
          { method: 'GET' },
        );
        
        const { data, total } = await response.json();
        return{data,total};
     
      }

      const { data, total } = response;
        
      return{data,total};
  
     
   } 

  
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;  

  if(value.length > 0 )
    {
     localStorage.setItem("emailSearch",value);      
    }
    else
    {
      localStorage.setItem("emailSearch","");
    }
    location.reload();
  };

  const onDeleteSubmit = async () => {
    if (deletingID) {
      const res = await fetch(`/api/v1/users/${deletingID}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        toast.error('Something went wrong, please try again later.');
      } else {
        toast.success('User deleted successfully.');

        // TODO: Reload data
      }
    }
  };

  

  const columns = React.useMemo<ColumnDef<IUser>[]>(
    () => [
      { accessorKey: 'firstName', header: 'First Name' },
      { accessorKey: 'lastName', header: 'Last Name' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'status', header: 'Status' },
      {
        header: 'Can Stream',
        cell(props) {
          return (
            <input
              type="checkbox"
              checked={props.row.original.role == UserRole.Streamer}
              className="checkbox"
              onClick={() => {
                return false
              }}
            />
          );
        },
      },
      {
        header: 'Active/InActive',
        cell(props) {
          function onSetStatus(id: string, fullName: string, status : StatusEnum,
            firstName:string,lastName:string,canStream:UserRole
          ) {

           let newStatus = StatusEnum.Active;

           if(status == StatusEnum.Active)
            {
              newStatus = StatusEnum.Inactive;
            }
            else
            {
              newStatus = StatusEnum.Active;
            }
            const result = confirm('Are you sure you want to change status to ' + newStatus +' ?');
            if (result) {
              updateData.firstName = firstName;
              updateData.lastName = lastName;
              updateData.fullName = fullName;
              updateData.status = newStatus;
              updateData.canStream = false;

              if(canStream == UserRole.Streamer)
                {
                  updateData.canStream = true;
                }
              const response = fetch('/api/v1/users/'+id+'', {
                  method: 'PATCH',
                  body: JSON.stringify(updateData),
                }); 
                location.reload();
            } 
          }

          return (
            <input
              type="checkbox"
              checked={props.row.original.status ==StatusEnum.Active}
              className="checkbox"
              onChange={() => {
                onSetStatus(props.row.original.id,props.row.original.fullName,props.row.original.status,
                  props.row.original.fullName,props.row.original.fullName,props.row.original.role   

                 );
              }}
            />
          );
        },
      },
      {
        header: 'Actions',
        cell(props) {
          return (
            <div className="flex gap-2">
              <button
                className="btn btn-sm btn-outline"
                onClick={() => {
                  getEditUserView(props.row.original.id);
                }}
              >
                <EditIcon />
              </button>
              <label
                className="btn btn-sm btn-outline btn-error"
                htmlFor={htmlForDelete}
                onClick={() => {
                  setDeletingID(props.row.original.id);
                }}
              >
                <DeleteIcon />
              </label>
            </div>
          );
        },
      },
    ],
    [getEditUserView],
  );

  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Breadcrumb routes={routes} />
           <div className="flex gap-4">
           <Input          
              name="email"
              label="Search By Email"
              type="email"
              onChange={handleInputChange}
            />
            </div> 

          <Link
            type="button"
            className="btn btn-sm btn-primary"
            href={'/admin/users/create'}
          >
            Create
          </Link>
        </div>
        <Table  columns={columns} fetchData={fetchData} />
      </div>
      <ConfirmModal
        htmlFor={htmlForDelete}
        title={'Delete User'}
        content={'Are you sure you want to delete this user?'}
        onClose={() => {
          setDeletingID(null);
        }}
        onSubmit={onDeleteSubmit}
      />
    </>
  );
}
