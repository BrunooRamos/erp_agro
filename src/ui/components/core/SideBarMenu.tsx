import { NavLink } from "react-router-dom";
import { useState } from "react";

interface Props {
  to: string;
  icon: string;
  title: string;
  subMenu?: {
    to: string;
    title: string;
    visible: boolean;
  }[];
}

export const SidebarMenuItem = ({
  to, icon, title, subMenu
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <NavLink
        to={to}
        className={({ isActive }) => {
          const baseClasses = "flex items-center gap-4 px-2 py-2 relative hover:bg-zinc-200";
          const activeClasses = isActive ? " border-l-4 border-black" : "";
          return baseClasses + activeClasses;
        }}
        onClick={() => subMenu && setIsExpanded(!isExpanded)}
      >
        {({ isActive }) => (
          <>
            <i className={`${icon} text-md ${isActive ? 'text-zinc-900' : 'text-zinc-400'}`}></i>
            <div className="flex items-center justify-between flex-1">
              <h3 className={`${isActive ? 'text-zinc-900' : 'text-zinc-400'}`}>{title}</h3>
              {subMenu && (
                <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'} text-zinc-400`}></i>
              )}
            </div>
          </>
        )}
      </NavLink>

      {subMenu && isExpanded && (
        <div className="ml-6">
          {subMenu.filter(item => item.visible).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center gap-4 px-2 py-2 relative hover:bg-zinc-200
                ${isActive ? 'text-zinc-900' : 'text-zinc-400'}
              `}
            >
              {item.title}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};
