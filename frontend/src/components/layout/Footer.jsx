import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, ArrowRight, Globe, MessageCircle, Users, Play } from 'lucide-react';
import WhaatachiLogo from '../ui/WhaatachiLogo';

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Browse Profiles', to: '/browse' },
  { label: 'Create Profile', to: '/register' },
  { label: 'How It Works', to: '/#how-it-works' },
  { label: 'Pricing', to: '/#pricing' },
];
const SUPPORT_LINKS = [
  { label: 'Privacy Policy', to: '#' },
  { label: 'Terms of Service', to: '#' },
  { label: 'Safety Tips', to: '#' },
  { label: 'Contact Us', to: '#' },
  { label: 'Help Center', to: '#' },
];
const SOCIAL = [
  { icon: MessageCircle, color: '#E1306C', label: 'Instagram', href: '#' },
  { icon: Globe, color: '#1DA1F2', label: 'Twitter', href: '#' },
  { icon: Users, color: '#1877F2', label: 'Facebook', href: '#' },
  { icon: Play, color: '#FF0000', label: 'YouTube', href: '#' },
];
const PAYMENT_METHODS = [
  { name: 'Telebirr', emoji: '📱', color: '#FF6B35', bg: 'rgba(255,107,53,0.1)', border: 'rgba(255,107,53,0.3)' },
  { name: 'CBE Birr', emoji: '🏦', color: '#1565C0', bg: 'rgba(21,101,192,0.1)', border: 'rgba(21,101,192,0.3)' },
  { name: 'Amole', emoji: '💳', color: '#4CAF50', bg: 'rgba(76,175,80,0.1)', border: 'rgba(76,175,80,0.3)' },
];

function FooterLink({ to, children, onClick }) {
  return (
    <Link to={to} onClick={onClick} style={{ textDecoration: 'none' }}>
      <motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.42)', fontSize: 14, fontFamily: 'Inter, sans-serif', padding: '6px 0', cursor: 'pointer' }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#E91E8C'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.42)'}>
        <ArrowRight size={11} style={{ opacity: 0.4, flexShrink: 0 }} />
        {children}
      </motion.div>
    </Link>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();

  const handleAnchorLink = (e, to) => {
    if (to.startsWith('/#')) {
      e.preventDefault();
      const id = to.slice(2);
      if (window.location.pathname !== '/') { navigate('/'); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300); }
      else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer style={{ background: 'linear-gradient(180deg, #0a1424 0%, #050c18 100%)', color: 'rgba(255,255,255,0.52)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: '25%', width: '50%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(233,30,140,0.45), rgba(21,101,192,0.45), transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '-5%', right: '-8%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(233,30,140,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 24px 0', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 48, marginBottom: 60 }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <motion.div whileHover={{ scale: 1.08 }} transition={{ type: 'spring', stiffness: 380, damping: 15 }}
                style={{ width: 52, height: 52, flexShrink: 0 }}>
                <img src="/logo-icon.svg" alt="Whaatachi" style={{ width: 52, height: 52, objectFit: 'contain' }} />
              </motion.div>
              <div>
                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 800, color: '#fff', display: 'block', lineHeight: 1.1 }}>Whaatachi</span>
                <span style={{ fontSize: 9, color: 'rgba(233,30,140,0.72)', letterSpacing: '0.15em', fontFamily: 'Inter', fontWeight: 600, textTransform: 'uppercase' }}>Premium Connections</span>
              </div>
            </Link>
            <p style={{ fontSize: 14, lineHeight: 1.8, maxWidth: 260, color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif', marginBottom: 28 }}>
              Ethiopia's most trusted premium dating platform. Find love, friendship, and meaningful connections.
            </p>
            <div style={{ display: 'flex', gap: 9 }}>
              {SOCIAL.map(({ icon: Icon, color, label, href }) => (
                <motion.a key={label} href={href} aria-label={label} whileHover={{ scale: 1.18, y: -3 }} whileTap={{ scale: 0.9 }}
                  style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = `${color}1a`; e.currentTarget.style.borderColor = `${color}55`; e.currentTarget.style.color = color; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}>
                  <Icon size={14} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.85)', marginBottom: 22, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 18, height: 2, background: '#E91E8C', borderRadius: 2 }} />Quick Links
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column' }}>
              {QUICK_LINKS.map((link) => <FooterLink key={link.label} to={link.to} onClick={(e) => handleAnchorLink(e, link.to)}>{link.label}</FooterLink>)}
            </nav>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.85)', marginBottom: 22, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 18, height: 2, background: '#E91E8C', borderRadius: 2 }} />Support
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column' }}>
              {SUPPORT_LINKS.map((link) => <FooterLink key={link.label} to={link.to}>{link.label}</FooterLink>)}
            </nav>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="mailto:support@whaatachi.com" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.32)', fontFamily: 'Inter, sans-serif' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#E91E8C'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.32)'}>
                <Mail size={12} style={{ color: '#E91E8C', flexShrink: 0 }} /> support@whaatachi.com
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.32)', fontFamily: 'Inter, sans-serif' }}>
                <MapPin size={12} style={{ color: '#1565C0', flexShrink: 0 }} /> Addis Ababa, Ethiopia
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.85)', marginBottom: 22, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 18, height: 2, background: '#E91E8C', borderRadius: 2 }} />Newsletter
            </h4>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', fontFamily: 'Inter, sans-serif', marginBottom: 16, lineHeight: 1.65 }}>Get updates and offers straight to your inbox.</p>
            {!subscribed ? (
              <form onSubmit={(e) => { e.preventDefault(); if (email) { setSubscribed(true); setEmail(''); } }} style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 50, overflow: 'hidden', transition: 'border-color 0.2s' }}
                  onFocusCapture={(e) => e.currentTarget.style.borderColor = 'rgba(233,30,140,0.5)'}
                  onBlurCapture={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '11px 16px', fontSize: 13, color: '#fff', fontFamily: 'Inter, sans-serif' }} />
                  <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    style={{ background: 'linear-gradient(135deg, #E91E8C, #C2185B)', border: 'none', padding: '11px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0 50px 50px 0' }}>
                    <Send size={13} color="#fff" />
                  </motion.button>
                </div>
              </form>
            ) : (
              <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: '11px 16px', fontSize: 13, color: '#10B981', fontFamily: 'Inter, sans-serif', fontWeight: 500, marginBottom: 28, textAlign: 'center' }}>
                ✓ You're subscribed!
              </motion.div>
            )}
            <div>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', fontFamily: 'Inter, sans-serif', marginBottom: 10, letterSpacing: '0.09em', textTransform: 'uppercase', fontWeight: 600 }}>Payment Methods</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {PAYMENT_METHODS.map((pm) => (
                  <motion.div key={pm.name} whileHover={{ y: -2, scale: 1.06 }} style={{ background: pm.bg, border: `1px solid ${pm.border}`, borderRadius: 8, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 15 }}>{pm.emoji}</span>
                    <span style={{ fontSize: 11, color: pm.color, fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{pm.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.055)', paddingTop: 24, paddingBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.28)' }}>© 2026 Whaatachi. All rights reserved.</p>
          <p style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.28)', display: 'flex', alignItems: 'center', gap: 5 }}>
            Made with{' '}<motion.span animate={{ scale: [1, 1.35, 1] }} transition={{ repeat: Infinity, duration: 1.6 }} style={{ display: 'inline-flex' }}><img src="/logo-icon.svg" alt="" style={{ width: 16, height: 16, objectFit: 'contain' }} /></motion.span>{' '}in Ethiopia
          </p>
          <Link to="/admin/login" style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', fontFamily: 'Inter, sans-serif', textDecoration: 'none' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.18)'}>
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
