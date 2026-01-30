
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <Sidebar />
            <main className="px-4 py-8 md:pl-72 md:pr-8">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
