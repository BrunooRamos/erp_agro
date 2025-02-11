import { Outlet } from 'react-router-dom';
import { SidebarMenuItem, UserName } from '../../../ui/components/index';
import { menuRoutes } from '../../../router/AppRouter';

import { MenuRoute } from '../../../interfaces';


export const DashboardLayout = () => {
    return (
        <main className="flex h-screen">
        <nav className="w-64 bg-zinc-100 flex flex-col justify-between">
          <div>
            <h1 className="text-xl text-zinc-800 p-4 mb-4 border-b border-zinc-200 bg-gradient-to-r from-zinc-800 to-zinc-600 text-transparent bg-clip-text">
              Vicentina - Agro
            </h1>
  
            <div className="space-y-1">
              {menuRoutes.filter(route => route.visible).map((option: MenuRoute) => (
                <SidebarMenuItem 
                  key={option.to} 
                  to={option.to}
                  icon={option.icon}
                  title={option.title}
                  subMenu={option.subMenu}
                />
              ))}
            </div>
          </div>
  
          <UserName name={ localStorage.getItem('displayName') || '' } />
        </nav>
  
        <section className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </section>
      </main>
    )
}