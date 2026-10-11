import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getContacts } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid,
  FiBox,
  FiLayers,
  FiImage,
  FiMessageSquare,
  FiLogOut,
  FiExternalLink,
  FiMenu,
  FiX,
  FiShield,
  FiUser,
} from 'react-icons/fi';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Fetch unread messages count periodically
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await getContacts({ read: 'false', limit: 1 });
        if (res.data?.success) {
          setUnreadCount(res.data.unreadCount || 0);
        }
      } catch (err) {
        // silent
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [location.pathname]);

  const navLinks = [
    { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
    { to: '/admin/products', label: 'Products', icon: FiBox },
    { to: '/admin/categories', label: 'Categories', icon: FiLayers },
    { to: '/admin/banners', label: 'Hero Banners', icon: FiImage },
    {
      to: '/admin/contacts',
      label: 'Enquiries',
      icon: FiMessageSquare,
      badge: unreadCount > 0 ? unreadCount : null,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased selection:bg-amber-500 selection:text-slate-950">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 shrink-0 sticky top-0 h-screen z-30">
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
              <FiShield size={20} />
            </div>
            <div>
              <span className="font-heading font-bold text-lg text-amber-400 tracking-wider block">
                SUYOG
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 block -mt-1">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom actions & user info */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-2">
              <FiExternalLink size={14} />
              <span>View Public Store</span>
            </div>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Live</span>
          </a>

          <div className="flex items-center justify-between pt-2 px-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center shrink-0">
                <FiUser size={16} />
              </div>
              <div className="truncate">
                <span className="text-xs font-medium text-slate-200 block truncate">{user?.name || 'Owner'}</span>
                <span className="text-[10px] text-slate-500 block truncate">{user?.email || 'Admin'}</span>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="text-slate-400 hover:text-red-400 p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <FiLogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile Top Header ── */}
      <header className="md:hidden sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-slate-100 focus:outline-none"
            aria-label="Open Navigation Menu"
          >
            <FiMenu size={22} />
          </button>
          <Link to="/admin" className="flex items-center gap-2">
            <span className="font-heading font-bold text-amber-400 text-base tracking-wider">
              SUYOG
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
              Admin
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-slate-400 hover:text-amber-400 text-xs flex items-center gap-1 bg-slate-800/80"
            title="Open Store"
          >
            <FiExternalLink size={14} />
          </a>
          <button
            onClick={logout}
            className="p-2 rounded-lg text-slate-400 hover:text-red-400 text-xs bg-slate-800/80"
            title="Sign Out"
          >
            <FiLogOut size={16} />
          </button>
        </div>
      </header>

      {/* ── Mobile Drawer (Slide in) ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-72 max-w-[80%] bg-slate-900 h-full border-r border-slate-800 flex flex-col p-6 z-10"
            >
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                    <FiShield size={18} />
                  </div>
                  <div>
                    <span className="font-heading font-bold text-amber-400 text-base tracking-wider block">
                      SUYOG
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block -mt-1">
                      Store Console
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-100 rounded-lg"
                >
                  <FiX size={20} />
                </button>
              </div>

              <nav className="flex-1 py-6 space-y-2 overflow-y-auto">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.end}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} />
                        <span>{link.label}</span>
                      </div>
                      {link.badge && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                          {link.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={logout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-950/30 font-medium transition-colors"
                >
                  <FiLogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Main Content Container ── */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950 pb-24 md:pb-12 overflow-x-hidden">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>

      {/* ── Mobile Sticky Bottom Tab Bar (Convenient thumb navigation on phones) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-all relative ${
                  isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <div className="relative">
                <Icon size={20} className="mb-0.5" />
                {link.badge && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {link.badge > 9 ? '9+' : link.badge}
                  </span>
                )}
              </div>
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminLayout;
