import { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { usePayment } from '../../hooks/usePayment';
import toast from 'react-hot-toast';

export default function PaymentModal({ isOpen, onClose, user, onSuccess }) {
  const [method, setMethod] = useState('telebirr');
  const [step, setStep] = useState('select'); // 'select' | 'success'
  const { initiatePayment, confirmPayment, loading } = usePayment();

  const handleConfirm = async () => {
    const init = await initiatePayment(user._id, method);
    if (!init.success && !init.alreadyPaid) {
      toast.error(init.message || 'Payment initiation failed');
      return;
    }

    // If already paid or for demo — confirm immediately
    let contact;
    if (init.alreadyPaid) {
      // Already has verified payment — fetch contact directly
      const payerInfo = localStorage.getItem('payerId') || '';
      const result = await fetch(
        `http://localhost:5000/api/users/${user._id}/contact?payerInfo=${encodeURIComponent(payerInfo)}`
      ).then((r) => r.json());
      contact = result.user;
    } else {
      const confirmed = await confirmPayment(init.paymentId, user._id);
      if (!confirmed.success) {
        toast.error(confirmed.message || 'Confirmation failed');
        return;
      }
      contact = confirmed.contact;
    }

    setStep('success');
    setTimeout(() => {
      onSuccess(contact);
      onClose();
      setStep('select');
    }, 2000);
  };

  const methods = [
    { id: 'telebirr', label: 'Telebirr', emoji: '📱', desc: 'Pay with Telebirr mobile money' },
    { id: 'cbe',      label: 'CBE Birr',  emoji: '🏦', desc: 'Pay with Commercial Bank of Ethiopia' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Unlock Contact Info">
      {step === 'select' ? (
        <div>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 48, fontWeight: 800,
              background: 'linear-gradient(135deg, #E91E8C, #C2185B)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              200 ETB
            </div>
            <p style={{ color: '#9E9E9E', fontSize: 14, fontFamily: 'Inter, sans-serif', marginTop: 4 }}>
              One-time payment to unlock contact details
            </p>
            {user && (
              <p style={{ color: '#0D1B2A', fontSize: 15, fontWeight: 600, fontFamily: 'Inter, sans-serif', marginTop: 8 }}>
                for {user.fullName}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {methods.map((m) => (
              <motion.div
                key={m.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setMethod(m.id)}
                style={{
                  border: `2px solid ${method === m.id ? '#E91E8C' : '#E0E0E0'}`,
                  borderRadius: 12,
                  padding: '16px 20px',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 16,
                  background: method === m.id ? 'rgba(233,30,140,0.04)' : '#fff',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ fontSize: 28 }}>{m.emoji}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16, fontFamily: 'Inter, sans-serif', color: '#0D1B2A' }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: 13, color: '#9E9E9E', fontFamily: 'Inter, sans-serif' }}>{m.desc}</div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    border: `2px solid ${method === m.id ? '#E91E8C' : '#E0E0E0'}`,
                    background: method === m.id ? '#E91E8C' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {method === m.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <Button fullWidth loading={loading} onClick={handleConfirm}>
            Confirm Payment →
          </Button>
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <button onClick={onClose} style={{
              background: 'none', border: 'none', color: '#9E9E9E',
              fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <svg width="80" height="80" viewBox="0 0 80 80" style={{ margin: '0 auto 16px' }}>
              <circle cx="40" cy="40" r="38" fill="none" stroke="#E91E8C" strokeWidth="3" />
              <motion.path
                d="M22 40 L34 52 L58 28"
                fill="none" stroke="#E91E8C" strokeWidth="4"
                strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
            </svg>
          </motion.div>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#0D1B2A', marginBottom: 8 }}>
            Payment Confirmed!
          </h3>
          <p style={{ color: '#9E9E9E', fontSize: 14, fontFamily: 'Inter, sans-serif' }}>
            Contact info is now unlocked.
          </p>
        </div>
      )}
    </Modal>
  );
}
