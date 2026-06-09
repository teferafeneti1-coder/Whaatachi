import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageWrapper from '../components/layout/PageWrapper';
import api from '../services/api';
import {
  Camera, Heart, CheckCircle, Lock, User, Phone as PhoneIcon,
  AtSign, ArrowRight, Sparkles, Info, Shield,
} from 'lucide-react';

// ─── Design tokens ──────────────────────────────────────────────
const ROSE  = '#E91E8C';
const DROSE = '#C2185B';
const NAVY  = '#0D1B2A';
const BLUE  = '#1565C0';

const GOALS = [
  { id: 'relationship', emoji: '❤️', label: 'True Relationship', desc: 'Committed, lasting love', color: ROSE },
  { id: 'dating',       emoji: '💕', label: 'Dating',            desc: 'Get to know each other', color: ROSE },
  { id: 'fwb',         emoji: '☕', label: 'Friends w/ Benefits', desc: 'Comfortable chemistry', color: '#A855F7' },
  { id: 'casual',      emoji: '🔥', label: 'Casual',             desc: 'Fun and spontaneous', color: '#F97316' },
];

// ─── Animated step indicator ─────────────────────────────────────
function StepIndicator({ current, total }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, justifyContent: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <motion.div
            animate={{ scale: current === i + 1 ? 1.15 : 1 }}
            style={{
              width: current === i + 1 ? 32 : 10,
              height: 10, borderRadius: 5,
              background: i + 1 <= current
                ? `linear-gradient(135deg, ${ROSE}, ${DROSE})`
                : 'rgba(255,255,255,0.12)',
              transition: 'width 0.3s ease',
              boxShadow: current === i + 1 ? `0 0 12px ${ROSE}55` : 'none',
            }}
          />
          {i < total - 1 && <div style={{ width: 20, height: 1, background: i + 1 < current ? ROSE : 'rgba(255,255,255,0.12)', transition: 'background 0.3s' }} />}
        </div>
      ))}
    </div>
  );
}

// ─── Input component ─────────────────────────────────────────────
function DarkInput({ label, hint, error, icon: Icon, type = 'text', value, onChange, placeholder, required, optional, ...rest }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, color: focused ? '#fff' : 'rgba(255,255,255,0.7)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.2s' }}>
        {Icon && <Icon size={13} color={focused ? ROSE : 'rgba(255,255,255,0.4)'} style={{ transition: 'color 0.2s' }} />}
        {label}
        {optional && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', fontWeight: 400 }}>(optional)</span>}
      </label>
      <div style={{
        position: 'relative',
        background: 'rgba(255,255,255,0.04)',
        border: `1.5px solid ${error ? '#ef5350' : focused ? ROSE : 'rgba(255,255,255,0.1)'}`,
        borderRadius: 14, overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: focused ? `0 0 0 3px ${ROSE}18` : 'none',
      }}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder || label}
          required={required}
          style={{
            width: '100%', boxSizing: 'border-box',
            background: 'transparent', border: 'none', outline: 'none',
            padding: '13px 16px',
            color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: 15,
          }}
          {...rest}
        />
      </div>
      {error && <p style={{ fontSize: 12, color: '#ef5350', fontFamily: 'Inter, sans-serif', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}><Info size={11} /> {error}</p>}
      {hint && !error && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'Inter, sans-serif', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}><Lock size={10} /> {hint}</p>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN REGISTER COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: '', telegramUsername: '', phoneNumber: '',
    instagramUsername: '', age: '', gender: 'female', connectionGoal: '',
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const onDrop = useCallback((accepted) => {
    const file = accepted[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxFiles: 1,
  });

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.gender) e.gender = 'Please select your gender';
    if (!form.connectionGoal) e.connectionGoal = 'Please select what you\'re looking for';
    if (form.age && (isNaN(Number(form.age)) || Number(form.age) < 18 || Number(form.age) > 100)) e.age = 'Age must be 18–100';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      const e = {};
      if (!form.fullName.trim()) e.fullName = 'Full name is required';
      if (!form.gender) e.gender = 'Please select your gender';
      setErrors(e);
      if (Object.keys(e).length === 0) setStep(2);
    } else if (step === 2) {
      if (!form.connectionGoal) {
        setErrors({ connectionGoal: 'Please select what you\'re looking for' });
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (photo) fd.append('photo', photo);

      await api.post('/users/register', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Profile created! It will appear after admin approval.');
      navigate('/browse');
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg
        || err.response?.data?.message
        || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div style={{
        background: NAVY, minHeight: '100vh',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'center', padding: '48px 24px 60px',
      }}>
        {/* Background glows */}
        <div style={{ position: 'absolute', top: '-10%', left: '10%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${ROSE}0f, transparent 65%)`, filter: 'blur(44px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '5%', width: 420, height: 420, borderRadius: '50%', background: `radial-gradient(circle, ${BLUE}0f, transparent 65%)`, filter: 'blur(44px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.018, backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

        <div style={{ width: '100%', maxWidth: 540, position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: 'center', marginBottom: 36 }}
          >
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: `linear-gradient(135deg, ${ROSE}, ${DROSE} 55%, ${BLUE})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${ROSE}44` }}>
                <Heart size={20} color="#fff" fill="#fff" />
              </div>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 800, color: '#fff' }}>Whaatachi</span>
            </Link>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#fff', marginBottom: 8, letterSpacing: '-0.5px' }}>
              Create Your Profile
            </h1>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.45)', maxWidth: 380, margin: '0 auto' }}>
              Join thousands of real people across Ethiopia. Free to start.
            </p>
          </motion.div>

          {/* Step indicator */}
          <StepIndicator current={step} total={3} />

          {/* Form card */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 28,
              padding: '36px 32px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${ROSE}66, transparent)` }} />

            <form onSubmit={handleSubmit}>

              {/* ── STEP 1: Basic info + photo ── */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${ROSE}22`, border: `1px solid ${ROSE}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={15} color={ROSE} />
                    </div>
                    <div>
                      <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 17, fontWeight: 700, color: '#fff', margin: 0 }}>Basic Information</h2>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', fontFamily: 'Inter, sans-serif', margin: 0 }}>Step 1 of 3 — Your public profile</p>
                    </div>
                  </div>

                  <DarkInput
                    label="Full Name"
                    icon={User}
                    value={form.fullName}
                    onChange={(e) => set('fullName', e.target.value)}
                    error={errors.fullName}
                    required
                    placeholder="e.g. Selam Tesfaye"
                  />

                  <DarkInput
                    label="Age"
                    icon={Sparkles}
                    type="number"
                    value={form.age}
                    onChange={(e) => set('age', e.target.value)}
                    error={errors.age}
                    optional
                    placeholder="e.g. 25"
                    min={18}
                    max={100}
                  />

                  {/* Gender selection */}
                  <div style={{ marginBottom: 24 }}>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>Gender *</p>
                    <div style={{ display: 'flex', gap: 10 }}>
                      {[{ key: 'female', label: '♀ Female', color: ROSE }, { key: 'male', label: '♂ Male', color: BLUE }].map((g) => (
                        <motion.button
                          type="button"
                          key={g.key}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => set('gender', g.key)}
                          style={{
                            flex: 1, padding: '12px', borderRadius: 14, border: 'none', cursor: 'pointer',
                            background: form.gender === g.key ? `${g.color}22` : 'rgba(255,255,255,0.04)',
                            border: `1.5px solid ${form.gender === g.key ? g.color + '55' : 'rgba(255,255,255,0.1)'}`,
                            color: form.gender === g.key ? '#fff' : 'rgba(255,255,255,0.45)',
                            fontFamily: 'Inter, sans-serif', fontWeight: form.gender === g.key ? 700 : 500, fontSize: 15,
                            transition: 'all 0.2s',
                            boxShadow: form.gender === g.key ? `0 4px 16px ${g.color}30` : 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          }}
                        >
                          {form.gender === g.key && <CheckCircle size={14} color={g.color} />}
                          {g.label}
                        </motion.button>
                      ))}
                    </div>
                    {errors.gender && <p style={{ fontSize: 12, color: '#ef5350', fontFamily: 'Inter, sans-serif', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}><Info size={11} /> {errors.gender}</p>}
                  </div>

                  {/* Photo upload */}
                  <div style={{ marginBottom: 28 }}>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Camera size={13} color="rgba(255,255,255,0.4)" />
                      Profile Photo
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', fontWeight: 400 }}>(optional)</span>
                    </p>
                    <div
                      {...getRootProps()}
                      style={{
                        border: `2px dashed ${isDragActive ? ROSE : 'rgba(255,255,255,0.12)'}`,
                        borderRadius: 18, padding: 28, textAlign: 'center',
                        cursor: 'pointer', transition: 'all 0.2s',
                        background: isDragActive ? `${ROSE}08` : 'rgba(255,255,255,0.02)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${ROSE}55`; e.currentTarget.style.background = `${ROSE}06`; }}
                      onMouseLeave={(e) => { if (!isDragActive) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; } }}
                    >
                      <input {...getInputProps()} />
                      {preview ? (
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <img src={preview} alt="preview" style={{ width: 110, height: 110, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${ROSE}`, boxShadow: `0 0 0 5px ${ROSE}20` }} />
                          <div style={{ position: 'absolute', bottom: 4, right: 4, width: 28, height: 28, borderRadius: '50%', background: ROSE, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 8px ${ROSE}66` }}>
                            <Camera size={13} color="#fff" />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ width: 56, height: 56, borderRadius: '50%', background: `${ROSE}14`, border: `1.5px solid ${ROSE}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                            <Camera size={22} color={ROSE} />
                          </div>
                          <p style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 4 }}>
                            {isDragActive ? 'Drop your photo here' : 'Drag & drop or click to upload'}
                          </p>
                          <p style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>
                            JPG, PNG, WEBP · Max 5 MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02, y: -1, boxShadow: `0 14px 40px ${ROSE}44` }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNextStep}
                    style={{ width: '100%', background: `linear-gradient(135deg, ${ROSE}, ${DROSE})`, border: 'none', color: '#fff', padding: '15px', borderRadius: 50, fontSize: 16, fontWeight: 700, fontFamily: 'Inter, sans-serif', cursor: 'pointer', boxShadow: `0 8px 28px ${ROSE}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    Continue <ArrowRight size={16} />
                  </motion.button>
                </motion.div>
              )}

              {/* ── STEP 2: Connection goal ── */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${ROSE}22`, border: `1px solid ${ROSE}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Heart size={15} color={ROSE} />
                    </div>
                    <div>
                      <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 17, fontWeight: 700, color: '#fff', margin: 0 }}>What are you here for?</h2>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', fontFamily: 'Inter, sans-serif', margin: 0 }}>Step 2 of 3 — Your intent</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 10 }}>
                    {GOALS.map((g) => (
                      <motion.button
                        type="button"
                        key={g.id}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => set('connectionGoal', g.id)}
                        style={{
                          padding: '18px 14px', borderRadius: 18, border: 'none', cursor: 'pointer', textAlign: 'left',
                          background: form.connectionGoal === g.id ? `${g.color}1e` : 'rgba(255,255,255,0.04)',
                          border: `1.5px solid ${form.connectionGoal === g.id ? g.color + '55' : 'rgba(255,255,255,0.1)'}`,
                          transition: 'all 0.2s',
                          boxShadow: form.connectionGoal === g.id ? `0 6px 20px ${g.color}25` : 'none',
                          position: 'relative',
                        }}
                        onMouseEnter={(e) => { if (form.connectionGoal !== g.id) e.currentTarget.style.borderColor = `${g.color}33`; }}
                        onMouseLeave={(e) => { if (form.connectionGoal !== g.id) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                      >
                        {form.connectionGoal === g.id && (
                          <div style={{ position: 'absolute', top: 10, right: 10 }}>
                            <CheckCircle size={14} color={g.color} fill={`${g.color}22`} />
                          </div>
                        )}
                        <div style={{ fontSize: 28, marginBottom: 8 }}>{g.emoji}</div>
                        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 700, color: form.connectionGoal === g.id ? '#fff' : 'rgba(255,255,255,0.7)', marginBottom: 3 }}>
                          {g.label}
                        </div>
                        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>
                          {g.desc}
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {errors.connectionGoal && (
                    <p style={{ fontSize: 12, color: '#ef5350', fontFamily: 'Inter, sans-serif', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Info size={11} /> {errors.connectionGoal}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      style={{ flex: '0 0 auto', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.65)', padding: '14px 22px', borderRadius: 50, fontSize: 15, fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}
                    >
                      ← Back
                    </button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02, y: -1, boxShadow: `0 14px 40px ${ROSE}44` }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNextStep}
                      style={{ flex: 1, background: `linear-gradient(135deg, ${ROSE}, ${DROSE})`, border: 'none', color: '#fff', padding: '14px', borderRadius: 50, fontSize: 16, fontWeight: 700, fontFamily: 'Inter, sans-serif', cursor: 'pointer', boxShadow: `0 8px 28px ${ROSE}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    >
                      Continue <ArrowRight size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: Private contact info ── */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${BLUE}22`, border: `1px solid ${BLUE}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Lock size={15} color={BLUE} />
                    </div>
                    <div>
                      <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 17, fontWeight: 700, color: '#fff', margin: 0 }}>Private Contact Info</h2>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', fontFamily: 'Inter, sans-serif', margin: 0 }}>Step 3 of 3 — Optional but recommended</p>
                    </div>
                  </div>

                  {/* Privacy notice */}
                  <div style={{ background: `${BLUE}12`, border: `1px solid ${BLUE}28`, borderRadius: 14, padding: '14px 16px', marginBottom: 24, display: 'flex', gap: 10 }}>
                    <Lock size={14} color={BLUE} style={{ flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0 }}>
                      These fields are <strong style={{ color: '#fff' }}>completely private</strong>. They're only visible to members who have paid for access. You can skip them or add them now.
                    </p>
                  </div>

                  <DarkInput
                    label="Telegram Username"
                    icon={AtSign}
                    value={form.telegramUsername}
                    onChange={(e) => set('telegramUsername', e.target.value)}
                    hint="Only shown after payment authorization"
                    optional
                    placeholder="@yourusername"
                  />

                  <DarkInput
                    label="Phone Number"
                    icon={PhoneIcon}
                    type="tel"
                    value={form.phoneNumber}
                    onChange={(e) => set('phoneNumber', e.target.value)}
                    hint="Only shown after payment authorization"
                    optional
                    placeholder="+251 9XX XXX XXXX"
                  />

                  <DarkInput
                    label="Instagram Username"
                    icon={AtSign}
                    value={form.instagramUsername}
                    onChange={(e) => set('instagramUsername', e.target.value)}
                    hint="Only shown after payment authorization"
                    optional
                    placeholder="@yourinstagram"
                  />

                  {/* Submit */}
                  <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      style={{ flex: '0 0 auto', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.65)', padding: '14px 22px', borderRadius: 50, fontSize: 15, fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}
                    >
                      ← Back
                    </button>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={!loading ? { scale: 1.02, y: -1, boxShadow: `0 14px 40px ${ROSE}44` } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                      style={{
                        flex: 1, background: loading ? 'rgba(233,30,140,0.4)' : `linear-gradient(135deg, ${ROSE}, ${DROSE})`,
                        border: 'none', color: '#fff', padding: '14px', borderRadius: 50,
                        fontSize: 16, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        boxShadow: loading ? 'none' : `0 8px 28px ${ROSE}44`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      {loading ? (
                        <>
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                          Creating Profile…
                        </>
                      ) : (
                        <>
                          <Heart size={15} fill="#fff" />
                          Create My Profile
                        </>
                      )}
                    </motion.button>
                  </div>

                  <p style={{ textAlign: 'center', marginTop: 14, fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>
                    🔒 Your contact info is encrypted and never shown without authorization
                  </p>
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Bottom sign-in link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ textAlign: 'center', marginTop: 20, fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.35)' }}
          >
            Already have a profile?{' '}
            <Link to="/browse" style={{ color: ROSE, fontWeight: 600, textDecoration: 'none' }}>Browse Members →</Link>
          </motion.p>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            style={{ display: 'flex', justifyContent: 'center', gap: 22, marginTop: 24, flexWrap: 'wrap' }}
          >
            {[{ icon: Shield, text: 'Safe & Secure' }, { icon: CheckCircle, text: 'Verified Platform' }, { icon: Heart, text: 'Free to Join' }].map(({ icon: I, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <I size={12} color={ROSE} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.32)' }}>{text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
