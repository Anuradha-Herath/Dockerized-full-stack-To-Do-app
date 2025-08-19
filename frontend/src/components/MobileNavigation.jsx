import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const MobileNavigation = ({ isDark }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/profile' },
    { icon: LogOut, label: 'Logout', action: logout }
  ];

  const handleNavClick = (item) => {
    if (item.action) {
      item.action();
    } else {
      navigate(item.path);
    }
  };

  return (
    <nav className={`fixed bottom-0 left-0 right-0 ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-surface border-gray-200'
    } border-t md:hidden z-50 transition-colors duration-300`}>
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.path && location.pathname === item.path;
          
          return (
            <button
              key={index}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center justify-center transition-all duration-200 ${
                isActive
                  ? 'text-primary-600'
                  : isDark
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-500 hover:text-gray-700'
              } ${isActive ? 'bg-opacity-10 bg-primary-600' : ''}`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'mb-1' : 'mb-1'}`} />
              <span className={`text-xs ${isActive ? 'font-medium' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;
