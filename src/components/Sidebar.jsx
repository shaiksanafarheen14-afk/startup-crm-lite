import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart2, LogOut } from 'lucide-react';
import DarkModeToggle from './common/DarkModeToggle';
import { useAuth } from '../context/AuthContext';
const Sidebar = () => {
  const { logout } = useAuth();
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/leads', label: 'Leads', icon: Users },
    { path: '/analytics', label: 'Analytics', icon: BarChart2 }
  ];

  return (
    <>
      {/* 
        Responsive Navigation Container
        - Mobile: Fixed Bottom Bar
        - Tablet (md): Collapsed Left Sidebar (Icons + tiny text)
        - Desktop (lg): Full Left Sidebar (Icons + full text)
      */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-row items-center justify-around h-16 px-4
 bg-surface/90 text-text shadow-nordic transition-colors duration-200 border-t border-border md:static md:flex-col md:h-screen md:w-24 md:p-4 md:border-t-0 md:border-r md:shadow-xl md:justify-start
 lg:w-64 lg:p-6">

        {/* Branding - Hidden on mobile (moved to Top Header), shown on md+ */}
        <div className="hidden md:flex flex-col items-center lg:items-start w-full mb-8 lg:mb-10">
          <h2 className="text-xl lg:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent to-success truncate w-full text-center lg:text-left">
            <span className="lg:hidden">CRM</span>
            <span className="hidden lg:inline">Startup CRM</span>
          </h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-row md:flex-col gap-1 w-full md:flex-1 justify-around md:justify-start">
          {navItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.path}
              className={({ isActive }) =>
                `flex flex-col lg:flex-row items-center justify-center lg:justify-start px-2 py-2 md:py-3 lg:px-4 rounded-xl font-medium transition-all duration-200 min-h-[44px] min-w-[44px] ${isActive
                  ? 'bg-primary text-background shadow-md'
                  : 'text-text-secondary  hover:bg-surface  hover:text-text '
                }`
              }
            >
              <item.icon size={22} className="lg:mr-3 mb-1 lg:mb-0" />
              {/* Text Label: Hidden on mobile, tiny on tablet, normal on desktop */}
              <span className="hidden md:block lg:inline text-[10px] lg:text-base text-center lg:text-left">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
        <button
          onClick={logout}
          className="flex flex-col lg:flex-row items-center justify-center lg:justify-start px-2 py-2 md:py-3 lg:px-4 rounded-xl font-medium text-error hover:bg-error/10 transition-all duration-200 min-h-[44px] min-w-[44px] w-full"
        >
          <LogOut size={22} className="lg:mr-3 mb-1 lg:mb-0" />
          <span className="hidden md:block lg:inline text-[10px] lg:text-base">
            Logout
          </span>
        </button>
        {/* Footer Area with Dark Mode Toggle - Hidden on mobile (moved to Top Header) */}
        <div className="hidden md:flex mt-auto pt-6 border-t border-border w-full flex-col lg:flex-row items-center justify-center lg:justify-between gap-3">
          <span className="hidden lg:inline text-sm font-medium text-text-secondary">Theme</span>
          <DarkModeToggle />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
