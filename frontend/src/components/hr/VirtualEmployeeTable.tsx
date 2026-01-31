import React, { useRef, useCallback } from 'react';

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
    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback((node: HTMLDivElement) => {
        if (isNextPageLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                loadNextPage();
            }
        });
        if (node) observer.current.observe(node);
    }, [isNextPageLoading, hasNextPage, loadNextPage]);

    return (
        <div className="w-full bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700 h-full overflow-auto custom-scrollbar" style={{ height: '600px' }}>
            {/* Header */}
            <div className="flex px-6 py-3 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 rounded-t-lg font-medium text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky top-0 z-10">
                <div className="flex-1">Nama / NIK</div>
                <div className="flex-1">Posisi</div>
                <div className="flex-1">Department</div>
                <div className="w-20 text-right">Aksi</div>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-slate-700">
                {employees.map((employee, index) => (
                    <div
                        key={employee.id}
                        ref={employees.length === index + 1 ? lastElementRef : null}
                        className="flex items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer"
                        onClick={() => onRowClick(employee)}
                    >
                        <div className="flex items-center gap-3 flex-1">
                            <img
                                src={employee.foto_karyawan || '/default-avatar.png'}
                                alt={employee.nama_lengkap}
                                className="h-10 w-10 rounded-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/default-avatar.png';
                                }}
                            />
                            <div>
                                <div className="font-medium text-gray-900 dark:text-gray-100">{employee.nama_lengkap}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{employee.nomor_induk_karyawan}</div>
                            </div>
                        </div>
                        <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">{employee.posisi_jabatan?.nama || '-'}</div>
                        <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">{employee.department?.nama || '-'}</div>
                        <div className="w-20 flex justify-end">
                            {onDelete && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(employee.id);
                                    }}
                                    className="text-red-600 hover:text-red-800 p-2"
                                >
                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {isNextPageLoading && (
                <div className="p-4 text-center text-gray-500">Loading more...</div>
            )}
        </div>
    );
};

export default VirtualEmployeeTable;
