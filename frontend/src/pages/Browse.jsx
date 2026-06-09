import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Search, SlidersHorizontal, MapPin, Heart, Users, Filter,
  ChevronDown, Star, Shield, CheckCircle, RefreshCw, ArrowRight,
  Flame, Coffee, Handshake,
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import ProfileCard from '../components/shared/ProfileCard';
import PaymentModal from '../components/shared/PaymentModal';
import ContactReveal from '../components/shared/ContactReveal';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { useProfiles } from '../hooks/useProfiles';
import { useApp } from '../context/AppContext';
import { usePayment } from '../hooks/usePayment';

// ─── Design tokens ──────────────────────────────────────────────
const ROSE  = '#E91E8C';
const DROSE = '#C2185B';
const NAVY  = '#0D1B2A';
const BLUE  = '#1565C0';

const GOALS = [
  { id: '', label: 'All Goals', emoji: '✨', color: 'rgba(255,255,255,0.5)' },
  { id: 'relationship', label: 'Relationship', emoji: '❤️', color: ROSE },
  { id: 'dating', label: 'Dating', emoji: '💕', color: ROSE },
  { id: 'fwb', label: 'Friends w/ Benefits', emoji: '☕', color: '#A855F7' },
  { id: 'casual', label: 'Casual', emoji: '🔥', color: '#F97316' },
  { id: 'friendship', label: 'Friendship', emoji: '🤝', color: BLUE },
];

const AGE_RANGES = [
  { id: '', label: 'Any Age' },
  { id: '18-24', label: '18 – 24' },
  { id: '25-30', label: '25 – 30' },
  { id: '31-40', label: '31 – 40' },
  { id: '40+', label: '40+' },
];

// ─── Filter chip ────────────────────────────────────────────────
function FilterChip({ active, onClick, children, color = ROSE }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        padding: '8px 16px', borderRadius: 50, border: 'none', cursor: 'pointer',
        background: active ? `linear-gradient(135deg, ${color}, ${color}cc)` : 'rgba(255,255,255,0.05)',
        color: active ? '#fff' : 'rgba(255,255,255,0.55)',
        fontFamily: 'Inter, sans-serif', fontWeight: active ? 700 : 500, fontSize: 13,
        transition: 'all 0.2s',
        boxShadow: active ? `0 4px 14px ${color}40` : 'none',
        border: active ? 'none' : '1px solid rgba(255,255,255,0.1)',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
        }
      }}
    >
      {children}
    </motion.button>
  );
}

// ─── Card skeleton ───────────────────────────────────────────────
function CardSkeleton({ i }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: i * 0.05 }}
      style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div style={{ aspectRatio: '3/4', background: 'rgba(255,255,255,0.06)', animation: 'skpulse 1.5s ease-in-out infinite' }} />
      <div style={{ padding: 16 }}>
        <div style={{ height: 16, background: 'rgba(255,255,255,0.07)', borderRadius: 8, marginBottom: 10, width: '65%', animation: 'skpulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: 34, background: 'rgba(255,255,255,0.05)', borderRadius: 50, animation: 'skpulse 1.5s ease-in-out infinite' }} />
      </div>
      <style>{`@keyframes skpulse{0%,100%{opacity:.5}50%{opacity:1}}`}</style>
    </motion.div>
  );
}

// ─── Sidebar section ─────────────────────────────────────────────
function SideSection({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ display: 'inline-block', width: 14, height: 1.5, background: ROSE, borderRadius: 2 }} />
        {title}
      </p>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN BROWSE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { selectedGender, setSelectedGender, isUnlocked } = useApp();
  const { getContact } = usePayment();

  const [gender, setGender] = useState(searchParams.get('gender') || selectedGender || 'female');
  const [goal, setGoal] = useState(searchParams.get('goal') || '');
  const [ageRange, setAgeRange] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactData, setContactData] = useState(null);

  const { profiles, loading, error, total, page, pages, fetchProfiles } = useProfiles(
    { gender: gender || undefined, goal: goal || undefined }
  );

  const updateFilter = (g, gl) => {
    setGender(g);
    setGoal(gl);
    setSearchParams({ gender: g, ...(gl ? { goal: gl } : {}) });
    setSelectedGender(g);
  };

  const handleViewContact = async (user) => {
    if (user.gender === 'male') {
      const result = await getContact(user._id);
      if (result.success) { setContactData(result.user); setSelectedUser(user); setContactModalOpen(true); }
      return;
    }
    if (isUnlocked(user._id)) {
      const result = await getContact(user._id);
      if (result.success) { setContactData(result.user); setSelectedUser(user); setContactModalOpen(true); }
      return;
    }
    setSelectedUser(user);
    setPayModalOpen(true);
  };

  const onPaymentSuccess = (contact) => {
    setContactData(contact);
    setContactModalOpen(true);
    setPayModalOpen(false);
  };

  const clearAllFilters = () => {
    updateFilter('female', '');
    setAgeRange('');
    setSearchQuery('');
  };

  const activeFilterCount = [gender && gender !== 'female', goal, ageRange].filter(Boolean).length;

  // Filter profiles by search query client-side
  const displayedProfiles = searchQuery.trim()
    ? profiles.filter((p) => p.fullName?.toLowerCase().includes(searchQuery.toLowerCase()))
    : profiles;

  return (
    <PageWrapper>
      <div style={{ background: NAVY, minHeight: '100vh' }}>

        {/* ── Top search bar ── */}
        <div style={{
          background: 'rgba(10, 20, 36, 0.98)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '14px 24px',
          position: 'sticky',
          top: 68,
          zIndex: 100,
        }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            {/* Search input */}
            <div style={{ flex: '1 1 280px', position: 'relative', maxWidth: 380 }}>
              <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', pointerEvents: 'none' }} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name…"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 50, padding: '10px 16px 10px 38px',
                  color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: 14, outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = `${ROSE}66`}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0 }}>
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Gender toggle */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 50, padding: 3, gap: 2 }}>
              {['female', 'male'].map((g) => (
                <button key={g} onClick={() => updateFilter(g, goal)} style={{
                  padding: '8px 18px', borderRadius: 50, border: 'none', cursor: 'pointer',
                  background: gender === g ? `linear-gradient(135deg, ${ROSE}, ${DROSE})` : 'transparent',
                  color: gender === g ? '#fff' : 'rgba(255,255,255,0.5)',
                  fontFamily: 'Inter, sans-serif', fontWeight: gender === g ? 700 : 500, fontSize: 13,
                  transition: 'all 0.2s', boxShadow: gender === g ? `0 4px 14px ${ROSE}40` : 'none',
                }}>
                  {g === 'female' ? '♀ Women' : '♂ Men'}
                </button>
              ))}
            </div>

            {/* Filter toggle button (mobile / sidebar) */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: sidebarOpen ? `${ROSE}18` : 'rgba(255,255,255,0.05)',
                border: `1px solid ${sidebarOpen ? ROSE + '44' : 'rgba(255,255,255,0.1)'}`,
                color: sidebarOpen ? ROSE : 'rgba(255,255,255,0.7)',
                padding: '9px 18px', borderRadius: 50,
                fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span style={{ background: ROSE, color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>
                  {activeFilterCount}
                </span>
              )}
            </motion.button>

            {/* Result count */}
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.4)', marginLeft: 'auto' }}>
              {loading ? 'Loading…' : `${displayedProfiles.length} found`}
            </span>
          </div>

          {/* Inline goal filter row */}
          <div style={{ maxWidth: 1280, margin: '10px auto 0', display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
            {GOALS.map((g) => (
              <FilterChip
                key={g.id}
                active={goal === g.id}
                onClick={() => updateFilter(gender, goal === g.id ? '' : g.id)}
                color={g.color || ROSE}
              >
                {g.emoji} {g.label}
              </FilterChip>
            ))}
            {(goal || ageRange) && (
              <FilterChip active={false} onClick={clearAllFilters} color="#6B7280">
                <RefreshCw size={11} style={{ display: 'inline', marginRight: 4 }} />
                Clear
              </FilterChip>
            )}
          </div>
        </div>

        {/* ── Main layout: sidebar + grid ── */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 24px', display: 'flex', gap: 28, alignItems: 'flex-start' }}>

          {/* Sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0, x: -20 }}
                animate={{ width: 270, opacity: 1, x: 0 }}
                exit={{ width: 0, opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ flexShrink: 0, overflow: 'hidden' }}
              >
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 22,
                  padding: '24px 20px',
                  position: 'sticky',
                  top: 160,
                }}>
                  {/* Sidebar header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>
                      Filters
                    </h3>
                    {activeFilterCount > 0 && (
                      <button onClick={clearAllFilters} style={{ background: 'none', border: 'none', color: ROSE, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600 }}>
                        Clear all
                      </button>
                    )}
                  </div>

                  {/* Who I'm looking for */}
                  <SideSection title="Looking for">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {[
                        { key: 'female', label: '♀ Women', color: ROSE },
                        { key: 'male', label: '♂ Men', color: BLUE },
                      ].map((g) => (
                        <motion.button
                          key={g.key}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => updateFilter(g.key, goal)}
                          style={{
                            padding: '10px 16px', borderRadius: 12, border: 'none', cursor: 'pointer', textAlign: 'left',
                            background: gender === g.key ? `${g.color}18` : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${gender === g.key ? g.color + '44' : 'rgba(255,255,255,0.08)'}`,
                            color: gender === g.key ? '#fff' : 'rgba(255,255,255,0.5)',
                            fontFamily: 'Inter, sans-serif', fontWeight: gender === g.key ? 700 : 500, fontSize: 14,
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            transition: 'all 0.2s',
                          }}
                        >
                          {g.label}
                          {gender === g.key && <CheckCircle size={14} color={g.color} />}
                        </motion.button>
                      ))}
                    </div>
                  </SideSection>

                  {/* Goal */}
                  <SideSection title="Connection Goal">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {GOALS.map((g) => (
                        <motion.button
                          key={g.id}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => updateFilter(gender, goal === g.id ? '' : g.id)}
                          style={{
                            padding: '9px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'left',
                            background: goal === g.id ? `${g.color || ROSE}18` : 'transparent',
                            color: goal === g.id ? '#fff' : 'rgba(255,255,255,0.45)',
                            fontFamily: 'Inter, sans-serif', fontWeight: goal === g.id ? 600 : 400, fontSize: 13,
                            display: 'flex', alignItems: 'center', gap: 8,
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => { if (goal !== g.id) e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                          onMouseLeave={(e) => { if (goal !== g.id) e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = goal === g.id ? `${g.color || ROSE}18` : 'transparent'; }}
                        >
                          <span>{g.emoji}</span>
                          {g.label}
                          {goal === g.id && <CheckCircle size={12} color={g.color || ROSE} style={{ marginLeft: 'auto' }} />}
                        </motion.button>
                      ))}
                    </div>
                  </SideSection>

                  {/* Age range */}
                  <SideSection title="Age Range">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {AGE_RANGES.map((a) => (
                        <button
                          key={a.id}
                          onClick={() => setAgeRange(a.id === ageRange ? '' : a.id)}
                          style={{
                            padding: '6px 14px', borderRadius: 50, border: 'none', cursor: 'pointer',
                            background: ageRange === a.id ? `${ROSE}22` : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${ageRange === a.id ? ROSE + '55' : 'rgba(255,255,255,0.08)'}`,
                            color: ageRange === a.id ? ROSE : 'rgba(255,255,255,0.45)',
                            fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: ageRange === a.id ? 700 : 500,
                            transition: 'all 0.2s',
                          }}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  </SideSection>

                  {/* Divider */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', margin: '4px 0 20px' }} />

                  {/* Browse CTA */}
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/register')}
                    style={{
                      width: '100%',
                      background: `linear-gradient(135deg, ${ROSE}, ${DROSE})`,
                      border: 'none', color: '#fff', padding: '12px',
                      borderRadius: 12, fontSize: 14, fontWeight: 700,
                      fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                      boxShadow: `0 6px 20px ${ROSE}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}
                  >
                    <Heart size={14} fill="#fff" />
                    Create Your Profile
                  </motion.button>

                  {/* Verified badge */}
                  <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'center' }}>
                    <Shield size={12} color={BLUE} />
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'Inter, sans-serif' }}>All profiles are verified</span>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Active filter pills */}
            {(goal || ageRange) && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}
              >
                {goal && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${ROSE}18`, border: `1px solid ${ROSE}33`, borderRadius: 50, padding: '5px 12px 5px 14px', fontSize: 12, fontWeight: 600, color: ROSE, fontFamily: 'Inter, sans-serif' }}>
                    {GOALS.find((g) => g.id === goal)?.emoji} {GOALS.find((g) => g.id === goal)?.label}
                    <button onClick={() => updateFilter(gender, '')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: ROSE, padding: 0, display: 'flex', alignItems: 'center' }}>
                      <X size={11} />
                    </button>
                  </div>
                )}
                {ageRange && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${BLUE}18`, border: `1px solid ${BLUE}33`, borderRadius: 50, padding: '5px 12px 5px 14px', fontSize: 12, fontWeight: 600, color: BLUE, fontFamily: 'Inter, sans-serif' }}>
                    🎂 {AGE_RANGES.find((a) => a.id === ageRange)?.label}
                    <button onClick={() => setAgeRange('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: BLUE, padding: 0, display: 'flex', alignItems: 'center' }}>
                      <X size={11} />
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Grid */}
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
                {Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} i={i} />)}
              </div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: 'center', padding: '80px 0' }}
              >
                <div style={{ fontSize: 52, marginBottom: 16 }}>😕</div>
                <p style={{ fontFamily: 'Inter, sans-serif', color: '#ef5350', marginBottom: 16 }}>{error}</p>
                <button
                  onClick={() => fetchProfiles(1)}
                  style={{ background: `linear-gradient(135deg, ${ROSE}, ${DROSE})`, border: 'none', color: '#fff', padding: '12px 28px', borderRadius: 50, fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                >
                  Try Again
                </button>
              </motion.div>
            ) : displayedProfiles.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', padding: '80px 0' }}
              >
                <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: '#fff', marginBottom: 8 }}>
                  No profiles found
                </h3>
                <p style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.4)', marginBottom: 24, fontSize: 15 }}>
                  Try adjusting your filters or check back soon.
                </p>
                <button
                  onClick={clearAllFilters}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.18)', color: '#fff', padding: '12px 28px', borderRadius: 50, fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
                  <AnimatePresence>
                    {displayedProfiles.map((user, i) => (
                      <motion.div
                        key={user._id}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ delay: Math.min(i * 0.05, 0.35), ease: [0.22, 1, 0.36, 1] }}
                      >
                        <ProfileCard
                          user={user}
                          index={i}
                          onViewContact={handleViewContact}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 44 }}>
                    <button
                      onClick={() => fetchProfiles(page - 1)}
                      disabled={page <= 1}
                      style={{ background: page <= 1 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: page <= 1 ? 'rgba(255,255,255,0.2)' : '#fff', padding: '9px 20px', borderRadius: 50, fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, cursor: page <= 1 ? 'default' : 'pointer' }}
                    >
                      ← Prev
                    </button>
                    <span style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.4)', fontSize: 13, padding: '0 16px' }}>
                      Page {page} of {pages}
                    </span>
                    <button
                      onClick={() => fetchProfiles(page + 1)}
                      disabled={page >= pages}
                      style={{ background: page >= pages ? 'rgba(255,255,255,0.03)' : `linear-gradient(135deg, ${ROSE}, ${DROSE})`, border: 'none', color: page >= pages ? 'rgba(255,255,255,0.2)' : '#fff', padding: '9px 20px', borderRadius: 50, fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, cursor: page >= pages ? 'default' : 'pointer', boxShadow: page >= pages ? 'none' : `0 4px 16px ${ROSE}40` }}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Register CTA banner */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            margin: '0 24px 48px',
            background: `linear-gradient(135deg, ${ROSE}18, ${BLUE}12)`,
            border: `1px solid ${ROSE}25`,
            borderRadius: 20, padding: '28px 32px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 20, maxWidth: 1280 - 48, marginLeft: 'auto', marginRight: 'auto',
          }}
        >
          <div>
            <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
              Create your profile and get discovered
            </h4>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>
              Women join for free. Men unlock for 200 Birr.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/register')}
            style={{ background: `linear-gradient(135deg, ${ROSE}, ${DROSE})`, border: 'none', color: '#fff', padding: '13px 30px', borderRadius: 50, fontSize: 15, fontWeight: 700, fontFamily: 'Inter, sans-serif', cursor: 'pointer', boxShadow: `0 6px 22px ${ROSE}44`, display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}
          >
            <Heart size={15} fill="#fff" />
            Join Whaatachi Free <ArrowRight size={14} />
          </motion.button>
        </motion.div>
      </div>

      {/* Payment modal */}
      <PaymentModal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        user={selectedUser}
        onSuccess={onPaymentSuccess}
      />

      {/* Contact reveal modal */}
      <Modal
        isOpen={contactModalOpen}
        onClose={() => { setContactModalOpen(false); setContactData(null); }}
        title="Contact Information"
      >
        {selectedUser && contactData && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              {contactData.photoUrl ? (
                <img
                  src={contactData.photoUrl.startsWith('/') ? `http://localhost:5000${contactData.photoUrl}` : contactData.photoUrl}
                  alt={contactData.fullName}
                  style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${ROSE}` }}
                />
              ) : (
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: `linear-gradient(135deg, ${ROSE}, ${BLUE})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 700 }}>
                  {contactData.fullName?.[0]}
                </div>
              )}
              <div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#0D1B2A', margin: 0 }}>{contactData.fullName}</h3>
                {contactData.age && <p style={{ color: '#9E9E9E', fontSize: 13, fontFamily: 'Inter, sans-serif', margin: '2px 0 0' }}>Age {contactData.age}</p>}
              </div>
            </div>
            <ContactReveal contact={contactData} />
          </div>
        )}
      </Modal>
    </PageWrapper>
  );
}
