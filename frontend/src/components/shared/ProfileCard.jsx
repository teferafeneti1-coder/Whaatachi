import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const GOAL_LABELS = {
  relationship: '❤️ Relationship',
  dating:       '💕 Dating',
  fwb:          '🤝 Friend With Benefits',
  casual:       '🔥 Casual',
};

export default function ProfileCard({ user, index = 0, onViewContact }) {
  const navigate = useNavigate();
  const imgSrc = user.photoUrl
    ? (user.photoUrl.startsWith('/') ? `http://localhost:5000${user.photoUrl}` : user.photoUrl)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ scale: 1.02, boxShadow: '0 20px 60px rgba(13,27,42,0.15)' }}
      style={{
        background: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(233,30,140,0.08)',
        cursor: 'pointer',
        transition: 'box-shadow 0.3s',
      }}
      onClick={() => navigate(`/profile/${user._id}`)}
    >
      {/* Photo */}
      <div style={{ aspectRatio: '3/4', overflow: 'hidden', position: 'relative' }}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={user.fullName}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'filter 0.3s' }}
            onMouseEnter={(e) => (e.target.style.filter = 'brightness(1.05)')}
            onMouseLeave={(e) => (e.target.style.filter = 'brightness(1)')}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #E91E8C22, #1565C022)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 64,
          }}>
            {user.gender === 'female' ? '👩' : '👨'}
          </div>
        )}

        {/* Goal chip overlay */}
        <div style={{ position: 'absolute', top: 12, left: 12 }}>
          <Badge variant="rose" style={{ fontSize: '11px' }}>
            {GOAL_LABELS[user.connectionGoal] || user.connectionGoal}
          </Badge>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '16px 16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 18, fontWeight: 700, color: '#0D1B2A', margin: 0 }}>
            {user.fullName}
          </h3>
          {user.age && (
            <span style={{ fontSize: 14, color: '#9E9E9E', fontFamily: 'Inter, sans-serif' }}>{user.age}</span>
          )}
        </div>

        <div style={{ marginBottom: 12 }}>
          <Badge variant="blue">
            {user.gender === 'female' ? '♀ Female' : '♂ Male'} · Ethiopia
          </Badge>
        </div>

        <Button
          fullWidth
          size="sm"
          onClick={(e) => { e.stopPropagation(); onViewContact(user); }}
          style={{ fontSize: 14 }}
        >
          View Contact
        </Button>
      </div>
    </motion.div>
  );
}
