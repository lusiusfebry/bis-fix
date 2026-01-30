
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const Sidebar = () => {
    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
        { name: 'HR', path: '/hr', icon: 'groups' },
    ];

    return (
        <aside className="fixed left-0 top-16 z-20 hidden h-[calc(100vh-4rem)] w-64 border-r border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 md:block">
            <nav className="flex flex-col gap-2 p-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            clsx(
                                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                            )
                        }
                    >
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                        {item.name}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
