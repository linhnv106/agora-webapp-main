import React, { FC, HTMLProps, useEffect, useMemo, useState } from 'react';

import {
  PaginationState,
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import Loading from './Loading';

interface Props<T extends Object> {
  columns: ColumnDef<T>[];
  fetchData: (options: {
    page: number;
    limit: number;
  }) => Promise<{ data: T[]; total: number }>;
  enableRowSelection?: boolean;
}

const Table: FC<Props<any>> = ({ columns, enableRowSelection, fetchData }) => {
  const [rowSelection, onRowSelectionChange] = React.useState({});
  const [{ pageIndex, pageSize }, onPaginationChange] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

  const fetchDataOptions = { pageIndex, pageSize };

  const dataQuery = useQuery(
    ['data', fetchDataOptions],
    () =>
      fetchData({
        page: fetchDataOptions.pageIndex,
        limit: fetchDataOptions.pageSize,
      }),
    { keepPreviousData: true },
  );

  const data = useMemo(
    () => dataQuery.data?.data ?? [],
    [dataQuery.data?.data],
  );

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const pageCount = useMemo(() => {
    if (dataQuery.data?.total === undefined) {
      return -1;
    }

    return Math.ceil(dataQuery.data?.total / pageSize);
  }, [dataQuery.data?.total, pageSize]);

  const renderColumns = useMemo(() => {
    if (!enableRowSelection) {
      return columns;
    }

    return [
      {
        id: 'select',
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },

      ...columns,
    ];
  }, [enableRowSelection, columns]);

  const table = useReactTable({
    data,
    pageCount,
    enableRowSelection,
    columns: renderColumns,
    state: { pagination, rowSelection },
    manualPagination: true,
    onPaginationChange,
    onRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    onRowSelectionChange((preState) => {
      return {
        ...preState,
        23: true,
      };
    });
  }, []);

  return (
    <div className="p-2">
      <div className="overflow-x-auto" />
      <table className="table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="flex items-center justify-end gap-2">
        <div className="join">
          <button
            className="join-item btn btn-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            «
          </button>
          <button className="join-item btn btn-sm">
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </button>
          <button
            className="join-item btn btn-sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            »
          </button>
        </div>

        <select
          className="select select-bordered select-sm"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

function IndeterminateCheckbox({
  indeterminate,
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);
  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [indeterminate, rest.checked]);
  return <input type="checkbox" ref={ref} className="checkbox" {...rest} />;
}

export default Table;
