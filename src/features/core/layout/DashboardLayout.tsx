import { Outlet } from 'react-router-dom';
import { SidebarMenuItem, UserName } from '../../../ui/components/index';
import { menuRoutes } from '../../../router/AppRouter';

import { MenuRoute } from '../../../interfaces';
import { useState } from 'react';


export const DashboardLayout = () => {
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const handleCollapseAll = () => {
        setExpandedItems([]);
    };

    return (
        <main className="flex h-screen">
          <nav className="w-64 bg-zinc-100 flex flex-col">
            <h1 className="text-xl text-zinc-800 p-4 border-b border-zinc-200 bg-gradient-to-r from-zinc-800 to-zinc-600 text-transparent bg-clip-text">
              Vicentina - Agro
            </h1>

            <button
              onClick={handleCollapseAll}
              className="flex items-center justify-center p-2 hover:bg-zinc-200 text-zinc-400 border-b border-zinc-200"
            >
              <i className="fas fa-compress-arrows-alt mr-2"></i>
              Colapsar todo
            </button>

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
                  />
                ))}
              </div>
            </div>

            <UserName name={localStorage.getItem('displayName') || ''} />
          </nav>

          <section className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </section>
        </main>
    );
};