import React from 'react';
import { PencilSquareIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Button from '../common/Button';
import { MasterData } from '../../types/hr';

export interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface MasterDataTableProps<T extends MasterData> {
    columns: Column<T>[];
    data: T[];
    isLoading: boolean;
    pagination: {
        page: number;
        totalPages: number;
        total: number;
        onPageChange: (page: number) => void;
    };
    onEdit: (item: T) => void;
    onDelete: (item: T) => void;
}

const MasterDataTable = <T extends MasterData>({
    columns,
    data,
    isLoading,
    pagination,
    onEdit,
    onDelete
}: MasterDataTableProps<T>) => {
    if (isLoading) {
        return (
            <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="h-8 bg-gray-100 rounded mb-4 w-full"></div>
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-12 bg-gray-50 rounded mb-2 w-full"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500 font-medium">
                            {columns.map((col, i) => (
                                <th key={i} className={`px-6 py-4 ${col.className || ''}`}>
                                    {col.header}
                                </th>
                            ))}
                            <th className="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.length > 0 ? (
                            data.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className="px-6 py-4 text-sm text-gray-700">
                                            {typeof col.accessor === 'function' ? (
                                                col.accessor(item)
                                            ) : (
                                                col.accessor === 'status' ? (
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'Aktif'
                                                        ? 'bg-green-50 text-green-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                ) : (
                                                    (item[col.accessor] as React.ReactNode)
                                                )
                                            )}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="!p-1.5 h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-100"
                                                onClick={() => onEdit(item)}
                                                title="Edit"
                                            >
                                                <PencilSquareIcon className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="!p-1.5 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
                                                onClick={() => onDelete(item)}
                                                title="Hapus"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-400 text-sm">
                                    Tidak ada data ditemukan
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            {data.length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                    <div className="text-sm text-gray-500">
                        Menampilkan <span className="font-medium">{(pagination.page - 1) * 10 + 1}</span> sampai{' '}
                        <span className="font-medium">{Math.min(pagination.page * 10, pagination.total)}</span> dari{' '}
                        <span className="font-medium">{pagination.total}</span> data
                    </div>
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
                </div>
            )}
        </div>
    );
};

export default MasterDataTable;
