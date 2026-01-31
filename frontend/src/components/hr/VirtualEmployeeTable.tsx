import React from 'react';
import * as ReactWindow from 'react-window';
import * as InfiniteLoaderLib from 'react-window-infinite-loader';
import * as AutoSizerLib from 'react-virtualized-auto-sizer';

// Defensive import to handle ESM/CJS interop issues in Rollup
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const List = (ReactWindow as any).FixedSizeList || (ReactWindow as any).default?.FixedSizeList || ReactWindow;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InfiniteLoader = (InfiniteLoaderLib as any).InfiniteLoader || (InfiniteLoaderLib as any).default || InfiniteLoaderLib;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AutoSizer = (AutoSizerLib as any).AutoSizer || (AutoSizerLib as any).default || AutoSizerLib;

interface VirtualEmployeeTableProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    employees: any[];
    hasNextPage: boolean;
    isNextPageLoading: boolean;
    loadNextPage: () => Promise<void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onRowClick: (employee: any) => void;
    onDelete?: (id: number) => void;
}

const VirtualEmployeeTable: React.FC<VirtualEmployeeTableProps> = ({
    employees,
    hasNextPage,
    isNextPageLoading,
    loadNextPage,
    onRowClick,
    onDelete,
}) => {
    // If hasNextPage, add 1 for "Loading..." row
    const itemCount = hasNextPage ? employees.length + 1 : employees.length;
    const isItemLoaded = (index: number) => !hasNextPage || index < employees.length;

    const loadMoreItems = isNextPageLoading ? () => Promise.resolve() : loadNextPage;

    const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
        if (!isItemLoaded(index)) {
            return (
                <div style={style} className="flex items-center justify-center p-4 text-gray-500 border-b border-gray-100 dark:border-slate-700">
                    Loading more...
                </div>
            );
        }

        const employee = employees[index];
        // Safety check
        if (!employee) return null;

        return (
            <div
                style={style}
                className="flex items-center px-6 py-4 border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                onClick={() => onRowClick(employee)}
            >
                <div className="flex items-center gap-3 flex-[2] min-w-0">
                    <img
                        src={employee.foto_karyawan ? `http://localhost:3000${employee.foto_karyawan}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.nama_lengkap)}&background=random`}
                        alt={employee.nama_lengkap}
                        className="h-10 w-10 rounded-full object-cover border border-gray-200"
                        loading="lazy"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.nama_lengkap)}&background=random`;
                        }}
                    />
                    <div className="truncate">
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{employee.nama_lengkap}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{employee.nomor_induk_karyawan}</div>
                    </div>
                </div>
                <div className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate px-2">{employee.posisi_jabatan?.nama || '-'}</div>
                <div className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate px-2">{employee.department?.nama || '-'}</div>
                <div className="w-20 flex justify-end">
                    {onDelete && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(employee.id);
                            }}
                            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                            title="Hapus Karyawan"
                        >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700 h-[600px] flex flex-col">
            {/* Header */}
            <div className="flex px-6 py-3 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 rounded-t-lg font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex-[2]">Nama / NIK</div>
                <div className="flex-1 px-2">Posisi</div>
                <div className="flex-1 px-2">Department</div>
                <div className="w-20 text-right">Aksi</div>
            </div>

            <div className="flex-grow">
                <AutoSizer>
                    {({ height, width }: { height: number; width: number }) => (
                        <InfiniteLoader
                            isItemLoaded={isItemLoaded}
                            itemCount={itemCount}
                            loadMoreItems={loadMoreItems}
                            threshold={5}
                        >
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {({ onItemsRendered, ref }: { onItemsRendered: any; ref: any }) => (
                                <List
                                    className="custom-scrollbar"
                                    height={height}
                                    itemCount={itemCount}
                                    itemSize={80}
                                    onItemsRendered={onItemsRendered}
                                    ref={ref}
                                    width={width}
                                >
                                    {Row}
                                </List>
                            )}
                        </InfiniteLoader>
                    )}
                </AutoSizer>
            </div>
        </div>
    );
};

export default VirtualEmployeeTable;
