import React, { ReactNode, useEffect } from 'react';
import { useLayout } from '../../context/LayoutContext';
import { LayoutView, LAYOUT_CONFIGS } from '../../types/layout';

interface MasterDataLayoutProps {
    children: ReactNode;
    view: LayoutView;
}

const MasterDataLayout: React.FC<MasterDataLayoutProps> = ({ children, view }) => {
    const { setSidebarCollapsed } = useLayout();
    const config = LAYOUT_CONFIGS[view];

    useEffect(() => {
        if (config.sidebar === 'collapsed') {
            setSidebarCollapsed(true);
        } else if (config.sidebar === 'expanded') {
            setSidebarCollapsed(false);
        }
        // Handle 'hidden' if needed, but Context might need 'hidden' state too. 
        // For now, let's treat hidden as collapsed or handled via CSS? 
        // LayoutContext boolean is simple. Let's start with collapsed/expanded.
    }, [view, config.sidebar, setSidebarCollapsed]);

    return (
        <>
            {children}
        </>
    );
};

export default MasterDataLayout;
