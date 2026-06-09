import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import Card from '../../components/ui/Card';
import api from '../../services/api';
import toast from 'react-hot-toast';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(({ data }) => setStats(data.stats))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
        <div style={{ width: 40, height: 40, border: '3px solid #F0F0F0', borderTop: '3px solid #E91E8C', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const genderData = stats?.usersByGender?.map((g) => ({
    name: g._id.charAt(0).toUpperCase() + g._id.slice(1),
    value: g.count,
  })) || [];

  const monthlyData = stats?.paymentsByMonth?.map((m) => ({
    name: `${MONTH_NAMES[m._id.month - 1]} ${m._id.year}`,
    payments: m.count,
    revenue: m.revenue,
  })) || [];

  const COLORS = ['#E91E8C', '#1565C0'];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 30, color: '#0D1B2A', marginBottom: 4 }}>
          Statistics
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', color: '#9E9E9E', fontSize: 14, marginBottom: 28 }}>
          Platform analytics and trends
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        {/* Users by gender pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#0D1B2A', marginBottom: 20 }}>
              Users by Gender
            </h2>
            {genderData.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#9E9E9E', fontFamily: 'Inter, sans-serif', padding: 40 }}>No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={genderData} cx="50%" cy="50%" outerRadius={90}
                    dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#E0E0E0' }}>
                    {genderData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [v, 'Users']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </motion.div>

        {/* Payments by month bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ gridColumn: '1 / -1' }}>
          <Card>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#0D1B2A', marginBottom: 20 }}>
              Monthly Revenue (ETB)
            </h2>
            {monthlyData.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#9E9E9E', fontFamily: 'Inter, sans-serif', padding: 40 }}>No payment data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fontFamily: 'Inter, sans-serif', fill: '#9E9E9E' }} />
                  <YAxis tick={{ fontSize: 12, fontFamily: 'Inter, sans-serif', fill: '#9E9E9E' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', fontFamily: 'Inter, sans-serif' }}
                    formatter={(v, n) => [n === 'revenue' ? `${v} ETB` : v, n === 'revenue' ? 'Revenue' : 'Payments']}
                  />
                  <Bar dataKey="revenue" fill="#E91E8C" radius={[6, 6, 0, 0]} name="revenue" />
                  <Bar dataKey="payments" fill="#1565C0" radius={[6, 6, 0, 0]} name="payments" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
