'use client';
import { toast } from 'react-toastify';
import React, { Suspense, useState } from 'react';
import Loading from '@/components/common/Loading';
import Breadcrumb from '@/components/common/Breadcrumb';
import { IRoute } from '@/utils/interfaces/system';
import { IStream } from '@/utils/interfaces/stream';
import { ColumnDef } from '@tanstack/react-table';
import Table from '@/components/common/Table';
import EditIcon from '@/components/icons/EditIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import { formatDate } from '@/utils/formatDate';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useAppRouter } from '@/hooks/routes';

const htmlForDelete = 'delete-stream-modal';

export default function Page() {
  const { getEditStreamView, getCreateStreamView } = useAppRouter();
  const [deletingID, setDeletingID] = useState<IStream['id'] | null>(null);

  const routes: IRoute[] = [
    { title: 'Home', url: '/' },
    { title: 'Stream Management', url: '' },
  ];

  async function fetchData(options: { page: number; limit: number }): Promise<{
    data: IStream[];
    total: number;
  }> {
    const response = await fetch(
      `/api/v1/streams?page=${options.page}&limit=${options.limit}`,
      { method: 'GET' },
    );
    const { data, total } = await response.json();

    return { data, total };
  }

  const onDeleteSubmit = async () => {
    if (deletingID) {
      const res = await fetch(`/api/v1/streams/${deletingID}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        toast.error('Something went wrong, please try again later.');
      } else {
        toast.success('Stream deleted successfully.');

        // TODO: Reload data
      }
    }
  };

  const columns = React.useMemo<ColumnDef<IStream>[]>(
    () => [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'address', header: 'Address' },
      { accessorKey: 'status', header: 'Status' },
      {
        header: 'Created By',
        cell({ row: { original } }) {
          if (original.createdBy) {
            return `${original.createdBy.firstName} ${original.createdBy.lastName}`;
          }

          return null;
        },
      },
      {
        cell({ row: { original } }) {
          if (original.createdAt) {
            return formatDate(original.createdAt);
          }

          return null;
        },
        header: 'Created At',
      },
      {
        header: 'Actions',
        cell(props) {
          return (
            <div className="flex gap-2">
              <button
                className="btn btn-sm btn-outline"
                onClick={() => {
                  getEditStreamView(props.row.original.id);
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
    [getEditStreamView],
  );
  return (
    <Suspense fallback={<Loading />}>
      {
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Breadcrumb routes={routes} />
            <button
              className="btn btn-sm btn-primary"
              onClick={getCreateStreamView}
            >
              Create
            </button>
          </div>
          <Table columns={columns} fetchData={fetchData} />
        </div>
      }
      <ConfirmModal
        htmlFor={htmlForDelete}
        title={'Delete Stream'}
        content={'Are you sure you want to delete this stream?'}
        onClose={() => {
          setDeletingID(null);
        }}
        onSubmit={onDeleteSubmit}
      />
    </Suspense>
  );
}
