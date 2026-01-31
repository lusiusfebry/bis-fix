import React from 'react';
import { PencilSquareIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Button from '../common/Button';
import { PermissionGuard } from '../auth/PermissionGuard';
import { RESOURCES, ACTIONS } from '../../types/permission';
import { LayoutView, LAYOUT_CONFIGS } from '../../types/layout';

export interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface MasterDataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    isLoading?: boolean;
    pagination?: {
        page: number;
        totalPages: number;
        totalItems: number;
        onPageChange: (page: number) => void;
    };
    onEdit: (item: T) => void;
    onDelete: (item: T) => void;
    view?: LayoutView; // Changed from layout string
}

const MasterDataTable = <T extends { id: number | string; status?: string }>({
    columns,
    data,
    isLoading,
    pagination,
    onEdit,
    onDelete,
    view = LayoutView.VIEW_1
}: MasterDataTableProps<T>) => {

    const config = LAYOUT_CONFIGS[view];
    const isGrid = config.mode === 'grid';
    const isCompact = config.tableDensity === 'compact';
    const showBorders = config.showBorders;

    if (isLoading) {
        return (
            <div className={`w-full ${isGrid ? 'grid grid-cols-1 md:grid-cols-3 gap-4' : 'bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse'}`}>
                {/* Skeleton logic */}
                {isGrid
                    ? [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>)
                    : (
                        <>
                            <div className="h-8 bg-gray-100 rounded mb-4 w-full"></div>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-12 bg-gray-50 rounded mb-2 w-full"></div>
                            ))}
                        </>
                    )
                }
            </div>
        );
    }

    if (isGrid) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.length > 0 ? (
                    data.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between group">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1" title={(item as any).nama}>{(item as any).nama || (item as any).name || 'Unnamed'}</h3>
                                    {/* Status Badge */}
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.status === 'Aktif' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm text-gray-500 mb-4">
                                    {columns.slice(0, 3).map((col, i) => { // Show first few cols
                                        if (col.accessor === 'id') return null; // Skip ID
                                        return (
                                            <div key={i} className="flex justify-between border-b border-gray-50 pb-1 last:border-0">
                                                <span className="text-gray-400">{col.header}:</span>
                                                <span className="font-medium text-gray-700 text-right">
                                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                    {typeof col.accessor === 'function' ? col.accessor(item) : (item[col.accessor] as any)}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                                <PermissionGuard resource={RESOURCES.MASTER_DATA} action={ACTIONS.UPDATE}>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="!p-1.5 text-blue-600 hover:bg-blue-50 border-blue-100"
                                        onClick={() => onEdit(item)}
                                    >
                                        <PencilSquareIcon className="w-4 h-4" />
                                    </Button>
                                </PermissionGuard>
                                <PermissionGuard resource={RESOURCES.MASTER_DATA} action={ACTIONS.DELETE}>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="!p-1.5 text-red-600 hover:bg-red-50 border-red-100"
                                        onClick={() => onDelete(item)}
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </Button>
                                </PermissionGuard>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
                        Tidak ada data ditemukan
                    </div>
                )}
            </div>
        );
    }

    // List View with Density adjustments
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${showBorders ? 'border-2' : ''}`}>
            <div className="overflow-x-auto">
                <table className="min-w-full whitespace-nowrap text-left text-sm">
                    <thead className="bg-gray-50 text-gray-900 font-semibold">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} scope="col" className={`px-6 ${isCompact ? 'py-2' : 'py-4'} ${showBorders ? 'border-r border-gray-200' : ''}`}>
                                    {col.header}
                                </th>
                            ))}
                            <th scope="col" className={`px-6 ${isCompact ? 'py-2' : 'py-4'} text-right`}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.length > 0 ? (
                            data.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                                    {columns.map((col, colIdx) => (
                                        <td key={colIdx} className={`px-6 ${isCompact ? 'py-2' : 'py-4'} text-gray-700 ${showBorders ? 'border-r border-gray-100' : ''}`}>
                                            {typeof col.accessor === 'function'
                                                ? col.accessor(item)
                                                : (item[col.accessor] as React.ReactNode)}
                                        </td>
                                    ))}
                                    <td className={`px-6 ${isCompact ? 'py-2' : 'py-4'} text-right`}>
                                        <div className="flex items-center justify-end gap-2">
                                            <PermissionGuard resource={RESOURCES.MASTER_DATA} action={ACTIONS.UPDATE}>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className={`!p-1.5 text-blue-600 hover:bg-blue-50 border-blue-100 ${isCompact ? 'h-7 w-7' : ''}`}
                                                    onClick={() => onEdit(item)}
                                                >
                                                    <PencilSquareIcon className="w-4 h-4" />
                                                </Button>
                                            </PermissionGuard>
                                            <PermissionGuard resource={RESOURCES.MASTER_DATA} action={ACTIONS.DELETE}>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className={`!p-1.5 text-red-600 hover:bg-red-50 border-red-100 ${isCompact ? 'h-7 w-7' : ''}`}
                                                    onClick={() => onDelete(item)}
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </Button>
                                            </PermissionGuard>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-500">
                                    Tidak ada data untuk ditampilkan
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && (
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={pagination.page === 1}
                        onClick={() => pagination.onPageChange(pagination.page - 1)}
                        className="!px-3"
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                    </Button>
                    <span className="flex items-center px-3 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200">
                        Halaman {pagination.page}
                    </span>
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={pagination.page >= pagination.totalPages}
                        onClick={() => pagination.onPageChange(pagination.page + 1)}
                        className="!px-3"
                    >
                        <ChevronRightIcon className="w-4 h-4" />
                    </Button>
                </div>
            )}

        </div >
    );
};

export default MasterDataTable;
