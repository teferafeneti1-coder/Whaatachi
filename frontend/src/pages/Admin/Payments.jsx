import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState({});

  const fetch = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/payments?page=${p}&limit=20`);
      setPayments(data.payments);
      setTotal(data.total);
      setPage(data.page);
      setPages(data.pages);
    } catch {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const patch = async (id, status) => {
    setActionLoading((p) => ({ ...p, [id]: true }));
    try {
      await api.patch(`/admin/payments/${id}`, { status });
      setPayments((prev) => prev.map((p) => p._id === id ? { ...p, status } : p));
      toast.success(`Payment ${status}`);
    } catch {
      toast.error('Failed to update payment');
    } finally {
      setActionLoading((p) => ({ ...p, [id]: false }));
    }
  };

  const statusVariant = { pending: 'yellow', verified: 'green', rejected: 'red' };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 30, color: '#0D1B2A', marginBottom: 4 }}>
          Payments
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', color: '#9E9E9E', fontSize: 14, marginBottom: 28 }}>
          {total} total transactions
        </p>
      </motion.div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif' }}>
            <thead>
              <tr style={{ background: '#F8F9FA', borderBottom: '1px solid #F0F0F0' }}>
                {['User', 'Amount', 'Method', 'Date', 'Status', 'Actions'].map((h) => (
                  <th key={h} style={{
                    padding: '14px 16px', textAlign: 'left',
                    fontSize: 12, fontWeight: 600, color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: 0.8,
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {[0,1,2,3,4,5].map((j) => (
                      <td key={j} style={{ padding: '16px' }}>
                        <div style={{ height: 16, background: '#F0F0F0', borderRadius: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : payments.map((p, i) => (
                <motion.tr
                  key={p._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  style={{ borderBottom: '1px solid #F8F9FA' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#FAFAFA'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0D1B2A', fontSize: 14 }}>
                    {p.viewedUser?.fullName || 'Unknown'}
                    <div style={{ fontSize: 11, color: '#9E9E9E', fontWeight: 400 }}>
                      {p.viewedUser?.gender}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700,
                      background: 'linear-gradient(135deg, #E91E8C, #C2185B)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>
                      {p.amount} ETB
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Badge variant="blue" style={{ textTransform: 'capitalize' }}>{p.method}</Badge>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#9E9E9E', whiteSpace: 'nowrap' }}>
                    {new Date(p.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Badge variant={statusVariant[p.status]} style={{ textTransform: 'capitalize' }}>
                      {p.status}
                    </Badge>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {p.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          title="Verify"
                          onClick={() => patch(p._id, 'verified')}
                          disabled={actionLoading[p._id]}
                          style={{
                            width: 30, height: 30, borderRadius: '50%', border: 'none', cursor: 'pointer',
                            background: '#E8F5E9', color: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <CheckCircle size={14} />
                        </button>
                        <button
                          title="Reject"
                          onClick={() => patch(p._id, 'rejected')}
                          disabled={actionLoading[p._id]}
                          style={{
                            width: 30, height: 30, borderRadius: '50%', border: 'none', cursor: 'pointer',
                            background: '#FFEBEE', color: '#C62828', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <XCircle size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #F0F0F0', display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
            <Button variant="secondary" size="sm" onClick={() => fetch(page - 1)} disabled={page <= 1}>← Prev</Button>
            <span style={{ fontFamily: 'Inter, sans-serif', color: '#9E9E9E', fontSize: 14 }}>Page {page} of {pages}</span>
            <Button variant="secondary" size="sm" onClick={() => fetch(page + 1)} disabled={page >= pages}>Next →</Button>
          </div>
        )}
      </Card>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}
