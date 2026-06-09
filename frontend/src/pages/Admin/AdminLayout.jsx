import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, CreditCard, BarChart2,
  Heart, LogOut, Menu, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users',     icon: Users,           label: 'Users' },
  { to: '/admin/payments',  icon: CreditCard,      label: 'Payments' },
  { to: '/admin/stats',     icon: BarChart2,       label: 'Statistics' },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/admin/login');
  };

  const Sidebar = ({ mobile = false }) => (
    <div style={{
      width: mobile ? '100%' : 240,
      background: '#0D1B2A',
      display: 'flex', flexDirection: 'column',
      height: '100%',
      minHeight: mobile ? 'auto' : '100vh',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #E91E8C, #1565C0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Heart size={16} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: '#fff' }}>
            Whaatachi
          </span>
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 6 }}>
          Admin Dashboard
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '11px 14px', borderRadius: 10,
            textDecoration: 'none',
            fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 14,
            color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
            background: isActive ? 'rgba(233,30,140,0.15)' : 'transparent',
            borderLeft: isActive ? '3px solid #E91E8C' : '3px solid transparent',
            transition: 'all 0.2s',
          })}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #E91E8C, #1565C0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 14, fontWeight: 700,
          }}>
            {admin?.fullName?.[0]?.toUpperCase() || 'A'}
          </div>
          <div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, color: '#fff' }}>
              {admin?.fullName || 'Admin'}
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
              Administrator
            </div>
          </div>
        </div>
        <button onClick={handleLogout} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,0.04)',
          color: 'rgba(255,255,255,0.5)',
          fontFamily: 'Inter, sans-serif', fontSize: 14,
          transition: 'all 0.2s',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(233,30,140,0.15)'; e.currentTarget.style.color = '#E91E8C'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Desktop sidebar */}
      <div style={{ display: 'none' }} className="admin-sidebar-desktop">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            exit={{ x: -240 }}
            style={{
              position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 1000,
              width: 240, boxShadow: '4px 0 32px rgba(0,0,0,0.3)',
            }}
          >
            <Sidebar mobile />
          </motion.div>
        )}
      </AnimatePresence>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.5)' }}
        />
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F8F9FA' }}>
        {/* Mobile topbar */}
        <div style={{
          background: '#0D1B2A', padding: '14px 20px',
          display: 'flex', alignItems: 'center', gap: 16,
        }} className="admin-mobile-topbar">
          <button onClick={() => setSidebarOpen(true)} style={{
            background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
          }}>
            <Menu size={22} />
          </button>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: '#fff', fontWeight: 700 }}>
            Whaatachi Admin
          </span>
        </div>

        <div style={{ flex: 1, padding: '32px 28px', overflowY: 'auto' }}>
          <Outlet />
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .admin-sidebar-desktop { display: block !important; }
          .admin-mobile-topbar { display: none !important; }
        }
      `}</style>
    </div>
  );
}
