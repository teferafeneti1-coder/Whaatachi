import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Sparkles, LogIn } from 'lucide-react';
import WhaatachiLogo from '../ui/WhaatachiLogo';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Browse', to: '/browse' },
  { label: 'How It Works', to: '/#how-it-works' },
  { label: 'Success Stories', to: '/#success' },
  { label: 'Pricing', to: '/#pricing' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const handleAnchorLink = (e, to) => {
    if (to.startsWith('/#')) {
      e.preventDefault();
      const id = to.slice(2);
      if (pathname !== '/') {
        navigate('/');
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          background: scrolled ? 'rgba(10, 20, 36, 0.98)' : 'rgba(13, 27, 42, 0.55)',
          backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
          borderBottom: scrolled ? '1px solid rgba(233,30,140,0.18)' : '1px solid rgba(255,255,255,0.05)',
          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: scrolled ? '0 4px 40px rgba(0,0,0,0.45)' : 'none',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent 0%, #E91E8C 40%, #1565C0 70%, transparent 100%)', opacity: scrolled ? 1 : 0, transition: 'opacity 0.4s' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 380, damping: 15 }}
              style={{ width: 46, height: 46, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
            >
              {/* Soft glow ring behind logo */}
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '2px solid rgba(233,30,140,0.5)' }}
              />
              <img
                src="/logo-icon.svg"
                alt="Whaatachi logo"
                style={{ width: 52, height: 52, objectFit: 'contain', display: 'block', filter: 'drop-shadow(0 0 8px rgba(233,30,140,0.5))' }}
              />
            </motion.div>
            <div>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 800, background: 'linear-gradient(135deg, #ffffff 30%, #E91E8C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.5px', lineHeight: 1.1, display: 'block' }}>Whaatachi</span>
              <span style={{ fontSize: 9, fontFamily: 'Inter, sans-serif', color: 'rgba(233,30,140,0.75)', letterSpacing: '0.16em', fontWeight: 600, textTransform: 'uppercase' }}>Premium Connections</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="wh-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.to;
              return (
                <motion.div key={link.to} whileHover={{ y: -1 }}>
                  <Link to={link.to} onClick={(e) => handleAnchorLink(e, link.to)}
                    style={{ color: isActive ? '#E91E8C' : 'rgba(255,255,255,0.72)', fontFamily: 'Inter, sans-serif', fontWeight: isActive ? 600 : 500, fontSize: 14, padding: '7px 13px', borderRadius: 50, background: isActive ? 'rgba(233,30,140,0.1)' : 'transparent', textDecoration: 'none', transition: 'all 0.2s', whiteSpace: 'nowrap', position: 'relative', display: 'inline-flex', alignItems: 'center' }}
                    onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; } }}
                    onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.color = 'rgba(255,255,255,0.72)'; e.currentTarget.style.background = 'transparent'; } }}
                  >
                    {link.label}
                    {isActive && <motion.div layoutId="nav-dot" style={{ position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#E91E8C', boxShadow: '0 0 6px #E91E8C' }} />}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="wh-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to="/browse" style={{ textDecoration: 'none' }}>
              <motion.button whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
                style={{ background: 'transparent', border: '1.5px solid rgba(255,255,255,0.22)', color: 'rgba(255,255,255,0.82)', padding: '8px 20px', borderRadius: 50, fontSize: 14, fontWeight: 500, fontFamily: 'Inter, sans-serif', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6 }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(233,30,140,0.5)'; e.currentTarget.style.color = '#E91E8C'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; e.currentTarget.style.color = 'rgba(255,255,255,0.82)'; }}>
                <LogIn size={13} /> Login
              </motion.button>
            </Link>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <motion.button whileHover={{ scale: 1.05, y: -1, boxShadow: '0 10px 36px rgba(233,30,140,0.55)' }} whileTap={{ scale: 0.97 }}
                style={{ background: 'linear-gradient(135deg, #E91E8C, #C2185B)', border: 'none', color: '#fff', padding: '9px 22px', borderRadius: 50, fontSize: 14, fontWeight: 700, fontFamily: 'Inter, sans-serif', cursor: 'pointer', boxShadow: '0 4px 22px rgba(233,30,140,0.38)', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}>
                <Sparkles size={12} /> Register Free
              </motion.button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <motion.button className="wh-mobile-btn" whileTap={{ scale: 0.9 }} onClick={() => setOpen(!open)}
            style={{ display: 'none', background: open ? 'rgba(233,30,140,0.12)' : 'rgba(255,255,255,0.07)', border: `1px solid ${open ? 'rgba(233,30,140,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: open ? '#E91E8C' : 'rgba(255,255,255,0.85)', transition: 'all 0.2s' }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={open ? 'close' : 'open'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                {open ? <X size={19} /> : <Menu size={19} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              style={{ overflow: 'hidden', background: 'rgba(8, 15, 28, 0.99)', backdropFilter: 'blur(28px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ padding: '8px 24px 28px' }}>
                {NAV_LINKS.map((link, i) => (
                  <motion.div key={link.to} initial={{ x: -24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.06 }}>
                    <Link to={link.to} onClick={(e) => { handleAnchorLink(e, link.to); setOpen(false); }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: pathname === link.to ? '#E91E8C' : 'rgba(255,255,255,0.78)', padding: '15px 0', fontSize: 16, fontFamily: 'Inter, sans-serif', fontWeight: pathname === link.to ? 600 : 400, borderBottom: '1px solid rgba(255,255,255,0.05)', textDecoration: 'none' }}>
                      {link.label}
                      <ChevronDown size={14} style={{ transform: 'rotate(-90deg)', opacity: 0.35 }} />
                    </Link>
                  </motion.div>
                ))}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <Link to="/browse" style={{ flex: 1, textDecoration: 'none' }}>
                    <button onClick={() => setOpen(false)} style={{ width: '100%', background: 'transparent', border: '1.5px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.85)', padding: '13px', borderRadius: 50, fontSize: 15, fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>Login</button>
                  </Link>
                  <Link to="/register" style={{ flex: 1, textDecoration: 'none' }}>
                    <button onClick={() => setOpen(false)} style={{ width: '100%', background: 'linear-gradient(135deg, #E91E8C, #C2185B)', border: 'none', color: '#fff', padding: '13px', borderRadius: 50, fontSize: 15, fontWeight: 700, fontFamily: 'Inter, sans-serif', cursor: 'pointer', boxShadow: '0 4px 20px rgba(233,30,140,0.4)' }}>Register Free</button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <div style={{ height: 68 }} />

      <style>{`
        @media (max-width: 940px) {
          .wh-desktop-nav { display: none !important; }
          .wh-mobile-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
