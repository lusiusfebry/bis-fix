import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
    collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
    const [openMenus, setOpenMenus] = useState<string[]>(['Master Data']);

    const toggleMenu = (name: string) => {
        setOpenMenus(prev =>
            prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
        );
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
        { name: 'Manajemen Karyawan', path: '/hr/employees', icon: 'groups' },
        {
            name: 'Master Data',
            icon: 'database',
            path: '/hr/master-data',
            subItems: [
                { name: 'Divisi', path: '/hr/master-data/divisi', icon: 'domain' },
                { name: 'Departemen', path: '/hr/master-data/department', icon: 'groups' },
                { name: 'Posisi Jabatan', path: '/hr/master-data/posisi-jabatan', icon: 'badge' },
                { name: 'Kategori Pangkat', path: '/hr/master-data/kategori-pangkat', icon: 'military_tech' },
                { name: 'Golongan', path: '/hr/master-data/golongan', icon: 'stars' },
                { name: 'Sub Golongan', path: '/hr/master-data/sub-golongan', icon: 'hotel_class' },
                { name: 'Jenis Hubungan', path: '/hr/master-data/jenis-hubungan-kerja', icon: 'handshake' },
                { name: 'Tag', path: '/hr/master-data/tag', icon: 'label' },
                { name: 'Lokasi Kerja', path: '/hr/master-data/lokasi-kerja', icon: 'location_on' },
                { name: 'Status Karyawan', path: '/hr/master-data/status-karyawan', icon: 'verified_user' },
            ]
        },
        { name: 'Absensi & Cuti', path: '/hr/attendance', icon: 'calendar_month' },
        { name: 'Riwayat Aktivitas', path: '/hr/audit-logs', icon: 'history' },
    ];

    return (
        <aside className={clsx(
            "fixed left-0 top-16 z-20 hidden h-[calc(100vh-4rem)] border-r border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 md:block overflow-y-auto transition-all duration-300",
            collapsed ? "w-20" : "w-64"
        )}>
            <nav className="flex flex-col gap-2 p-4">
                {navItems.map((item) => (
                    <div key={item.name}>
                        {item.subItems && !collapsed ? (
                            <>
                                <button
                                    onClick={() => toggleMenu(item.name)}
                                    className={clsx(
                                        'flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700',
                                        openMenus.includes(item.name) && 'bg-gray-50 dark:bg-gray-700/50'
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                                        {item.name}
                                    </div>
                                    {openMenus.includes(item.name) ? (
                                        <ChevronUpIcon className="h-4 w-4" />
                                    ) : (
                                        <ChevronDownIcon className="h-4 w-4" />
                                    )}
                                </button>
                                {openMenus.includes(item.name) && (
                                    <div className="mt-1 flex flex-col gap-1 pl-4 border-l-2 border-gray-100 ml-4">
                                        {item.subItems.map((sub) => (
                                            <NavLink
                                                key={sub.name}
                                                to={sub.path}
                                                className={({ isActive }) =>
                                                    clsx(
                                                        'flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                                                        isActive
                                                            ? 'bg-primary/10 text-primary'
                                                            : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                                                    )
                                                }
                                            >
                                                <span className="material-symbols-outlined text-[18px] opacity-70">{sub.icon}</span>
                                                {sub.name}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    clsx(
                                        'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700',
                                        collapsed && 'justify-center px-0'
                                    )
                                }
                            >
                                <span className="material-symbols-outlined text-[20px] shrink-0">{item.icon}</span>
                                {!collapsed && item.name}
                            </NavLink>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
