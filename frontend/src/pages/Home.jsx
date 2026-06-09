import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Users, Shield, Star, CheckCircle, ArrowRight,
  ChevronDown, Sparkles, MapPin, Flame, Coffee, Handshake,
  UserCheck, MessageCircle, Zap, Play, Lock, Phone, Send,
  CreditCard, Award, Globe,
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import api from '../services/api';
import { useApp } from '../context/AppContext';
import WhaatachiLogo from '../components/ui/WhaatachiLogo';

const ROSE  = '#E91E8C';
const DROSE = '#C2185B';
const NAVY  = '#0D1B2A';
const BLUE  = '#1565C0';

function useCounter(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!started) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(e * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return { count, trigger: () => setStarted(true) };
}

function StatBadge({ value, suffix, label, icon: Icon, color, delay = 0 }) {
  const { count, trigger } = useCounter(value, 1600);
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      onViewportEnter={trigger}
      style={{
        textAlign: 'center', background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 18, padding: '20px 16px', position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      <div style={{ width: 38, height: 38, borderRadius: '50%', background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
        <Icon size={16} color={color} />
      </div>
      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 800, background: `linear-gradient(135deg, #fff, ${color})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1, marginBottom: 4 }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>{label}</div>
    </motion.div>
  );
}

function Particles() {
  const pts = useRef(Array.from({ length: 24 }, (_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, size: 2 + Math.random() * 3, dur: 5 + Math.random() * 6, del: Math.random() * 5 }))).current;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {pts.map((p) => (
        <motion.div key={p.id} style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, borderRadius: '50%', background: p.id % 3 === 0 ? ROSE : p.id % 3 === 1 ? BLUE : '#A855F7', opacity: 0 }}
          animate={{ opacity: [0, 0.55, 0], y: [-15, -70], scale: [0.5, 1, 0.5] }}
          transition={{ duration: p.dur, delay: p.del, repeat: Infinity, ease: 'easeInOut' }} />
      ))}
    </div>
  );
}

const GOALS = [
  { id: 'relationship', icon: Heart, emoji: '❤️', title: 'True Relationship', desc: 'Deep, committed love built to last.', color: ROSE, gradient: `linear-gradient(135deg, ${ROSE}1e, ${DROSE}0d)` },
  { id: 'friendship', icon: Handshake, emoji: '🤝', title: 'Friendship', desc: 'Genuine bonds that stand the test of time.', color: '#3B82F6', gradient: 'linear-gradient(135deg, #3B82F61e, #1D4ED80d)' },
  { id: 'fwb', icon: Coffee, emoji: '☕', title: 'Friends With Benefits', desc: 'Comfortable chemistry, no strings attached.', color: '#A855F7', gradient: 'linear-gradient(135deg, #A855F71e, #7C3AED0d)' },
  { id: 'casual', icon: Flame, emoji: '🔥', title: 'Casual', desc: 'Spontaneous, fun, and in the moment.', color: '#F97316', gradient: 'linear-gradient(135deg, #F973161e, #EA580C0d)' },
];

const STEPS = [
  { num: '01', icon: UserCheck, title: 'Create Profile', desc: 'Sign up in under 2 minutes. Add photos and tell your story.', color: ROSE },
  { num: '02', icon: Sparkles, title: 'Set Your Intent', desc: "Tell us what you're looking for. We'll match you accordingly.", color: '#A855F7' },
  { num: '03', icon: Users, title: 'Browse & Discover', desc: 'Explore real verified profiles tailored to your preferences.', color: BLUE },
  { num: '04', icon: MessageCircle, title: 'Connect & Meet', desc: 'Unlock contact details and start meaningful conversations.', color: '#10B981' },
];

const MEN_FEATURES = [
  { icon: Users, text: 'Full access to all members' },
  { icon: Phone, text: 'View contacts (Phone, Telegram, IG)' },
  { icon: Sparkles, text: 'Advanced search & filters' },
  { icon: Send, text: 'Send messages to anyone' },
  { icon: Shield, text: '24/7 Customer support' },
];
const WOMEN_FEATURES = [
  { icon: UserCheck, text: 'Create profile for free' },
  { icon: Users, text: 'Browse all members' },
  { icon: MessageCircle, text: 'Receive messages' },
  { icon: Star, text: 'View limited info' },
  { icon: Award, text: 'Upgrade anytime (optional)' },
];

const STATIC_MEMBERS = [
  { _id: 's1', fullName: 'Selam T.', age: 26, connectionGoal: 'relationship', gender: 'female', photoUrl: null },
  { _id: 's2', fullName: 'Dawit A.', age: 29, connectionGoal: 'friendship', gender: 'male', photoUrl: null },
  { _id: 's3', fullName: 'Meron H.', age: 24, connectionGoal: 'casual', gender: 'female', photoUrl: null },
  { _id: 's4', fullName: 'Abebe K.', age: 31, connectionGoal: 'relationship', gender: 'male', photoUrl: null },
  { _id: 's5', fullName: 'Tigist M.', age: 23, connectionGoal: 'fwb', gender: 'female', photoUrl: null },
  { _id: 's6', fullName: 'Yonas B.', age: 28, connectionGoal: 'friendship', gender: 'male', photoUrl: null },
  { _id: 's7', fullName: 'Hana G.', age: 27, connectionGoal: 'relationship', gender: 'female', photoUrl: null },
  { _id: 's8', fullName: 'Biruk F.', age: 30, connectionGoal: 'casual', gender: 'male', photoUrl: null },
];

function SectionTag({ color = ROSE, children }) {
  return (
    <span style={{ display: 'inline-block', background: `${color}18`, border: `1px solid ${color}33`, borderRadius: 50, padding: '5px 16px', fontSize: 11, fontWeight: 700, color, fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
      {children}
    </span>
  );
}

function MemberCard({ member, index }) {
  const navigate = useNavigate();
  const photoUrl = member.photoUrl ? (member.photoUrl.startsWith('/') ? `http://localhost:5000${member.photoUrl}` : member.photoUrl) : null;
  const goalColors = { relationship: ROSE, dating: ROSE, fwb: '#A855F7', casual: '#F97316', friendship: '#3B82F6' };
  const accentColor = goalColors[member.connectionGoal] || ROSE;
  const isOnline = (index % 3) !== 2;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.02 }} whileTap={{ scale: 0.98 }}
      onClick={() => navigate('/browse')}
      style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 22, padding: '18px 16px', cursor: 'pointer', minWidth: 175, maxWidth: 200, flexShrink: 0, position: 'relative', overflow: 'hidden' }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${accentColor}44`; e.currentTarget.style.boxShadow = `0 16px 48px ${accentColor}18`; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at top, ${accentColor}09, transparent 60%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', marginBottom: 12, display: 'inline-block' }}>
        {photoUrl ? (
          <img src={photoUrl} alt={member.fullName} style={{ width: 68, height: 68, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${accentColor}44`, boxShadow: `0 6px 20px ${accentColor}22` }} />
        ) : (
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}11)`, border: `2px solid ${accentColor}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, boxShadow: `0 6px 20px ${accentColor}22` }}>
            {member.gender === 'female' ? '👩🏾' : '🧑🏾'}
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: '50%', background: isOnline ? '#10B981' : '#4B5563', border: '2.5px solid #0a1220', boxShadow: isOnline ? '0 0 8px rgba(16,185,129,0.65)' : 'none' }} />
      </div>
      <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.fullName?.split(' ')[0] || 'User'}</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', marginBottom: 10, fontFamily: 'Inter, sans-serif' }}>{member.age ? `${member.age} yrs` : 'Age hidden'}</div>
      <div style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}33`, borderRadius: 50, padding: '3px 10px', fontSize: 10, fontWeight: 700, color: accentColor, fontFamily: 'Inter, sans-serif', display: 'inline-block', marginBottom: 10, letterSpacing: '0.04em', textTransform: 'capitalize' }}>
        {member.connectionGoal || 'Relationship'}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'Inter, sans-serif' }}>
        <MapPin size={10} style={{ flexShrink: 0 }} /> Addis Ababa
      </div>
    </motion.div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { selectedGoal, setSelectedGoal, selectedGender, setSelectedGender } = useApp();
  const scrollRef = useRef(null);
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [realStats, setRealStats] = useState({ totalUsers: null, approvedUsers: null });

  useEffect(() => {
    let cancelled = false;

    // Fetch featured members
    api.get('/users?limit=8')
      .then((res) => { if (!cancelled) { const d = res.data?.users || []; setMembers(d.length > 0 ? d : STATIC_MEMBERS); } })
      .catch(() => { if (!cancelled) setMembers(STATIC_MEMBERS); })
      .finally(() => { if (!cancelled) setMembersLoading(false); });

    // Fetch real stats from admin endpoint (no auth needed for totals via public count)
    // We use the /users endpoint with head to get total count
    api.get('/users?limit=1')
      .then((res) => {
        if (!cancelled) {
          const total = res.data?.total || 0;
          setRealStats({ totalUsers: total, approvedUsers: total });
        }
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, []);

  const scrollMembers = (dir) => scrollRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' });

  return (
    <PageWrapper>
      <div style={{ background: NAVY, overflowX: 'hidden' }}>

        {/* ── HERO ── */}
        <section style={{ minHeight: '95vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <motion.div animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #060e1a 0%, #120820 28%, #0a1628 55%, #17091d 80%, #060e1a 100%)', backgroundSize: '300% 300%' }} />
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: '-12%', left: '12%', width: 620, height: 620, borderRadius: '50%', background: `radial-gradient(circle, ${ROSE}19, transparent 62%)`, filter: 'blur(44px)' }} />
            <div style={{ position: 'absolute', bottom: '-14%', right: '8%', width: 520, height: 520, borderRadius: '50%', background: `radial-gradient(circle, ${BLUE}19, transparent 62%)`, filter: 'blur(44px)' }} />
          </div>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.025, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
          <Particles />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto', padding: '110px 24px 90px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 48, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 480px', maxWidth: 630 }}>
              <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${ROSE}18`, border: `1px solid ${ROSE}33`, borderRadius: 50, padding: '6px 16px', marginBottom: 30 }}>
                <motion.div animate={{ rotate: [0, 18, -18, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}><Sparkles size={12} color={ROSE} /></motion.div>
                <span style={{ fontSize: 11, fontWeight: 700, color: ROSE, fontFamily: 'Inter, sans-serif', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Ethiopia's #1 Premium Dating Platform</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.7 }}
                style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(38px, 5.5vw, 72px)', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: 22, letterSpacing: '-1px' }}>
                Find People.{' '}
                <span style={{ background: `linear-gradient(135deg, ${ROSE}, #FF6B9D, ${BLUE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Build Connections.</span>
                <br /><span style={{ color: ROSE }}>Your Way.</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }}
                style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(16px, 2vw, 19px)', color: 'rgba(255,255,255,0.58)', lineHeight: 1.78, marginBottom: 40, maxWidth: 490 }}>
                Find men and women for true relationship, friendship, friends with benefits or just fun. Real people, real connections, real you.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }}
                style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 44 }}>
                <motion.button whileHover={{ scale: 1.04, y: -2, boxShadow: `0 18px 52px ${ROSE}55` }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/register')}
                  style={{ background: `linear-gradient(135deg, ${ROSE}, ${DROSE})`, border: 'none', color: '#fff', padding: '16px 38px', borderRadius: 50, fontSize: 16, fontWeight: 700, fontFamily: 'Inter, sans-serif', cursor: 'pointer', boxShadow: `0 8px 32px ${ROSE}44`, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Heart size={16} fill="#fff" /> Join Now
                </motion.button>
                <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.18)', color: '#fff', padding: '16px 32px', borderRadius: 50, fontSize: 16, fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, backdropFilter: 'blur(8px)' }}>
                  <Play size={15} fill="rgba(255,255,255,0.8)" /> How It Works
                </motion.button>
              </motion.div>

              {/* Stats strip */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
                style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                {[
                  { val: realStats.totalUsers !== null ? `${realStats.totalUsers.toLocaleString()}+` : '...', label: 'Active Members', icon: '👥' },
                  { val: realStats.approvedUsers !== null ? `${realStats.approvedUsers.toLocaleString()}+` : '...', label: 'Verified Profiles', icon: '❤️' },
                  { val: '100%', label: 'Safe & Secure', icon: '🔒' }
                ].map((s) => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{s.icon}</span>
                    <div>
                      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{s.val}</div>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.42)' }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right visual */}
            <motion.div initial={{ opacity: 0, x: 44 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28, duration: 0.7 }}
              style={{ flex: '1 1 320px', maxWidth: 430 }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 32, padding: '36px', textAlign: 'center', position: 'relative', overflow: 'hidden', marginBottom: 20 }}>
                <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at top, ${ROSE}0d, transparent 60%)` }} />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${ROSE}55, transparent)` }} />
                <motion.div animate={{ y: [-8, 8, -8] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
                  <img
                    src="/logo-icon.svg"
                    alt="Whaatachi"
                    style={{
                      width: 160,
                      height: 160,
                      objectFit: 'contain',
                      display: 'block',
                      filter: 'drop-shadow(0 4px 24px rgba(233,30,140,0.55))',
                    }}
                  />
                </motion.div>
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 19, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Real Connections</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.42)', fontFamily: 'Inter, sans-serif' }}>Thousands of stories starting every day</p>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                  {['👩🏾', '🧑🏿', '👩🏽', '🧑🏾', '👩🏿'].map((em, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.85 + i * 0.1, type: 'spring', stiffness: 280 }}
                      style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, marginLeft: i > 0 ? -9 : 0, zIndex: 5 - i, position: 'relative' }}>
                      {em}
                    </motion.div>
                  ))}
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${ROSE}22`, border: `2px solid ${ROSE}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: ROSE, fontFamily: 'Inter', marginLeft: -9 }}>+2K</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <StatBadge value={realStats.totalUsers || 0} suffix="+" label="Members" icon={Users} color={ROSE} delay={0.5} />
                <StatBadge value={realStats.approvedUsers || 0} suffix="+" label="Verified" icon={Heart} color="#A855F7" delay={0.65} />
                <StatBadge value={100} suffix="%" label="Secure" icon={Shield} color={BLUE} delay={0.8} />
              </div>
            </motion.div>
          </div>

          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
            style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', zIndex: 3 }}
            onClick={() => document.getElementById('intent')?.scrollIntoView({ behavior: 'smooth' })}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.14em', textTransform: 'uppercase' }}>scroll</span>
            <ChevronDown size={17} color="rgba(255,255,255,0.28)" />
          </motion.div>
        </section>

        {/* ── I'M HERE FOR ── */}
        <section id="intent" style={{ background: '#07101e', padding: '88px 24px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${ROSE}44, ${BLUE}44, transparent)` }} />
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 52 }}>
              <SectionTag>I'm here for</SectionTag>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: '-0.5px', display: 'block' }}>What are you looking for?</h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.42)', maxWidth: 440, margin: '0 auto' }}>Choose your connection type and find people who want the same thing.</p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 36 }}>
              {GOALS.map((g, i) => {
                const Icon = g.icon;
                const active = selectedGoal === g.id;
                return (
                  <motion.div key={g.id} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedGoal(active ? null : g.id)}
                    style={{ background: active ? g.gradient : 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', border: `1.5px solid ${active ? g.color + '60' : 'rgba(255,255,255,0.07)'}`, borderRadius: 24, padding: '30px 22px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.3s', position: 'relative', overflow: 'hidden', boxShadow: active ? `0 12px 40px ${g.color}22` : 'none' }}>
                    {active && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ position: 'absolute', top: 14, right: 14, width: 22, height: 22, borderRadius: '50%', background: `linear-gradient(135deg, ${g.color}, ${g.color}bb)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle size={12} color="#fff" />
                      </motion.div>
                    )}
                    <div style={{ width: 58, height: 58, borderRadius: '50%', background: `${g.color}18`, border: `1.5px solid ${g.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: active ? `0 0 24px ${g.color}33` : 'none' }}>
                      <Icon size={24} color={g.color} />
                    </div>
                    <div style={{ fontSize: 26, marginBottom: 8 }}>{g.emoji}</div>
                    <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 8 }}>{g.title}</h3>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>{g.desc}</p>
                  </motion.div>
                );
              })}
            </div>

            <AnimatePresence>
              {selectedGoal && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 28 }}>
                  <div style={{ background: `linear-gradient(135deg, ${ROSE}18, ${BLUE}12)`, border: `1px solid ${ROSE}33`, borderRadius: 16, padding: '18px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Heart size={17} color={ROSE} fill={ROSE} />
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#fff', fontWeight: 500 }}>
                        Looking for <strong style={{ color: ROSE }}>{GOALS.find((g) => g.id === selectedGoal)?.title}</strong>
                      </span>
                    </div>
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                      onClick={() => navigate(`/browse?goal=${selectedGoal}&gender=${selectedGender}`)}
                      style={{ background: `linear-gradient(135deg, ${ROSE}, ${DROSE})`, border: 'none', color: '#fff', padding: '10px 24px', borderRadius: 50, fontSize: 14, fontWeight: 700, fontFamily: 'Inter, sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: `0 6px 20px ${ROSE}44` }}>
                      Browse Matches <ArrowRight size={13} />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.38)', marginBottom: 14, fontSize: 14 }}>I'm looking for:</p>
              <div style={{ display: 'inline-flex', gap: 5, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 50, padding: 5 }}>
                {[{ key: 'female', label: '♀ Women' }, { key: 'male', label: '♂ Men' }].map((g) => (
                  <motion.button key={g.key} whileTap={{ scale: 0.96 }} onClick={() => setSelectedGender(g.key)}
                    style={{ padding: '10px 28px', borderRadius: 50, border: 'none', background: selectedGender === g.key ? `linear-gradient(135deg, ${ROSE}, ${DROSE})` : 'transparent', color: selectedGender === g.key ? '#fff' : 'rgba(255,255,255,0.42)', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.25s', boxShadow: selectedGender === g.key ? `0 4px 16px ${ROSE}44` : 'none' }}>
                    {g.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" style={{ padding: '96px 24px', background: `linear-gradient(180deg, ${NAVY} 0%, #0a1220 100%)`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 18% 62%, ${ROSE}09 0%, transparent 52%), radial-gradient(circle at 82% 18%, ${BLUE}09 0%, transparent 52%)`, pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 68 }}>
              <SectionTag color={BLUE}>Simple & Easy</SectionTag>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: '-0.5px', display: 'block' }}>How It Works</h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.42)', maxWidth: 420, margin: '0 auto' }}>From sign-up to real connection in four simple steps.</p>
            </motion.div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 22 }}>
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} whileHover={{ y: -7 }}
                    style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '36px 26px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
                    <div style={{ position: 'absolute', top: 10, right: 14, fontFamily: 'Playfair Display, serif', fontSize: 72, fontWeight: 800, color: `${step.color}09`, lineHeight: 1, userSelect: 'none' }}>{step.num}</div>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${step.color}55, transparent)` }} />
                    <div style={{ width: 62, height: 62, borderRadius: '50%', background: `${step.color}18`, border: `1.5px solid ${step.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', boxShadow: `0 0 28px ${step.color}22` }}>
                      <Icon size={26} color={step.color} />
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: `${step.color}14`, border: `1px solid ${step.color}33`, borderRadius: 50, padding: '3px 12px', marginBottom: 14 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: step.color, fontFamily: 'Inter, sans-serif', letterSpacing: '0.06em' }}>STEP {step.num}</span>
                    </div>
                    <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 17, color: '#fff', marginBottom: 10 }}>{step.title}</h3>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.72 }}>{step.desc}</p>
                  </motion.div>
                );
              })}
            </div>
            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginTop: 52 }}>
              <motion.button whileHover={{ scale: 1.04, y: -2, boxShadow: `0 16px 48px ${ROSE}44` }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/register')}
                style={{ background: `linear-gradient(135deg, ${ROSE}, ${DROSE})`, border: 'none', color: '#fff', padding: '16px 44px', borderRadius: 50, fontSize: 16, fontWeight: 700, fontFamily: 'Inter, sans-serif', cursor: 'pointer', boxShadow: `0 8px 32px ${ROSE}44`, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Get Started Free <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" style={{ padding: '96px 24px', background: '#060e1a', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 50% 0%, ${ROSE}0e 0%, transparent 55%)`, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${ROSE}44, transparent)` }} />
          <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative' }}>
            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 60 }}>
              <SectionTag>Transparent Pricing</SectionTag>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: '#fff', marginBottom: 10, letterSpacing: '-0.5px', display: 'block' }}>Join Whaatachi</h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.42)' }}>Fair, transparent pricing. Women join completely free.</p>
            </motion.div>

            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
              {/* MEN */}
              <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} whileHover={{ y: -6 }}
                style={{ background: `linear-gradient(145deg, ${ROSE}18, ${NAVY} 45%)`, border: `1px solid ${ROSE}44`, borderRadius: 28, padding: '40px 32px', flex: 1, minWidth: 260, maxWidth: 340, position: 'relative', overflow: 'hidden', backdropFilter: 'blur(12px)', boxShadow: `0 24px 64px ${ROSE}18` }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${ROSE}, transparent)` }} />
                <div style={{ position: 'absolute', top: 16, right: 16, background: `linear-gradient(135deg, ${ROSE}, ${DROSE})`, color: '#fff', fontSize: 9, fontWeight: 800, padding: '4px 12px', borderRadius: 50, fontFamily: 'Inter, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', boxShadow: `0 4px 12px ${ROSE}44` }}>Popular</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', background: `${ROSE}18`, border: `1px solid ${ROSE}30`, borderRadius: 50, padding: '4px 14px', marginBottom: 20 }}>
                  <span style={{ fontSize: 11, color: ROSE, fontFamily: 'Inter, sans-serif', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>♂ For Men</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 4 }}>
                  <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', fontFamily: 'Inter, sans-serif' }}>ETB</span>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 52, fontWeight: 800, background: `linear-gradient(135deg, #fff, ${ROSE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>200</span>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.38)', fontFamily: 'Inter, sans-serif' }}>Birr</span>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', fontFamily: 'Inter, sans-serif', marginBottom: 28 }}>One-time unlock payment</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginBottom: 32 }}>
                  {MEN_FEATURES.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: `${ROSE}22`, border: `1px solid ${ROSE}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <CheckCircle size={12} color={ROSE} />
                      </div>
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>{f.text}</span>
                    </div>
                  ))}
                </div>
                <motion.button whileHover={{ scale: 1.03, y: -1, boxShadow: `0 12px 36px ${ROSE}55` }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/register')}
                  style={{ width: '100%', background: `linear-gradient(135deg, ${ROSE}, ${DROSE})`, border: 'none', color: '#fff', padding: '14px', borderRadius: 50, fontSize: 15, fontWeight: 700, fontFamily: 'Inter, sans-serif', cursor: 'pointer', boxShadow: `0 8px 24px ${ROSE}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  Pay 200 Birr &amp; Continue <ArrowRight size={15} />
                </motion.button>
              </motion.div>

              {/* WOMEN */}
              <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} whileHover={{ y: -6 }}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 28, padding: '40px 32px', flex: 1, minWidth: 260, maxWidth: 340, position: 'relative', overflow: 'hidden', backdropFilter: 'blur(12px)' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #10B98155, transparent)' }} />
                <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 50, padding: '4px 14px', marginBottom: 20 }}>
                  <span style={{ fontSize: 11, color: '#10B981', fontFamily: 'Inter, sans-serif', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>♀ For Women</span>
                </div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 52, fontWeight: 800, background: 'linear-gradient(135deg, #fff, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1, marginBottom: 6 }}>FREE</div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', fontFamily: 'Inter, sans-serif', marginBottom: 28 }}>Always free, forever</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginBottom: 32 }}>
                  {WOMEN_FEATURES.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <CheckCircle size={12} color="#10B981" />
                      </div>
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.62)', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>{f.text}</span>
                    </div>
                  ))}
                </div>
                <motion.button whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/register')}
                  style={{ width: '100%', background: 'transparent', border: '1.5px solid rgba(16,185,129,0.45)', color: '#fff', padding: '14px', borderRadius: 50, fontSize: 15, fontWeight: 700, fontFamily: 'Inter, sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  Join For Free <ArrowRight size={15} />
                </motion.button>
              </motion.div>
            </div>

            {/* Trust features */}
            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
              {[
                { icon: Shield, text: 'Safe & Secure', desc: 'Your privacy is our priority', color: BLUE },
                { icon: UserCheck, text: 'Real People', desc: 'Verified profiles only', color: '#10B981' },
                { icon: Zap, text: 'Fast & Easy', desc: 'Quick registration process', color: '#F59E0B' },
                { icon: MessageCircle, text: '24/7 Support', desc: 'We are here to help', color: ROSE },
              ].map((t, i) => {
                const Icon = t.icon;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '18px 16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${t.color}18`, border: `1px solid ${t.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={16} color={t.color} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 2 }}>{t.text}</div>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{t.desc}</div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Payment strip */}
            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginTop: 44 }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', fontFamily: 'Inter, sans-serif', marginBottom: 16, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Secure payment via</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                {[{ name: 'Telebirr', emoji: '📱', color: '#FF6B35', bg: 'rgba(255,107,53,0.08)' }, { name: 'CBE Birr', emoji: '🏦', color: BLUE, bg: 'rgba(21,101,192,0.08)' }].map((pm) => (
                  <motion.div key={pm.name} whileHover={{ y: -2, scale: 1.05 }} style={{ background: pm.bg, border: `1px solid ${pm.color}33`, borderRadius: 10, padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ fontSize: 16 }}>{pm.emoji}</span>
                    <span style={{ fontSize: 12, color: pm.color, fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{pm.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── FEATURED MEMBERS ── */}
        <section style={{ padding: '96px 0', background: NAVY, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 78% 50%, ${ROSE}09 0%, transparent 50%)`, pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 44, flexWrap: 'wrap', gap: 14 }}>
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <SectionTag>Active Members</SectionTag>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', margin: 0, display: 'block' }}>Featured Members</h2>
              </motion.div>
              <motion.button initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/browse')}
                style={{ background: 'transparent', border: `1.5px solid ${ROSE}44`, color: ROSE, padding: '10px 24px', borderRadius: 50, fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                View All <ArrowRight size={14} />
              </motion.button>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 64, zIndex: 2, background: `linear-gradient(90deg, ${NAVY}, transparent)`, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 64, zIndex: 2, background: `linear-gradient(-90deg, ${NAVY}, transparent)`, pointerEvents: 'none' }} />
            <div ref={scrollRef} style={{ display: 'flex', gap: 18, overflowX: 'auto', padding: '10px 64px 28px', scrollbarWidth: 'none' }}>
              {membersLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 22, padding: 18, minWidth: 175, maxWidth: 195, flexShrink: 0 }}>
                    <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', marginBottom: 12, animation: 'skpulse 1.6s ease-in-out infinite' }} />
                    <div style={{ height: 14, background: 'rgba(255,255,255,0.07)', borderRadius: 6, marginBottom: 8, width: '70%', animation: 'skpulse 1.6s ease-in-out infinite' }} />
                    <div style={{ height: 24, background: 'rgba(255,255,255,0.05)', borderRadius: 12, width: '80%', animation: 'skpulse 1.6s ease-in-out infinite' }} />
                  </div>
                ))
                : members.map((m, i) => <MemberCard key={m._id || i} member={m} index={i} />)
              }
            </div>
          </div>

          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 12 }}>
              {[-1, 1].map((dir) => (
                <motion.button key={dir} whileHover={{ scale: 1.1, background: `${ROSE}22` }} whileTap={{ scale: 0.9 }}
                  onClick={() => scrollMembers(dir)}
                  style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowRight size={15} style={{ transform: dir === -1 ? 'rotate(180deg)' : 'none' }} />
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section style={{ padding: '100px 24px', background: NAVY, position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
          <motion.div animate={{ scale: [1, 1.22, 1], opacity: [0.12, 0.22, 0.12] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 620, height: 620, borderRadius: '50%', background: `radial-gradient(circle, ${ROSE}18, transparent 65%)`, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 620, margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div style={{ fontSize: 64, marginBottom: 24, lineHeight: 1 }}>💞</div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px, 4.5vw, 52px)', fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                Your Story Starts{' '}
                <span style={{ background: `linear-gradient(135deg, ${ROSE}, #FF6B9D)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Today</span>
              </h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 17, color: 'rgba(255,255,255,0.48)', lineHeight: 1.78, marginBottom: 40 }}>
                Join thousands of Ethiopians who have already found their connection. Free to start, always.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.button whileHover={{ scale: 1.05, y: -2, boxShadow: `0 18px 52px ${ROSE}55` }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/register')}
                  style={{ background: `linear-gradient(135deg, ${ROSE}, ${DROSE})`, border: 'none', color: '#fff', padding: '16px 44px', borderRadius: 50, fontSize: 16, fontWeight: 700, fontFamily: 'Inter, sans-serif', cursor: 'pointer', boxShadow: `0 8px 32px ${ROSE}44`, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Heart size={16} fill="#fff" /> Create Profile Free
                </motion.button>
                <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/browse')}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.18)', color: '#fff', padding: '16px 36px', borderRadius: 50, fontSize: 16, fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Users size={15} /> Browse Profiles
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
      <style>{`@keyframes skpulse{0%,100%{opacity:0.5}50%{opacity:1}} div::-webkit-scrollbar{display:none}`}</style>
    </PageWrapper>
  );
}
