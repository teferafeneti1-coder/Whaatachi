import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ContactReveal from '../components/shared/ContactReveal';
import PaymentModal from '../components/shared/PaymentModal';
import api from '../services/api';
import { usePayment } from '../hooks/usePayment';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const GOAL_LABELS = {
  relationship: '❤️ Relationship',
  dating:       '💕 Dating',
  fwb:          '🤝 Friend With Benefits',
  casual:       '🔥 Casual Connections',
};

export default function ProfileDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getContact, loading: payLoading } = usePayment();
  const { isUnlocked, payerId } = useApp();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactData, setContactData] = useState(null);
  const [payModalOpen, setPayModalOpen] = useState(false);

  useEffect(() => {
    api.get(`/users/${id}/public`)
      .then(({ data }) => setUser(data.user))
      .catch(() => toast.error('Profile not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleContactClick = async () => {
    if (!user) return;

    // Men are free
    if (user.gender === 'male') {
      const result = await getContact(id);
      if (result.success) setContactData(result.user);
      return;
    }

    if (isUnlocked(id)) {
      const result = await getContact(id);
      if (result.success) setContactData(result.user);
      return;
    }

    setPayModalOpen(true);
  };

  const onPaymentSuccess = (contact) => {
    setContactData(contact);
    setPayModalOpen(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{
          width: 40, height: 40, border: '3px solid #F0F0F0',
          borderTop: '3px solid #E91E8C', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#0D1B2A', marginBottom: 16 }}>
          Profile not found
        </h2>
        <Button onClick={() => navigate('/browse')}>Back to Browse</Button>
      </div>
    );
  }

  const imgSrc = user.photoUrl
    ? (user.photoUrl.startsWith('/') ? `http://localhost:5000${user.photoUrl}` : user.photoUrl)
    : null;

  return (
    <PageWrapper>
      <div style={{ background: '#F8F9FA', minHeight: '100vh', padding: '40px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {/* Back link */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/browse')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              color: '#1565C0', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 15,
              marginBottom: 24,
            }}
          >
            <ArrowLeft size={18} />
            Back to Browse
          </motion.button>

          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 32 }}>
              {/* Profile photo */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                style={{
                  width: 340, height: 340, borderRadius: 20, overflow: 'hidden',
                  marginBottom: 24, border: '3px solid rgba(233,30,140,0.3)',
                  boxShadow: '0 0 0 6px rgba(233,30,140,0.08)',
                  maxWidth: '100%',
                }}
              >
                {imgSrc ? (
                  <img src={imgSrc} alt={user.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    background: 'linear-gradient(135deg, #E91E8C22, #1565C022)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 80,
                  }}>
                    {user.gender === 'female' ? '👩' : '👨'}
                  </div>
                )}
              </motion.div>

              {/* Name */}
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, color: '#0D1B2A', marginBottom: 12 }}>
                {user.fullName}
              </h1>

              {/* Badges */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 16 }}>
                <Badge variant="blue">
                  {user.gender === 'female' ? '♀ Female' : '♂ Male'} · Ethiopia
                </Badge>
                {user.age && <Badge variant="gray">Age {user.age}</Badge>}
                {user.connectionGoal && (
                  <Badge variant="rose">{GOAL_LABELS[user.connectionGoal]}</Badge>
                )}
              </div>
            </div>

            {/* Contact section */}
            <div>
              {contactData ? (
                <div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#0D1B2A', marginBottom: 16, textAlign: 'center' }}>
                    Contact Information
                  </h3>
                  <ContactReveal contact={contactData} />

                  {/* Contact Now button (deep link to Telegram if available) */}
                  {contactData.telegramUsername && (
                    <a
                      href={`https://t.me/${contactData.telegramUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'block', marginTop: 20 }}
                    >
                      <Button fullWidth size="lg">
                        Contact Now →
                      </Button>
                    </a>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <p style={{
                    fontFamily: 'Inter, sans-serif', color: '#9E9E9E', fontSize: 14,
                    marginBottom: 20, lineHeight: 1.6,
                  }}>
                    {user.gender === 'female'
                      ? 'Unlock this profile to see contact details (200 ETB)'
                      : 'Click below to reveal contact details for free'}
                  </p>
                  <Button fullWidth size="lg" loading={payLoading} onClick={handleContactClick}>
                    {user.gender === 'female' ? '🔒 Unlock Contact — 200 ETB' : 'View Contact →'}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <PaymentModal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        user={user}
        onSuccess={onPaymentSuccess}
      />
    </PageWrapper>
  );
}
