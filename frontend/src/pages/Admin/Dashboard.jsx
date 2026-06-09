import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle, DollarSign, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import api from '../../services/api';
import toast from 'react-hot-toast';

function StatCard({ icon: Icon, label, value, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card hoverable style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '24px' }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: `linear-gradient(135deg, ${color}22, ${color}44)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={24} color={color} />
        </div>
        <div>
          <div style={{
            fontFamily: 'Playfair Display, serif', fontSize: 36,
            fontWeight: 700, color: '#0D1B2A', lineHeight: 1,
          }}>
            {value !== undefined ? value.toLocaleString() : '—'}
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#9E9E9E', marginTop: 4 }}>
            {label}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(({ data }) => setStats(data.stats))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { icon: Users,       label: 'Total Users',      value: stats?.totalUsers,    color: '#E91E8C' },
    { icon: CheckCircle, label: 'Active Profiles',  value: stats?.approvedUsers, color: '#2E7D32' },
    { icon: DollarSign,  label: 'Revenue (ETB)',    value: stats?.totalRevenue,  color: '#1565C0' },
    { icon: Clock,       label: 'Pending Payments', value: stats?.pendingPayments, color: '#F57F17' },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 30, color: '#0D1B2A', marginBottom: 4 }}>
          Dashboard
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', color: '#9E9E9E', fontSize: 14, marginBottom: 32 }}>
          Platform overview and key metrics
        </p>
      </motion.div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ height: 100, background: '#fff', borderRadius: 16, animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {cards.map((c, i) => <StatCard key={c.label} {...c} index={i} />)}
        </div>
      )}

      {/* Quick summary */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: 32 }}
        >
          <Card>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#0D1B2A', marginBottom: 20 }}>
              Users by Gender
            </h2>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {stats.usersByGender?.map((g) => (
                <div key={g._id} style={{
                  flex: 1, minWidth: 120, background: '#F8F9FA', borderRadius: 12, padding: '16px 20px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{g._id === 'female' ? '♀' : '♂'}</div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: '#0D1B2A' }}>
                    {g.count}
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#9E9E9E', textTransform: 'capitalize' }}>
                    {g._id}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}
