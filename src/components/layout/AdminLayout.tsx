import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  Menu,
  X,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { logout } from '@/store/slices/authSlice';
import { cn } from '@/lib/utils';

const AdminLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: t('admin.dashboard'), exact: true },
    { href: '/admin/products', icon: Package, label: t('admin.products') },
    { href: '/admin/categories', icon: FolderTree, label: t('admin.categories') },
    { href: '/admin/offers', icon: Tag, label: 'Offers' },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-40 h-screen bg-card border-r border-border transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-0 lg:w-20'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            {sidebarOpen && (
              <Link to="/" className="flex items-center gap-2">
                <span className="font-display text-xl font-bold text-gradient">LUXE</span>
                <span className="text-xs text-muted-foreground">Admin</span>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex"
            >
              <ChevronLeft
                className={cn('h-5 w-5 transition-transform', !sidebarOpen && 'rotate-180')}
              />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                  isActive(item.href, item.exact)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-2">
            <Link
              to="/"
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all'
              )}
            >
              <ChevronLeft className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span>Back to Store</span>}
            </Link>
            <button
              onClick={handleLogout}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all'
              )}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span>{t('nav.logout')}</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center px-4 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <h1 className="text-xl font-display font-semibold ml-4 lg:ml-0">
            {t('admin.dashboard')}
          </h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
