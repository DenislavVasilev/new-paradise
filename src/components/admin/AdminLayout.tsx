import React, { useState } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../lib/store';
import LoadingSpinner from '../LoadingSpinner';
import {
  Building2,
  LayoutDashboard,
  Home,
  Car,
  Store,
  Image,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  MessageSquare,
  Wrench
} from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, isAdmin, loading } = useAuthStore();
  const location = useLocation();

  const navigation = [
    { name: 'Табло', href: '/admin', icon: LayoutDashboard },
    { name: 'Конфигурация', href: '/admin/building-config', icon: Wrench },
    { name: 'Начална страница', href: '/admin/homepage', icon: Home },
    { name: 'Етажни планове', href: '/admin/floor-plans', icon: Building2 },
    { name: 'Апартаменти', href: '/admin/apartments', icon: Home },
    { name: 'Паркоместа', href: '/admin/parking', icon: Car },
    { name: 'Магазини', href: '/admin/stores', icon: Store },
    { name: 'Медия', href: '/admin/media', icon: Image },
    { name: 'Контакти', href: '/admin/contacts', icon: MessageSquare },
    { name: 'Настройки', href: '/admin/settings', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    useAuthStore.getState().setUser(null);
    useAuthStore.getState().setIsAdmin(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center space-x-2">
              <Building2 className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-primary">
                Paradise Green Park
              </span>
            </div>
            <button
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'} mr-3`} />
                  {item.name}
                  {isActive && (
                    <ChevronRight className="w-5 h-5 ml-auto" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user.displayName || 'Администратор'}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          className="p-2 bg-white rounded-lg shadow-lg"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Main content */}
      <div className={`lg:pl-64 min-h-screen transition-all duration-300`}>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;