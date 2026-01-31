import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Button from '../common/Button';

interface Activity {
    nama_lengkap: string;
    foto_karyawan?: string;
    department_name: string;
    status: string;
    createdAt: string;
}

interface RecentActivitiesTableProps {
    activities: Activity[];
}

const RecentActivitiesTable: React.FC<RecentActivitiesTableProps> = ({ activities }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Aktivitas Terbaru</h3>
                <Button variant="ghost" size="sm" className="text-primary">Lihat Semua</Button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-slate-900/50">
                        <tr>
                            <th className="px-6 py-3">Karyawan</th>
                            <th className="px-6 py-3">Departemen</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Tanggal</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                        {activities.map((activity, index) => (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                                        {activity.foto_karyawan ? (
                                            <img src={activity.foto_karyawan} alt={activity.nama_lengkap} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-xs font-bold text-gray-500">{activity.nama_lengkap.charAt(0)}</span>
                                        )}
                                    </div>
                                    {activity.nama_lengkap}
                                </td>
                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                    {activity.department_name}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${activity.status === 'Aktif' || activity.status === 'Tetap' ? 'bg-green-100 text-green-800' :
                                            activity.status === 'Kontrak' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {activity.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                    {format(new Date(activity.createdAt), 'dd MMM yyyy', { locale: id })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentActivitiesTable;
