import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { LayoutProvider, useLayout } from '../../context/LayoutContext';

const MainLayoutContent = () => {
    const { sidebarCollapsed } = useLayout();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className={`fixed top-0 left-0 h-full z-30 transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-72'}`}>
                <Sidebar collapsed={sidebarCollapsed} />
            </div>

            <div className={`flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'pl-20' : 'pl-72'}`}>
                {/* Header usually needs to span full width or offset? 
                    In original specific design `layout_sistem...code.html`:
                    Header is flex-1 (inside main wrapper).
                    
                    Here, Header is imported. Let's assume Header logic.
                    If Header is fixed, it needs adjustment. If Header is static, it flows.
                    Original MainLayout had <Header /> then <Sidebar /> then <main>.
                    
                    Let's stick to original structure but dynamic padding.
                */}
                <Header />
                <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

const MainLayout = () => {
    return (
        <LayoutProvider>
            <MainLayoutContent />
        </LayoutProvider>
    );
};

export default MainLayout;
