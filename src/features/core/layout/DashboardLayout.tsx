import { Outlet } from 'react-router-dom';
import { SidebarMenuItem, UserName } from '../../../ui/components/index';
import { menuRoutes } from '../../../router/AppRouter';

import { MenuRoute } from '../../../interfaces';
import { useState } from 'react';


export const DashboardLayout = () => {
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleCollapseAll = () => {
        setExpandedItems([]);
        setIsCollapsed(!isCollapsed);
    };

    return (
        <main className="flex h-screen">
          <nav className={`${isCollapsed ? 'w-16' : 'w-64'} bg-zinc-100 flex flex-col transition-all duration-300`}>
            <div className="flex items-center justify-between p-4 border-b border-zinc-200">
              <h1 className={`text-xl text-zinc-800 bg-gradient-to-r from-zinc-800 to-zinc-600 text-transparent bg-clip-text ${isCollapsed ? 'text-center w-full' : ''}`}>
                {isCollapsed ? 'VA' : 'Vicentina - Agro'}
              </h1>
              {!isCollapsed && (
                <button
                  onClick={handleCollapseAll}
                  className="p-2 hover:bg-zinc-200 text-zinc-400 rounded-full transition-colors"
                  title="Colapsar menú"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
              )}
            </div>

            {isCollapsed && (
              <button
                onClick={handleCollapseAll}
                className="p-2 hover:bg-zinc-200 text-zinc-400 border-b border-zinc-200 flex items-center justify-center"
                title="Expandir menú"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            )}

            <div className="flex-1 overflow-y-auto">
              <div className="space-y-1">
                {menuRoutes.filter(route => route.visible).map((option: MenuRoute) => (
                  <SidebarMenuItem 
                    key={option.to} 
                    to={option.to}
                    icon={option.icon}
                    title={option.title}
                    subMenu={option.subMenu}
                    isExpanded={expandedItems.includes(option.to)}
                    onToggle={(isExpanded) => {
                      setExpandedItems(prev => 
                        isExpanded 
                          ? [...prev, option.to]
                          : prev.filter(item => item !== option.to)
                      );
                    }}
                    isCollapsed={isCollapsed}
                  />
                ))}
              </div>
            </div>

            <UserName name={localStorage.getItem('displayName') || ''} isCollapsed={isCollapsed} />
          </nav>

          <section className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </section>
        </main>
    );
};