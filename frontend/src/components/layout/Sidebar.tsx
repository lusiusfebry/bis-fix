import { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { usePermission } from '../../hooks/usePermission';
import { RESOURCES, ACTIONS } from '../../types/permission';

interface SidebarProps {
    collapsed: boolean;
}

interface NavItem {
    name: string;
    path?: string;
    icon: string;
    permission?: { resource: string; action: string };
    subItems?: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
    const [openMenus, setOpenMenus] = useState<string[]>(['Master Data', 'Manajemen Karyawan', 'Pengaturan']);
    const { can } = usePermission();

    const toggleMenu = (name: string) => {
        setOpenMenus(prev =>
            prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
        );
    };

    const navItems = useMemo(() => {
        const items: NavItem[] = [
            {
                name: 'Halaman Utama',
                path: '/welcome',
                icon: 'dashboard_customize',
            },
            {
                name: 'Dashboard',
                path: '/dashboard',
                icon: 'dashboard',
                permission: { resource: RESOURCES.DASHBOARD, action: ACTIONS.READ }
            },
            {
                name: 'Master Data',
                icon: 'database',
                // path: '/hr/master-data', // Main item might not have path if it has subitems in this design? Kept original.
                permission: { resource: RESOURCES.MASTER_DATA, action: ACTIONS.READ },
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
            {
                name: 'Manajemen Karyawan',
                icon: 'groups',
                permission: { resource: RESOURCES.EMPLOYEES, action: ACTIONS.READ },
                subItems: [
                    {
                        name: 'Karyawan',
                        path: '/hr/employees',
                        icon: 'person',
                        permission: { resource: RESOURCES.EMPLOYEES, action: ACTIONS.READ }
                    }
                ]
            },
            {
                name: 'Absensi & Cuti',
                path: '/hr/attendance',
                icon: 'calendar_month',
                // permission: { resource: 'attendance', action: 'read' } // TODO: Define attendance permissions
            },
            {
                name: 'Riwayat Aktivitas',
                path: '/hr/audit-logs',
                icon: 'history',
                permission: { resource: RESOURCES.AUDIT_LOGS, action: ACTIONS.READ }
            },
            {
                name: 'Pengaturan',
                icon: 'settings',
                // path: '/settings',
                subItems: [
                    {
                        name: 'Manajemen User',
                        path: '/settings/users',
                        icon: 'manage_accounts',
                        permission: { resource: RESOURCES.USERS, action: ACTIONS.READ }
                    },
                    {
                        name: 'Role & Akses',
                        path: '/settings/roles',
                        icon: 'admin_panel_settings',
                        permission: { resource: RESOURCES.ROLES, action: ACTIONS.READ }
                    }
                ]
            }
        ];

        // Filter items based on permissions
        return items.filter(item => {
            if (item.permission && !can(item.permission.resource, item.permission.action)) {
                return false;
            }

            // Filter subItems if they exist
            if (item.subItems) {
                const visibleSubItems = item.subItems.filter(sub => {
                    if (sub.permission) {
                        return can(sub.permission.resource, sub.permission.action);
                    }
                    return true;
                });

                if (visibleSubItems.length === 0) return false;

                // Mutation via filter return new object usually preferred, but for now reassignment to local copy or mutation
                item.subItems = visibleSubItems;
            }

            return true;
        });
    }, [can]);

    return (
        <aside className={clsx(
            "h-full border-r border-[#e7ebf3] bg-white dark:bg-[#161e2e] dark:border-[#2a3447] flex flex-col transition-all duration-300",
            collapsed ? "w-20" : "w-64"
        )}>
            <div className="p-6 flex flex-col gap-8 h-full">
                {/* Logo Section */}
                {!collapsed && (
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
                            <span className="material-symbols-outlined text-2xl">corporate_fare</span>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <h1 className="text-[#0d121b] dark:text-white text-base font-bold leading-none truncate">PSG HRMS</h1>
                            <p className="text-[#4c669a] text-xs font-normal mt-1 truncate">Enterprise System</p>
                        </div>
                    </div>
                )}
                {collapsed && (
                    <div className="flex justify-center">
                        <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
                            <span className="material-symbols-outlined text-2xl">corporate_fare</span>
                        </div>
                    </div>
                )}

                <nav className="flex flex-col gap-1 overflow-y-auto pr-1 custom-scrollbar">
                    {navItems.map((item) => (
                        <div key={item.name}>
                            {item.subItems && !collapsed ? (
                                <>
                                    <button
                                        onClick={() => toggleMenu(item.name)}
                                        className={clsx(
                                            'flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors text-gray-700 hover:bg-[#e7ebf3] dark:text-gray-200 dark:hover:bg-[#2a3447]',
                                            openMenus.includes(item.name) && 'bg-[#e7ebf3] dark:bg-[#2a3447]'
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
                                        <div className="mt-1 flex flex-col gap-1 pl-4 border-l-2 border-[#e7ebf3] dark:border-[#2a3447] ml-4">
                                            {item.subItems.map((sub) => (
                                                <NavLink
                                                    key={sub.name}
                                                    to={sub.path || '#'}
                                                    className={({ isActive }) =>
                                                        clsx(
                                                            'flex items-center gap-3 rounded-xl px-4 py-2.5 text-[13px] font-bold transition-all',
                                                            isActive
                                                                ? 'bg-primary/10 text-primary'
                                                                : 'text-[#4c669a] hover:bg-[#f6f6f8] dark:text-gray-400 dark:hover:bg-[#2a3447]'
                                                        )
                                                    }
                                                >
                                                    <span
                                                        className="material-symbols-outlined text-[20px] opacity-80"
                                                        style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}
                                                    >
                                                        {sub.icon}
                                                    </span>
                                                    {sub.name}
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <NavLink
                                    to={item.path || '#'}
                                    className={({ isActive }) =>
                                        clsx(
                                            'flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-bold transition-all',
                                            isActive
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-[#4c669a] hover:bg-[#f6f6f8] dark:text-gray-400 dark:hover:bg-[#2a3447]',
                                            collapsed && 'justify-center px-0'
                                        )
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <span
                                                className="material-symbols-outlined text-[22px]"
                                                style={{ fontVariationSettings: isActive ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 400" }}
                                            >
                                                {item.icon}
                                            </span>
                                            {!collapsed && item.name}
                                        </>
                                    )}
                                </NavLink>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
