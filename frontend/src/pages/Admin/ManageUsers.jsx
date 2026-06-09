import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState({});

  const fetchUsers = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/users?page=${p}&limit=20`);
      setUsers(data.users);
      setTotal(data.total);
      setPage(data.page);
      setPages(data.pages);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const patch = async (id, body, label) => {
    setActionLoading((p) => ({ ...p, [id]: label }));
    try {
      await api.patch(`/admin/users/${id}`, body);
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, ...body } : u));
      toast.success(`User ${label}d`);
    } catch {
      toast.error(`Failed to ${label} user`);
    } finally {
      setActionLoading((p) => ({ ...p, [id]: null }));
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    setActionLoading((p) => ({ ...p, [id]: 'delete' }));
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    } finally {
      setActionLoading((p) => ({ ...p, [id]: null }));
    }
  };

  const GOAL_LABELS = { relationship: 'Relationship', dating: 'Dating', fwb: 'FWB', casual: 'Casual' };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 30, color: '#0D1B2A', marginBottom: 4 }}>
          Manage Users
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', color: '#9E9E9E', fontSize: 14, marginBottom: 28 }}>
          {total} total profiles
        </p>
      </motion.div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif' }}>
            <thead>
              <tr style={{ background: '#F8F9FA', borderBottom: '1px solid #F0F0F0' }}>
                {['Photo', 'Name', 'Gender', 'Goal', 'Joined', 'Status', 'Actions'].map((h) => (
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
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {[0,1,2,3,4,5,6].map((j) => (
                      <td key={j} style={{ padding: '16px' }}>
                        <div style={{ height: 16, background: '#F0F0F0', borderRadius: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.map((u, i) => (
                <motion.tr
                  key={u._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  style={{ borderBottom: '1px solid #F8F9FA' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#FAFAFA'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <Avatar src={u.photoUrl} name={u.fullName} size={36} />
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0D1B2A', fontSize: 14, whiteSpace: 'nowrap' }}>
                    {u.fullName}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Badge variant={u.gender === 'female' ? 'rose' : 'blue'} style={{ fontSize: 12 }}>
                      {u.gender === 'female' ? '♀' : '♂'} {u.gender}
                    </Badge>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#9E9E9E' }}>
                    {GOAL_LABELS[u.connectionGoal] || u.connectionGoal}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#9E9E9E', whiteSpace: 'nowrap' }}>
                    {new Date(u.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Badge variant={u.isApproved ? 'green' : 'yellow'}>
                      {u.isApproved ? 'Approved' : 'Pending'}
                    </Badge>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {!u.isApproved && (
                        <button
                          title="Approve"
                          onClick={() => patch(u._id, { isApproved: true }, 'approve')}
                          disabled={!!actionLoading[u._id]}
                          style={{
                            width: 30, height: 30, borderRadius: '50%', border: 'none', cursor: 'pointer',
                            background: '#E8F5E9', color: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <Check size={14} />
                        </button>
                      )}
                      {u.isApproved && (
                        <button
                          title="Reject"
                          onClick={() => patch(u._id, { isApproved: false }, 'reject')}
                          disabled={!!actionLoading[u._id]}
                          style={{
                            width: 30, height: 30, borderRadius: '50%', border: 'none', cursor: 'pointer',
                            background: '#FFF8E1', color: '#F57F17', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <X size={14} />
                        </button>
                      )}
                      <button
                        title="Delete"
                        onClick={() => deleteUser(u._id)}
                        disabled={!!actionLoading[u._id]}
                        style={{
                          width: 30, height: 30, borderRadius: '50%', border: 'none', cursor: 'pointer',
                          background: '#FFEBEE', color: '#C62828', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #F0F0F0', display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
            <Button variant="secondary" size="sm" onClick={() => fetchUsers(page - 1)} disabled={page <= 1}>← Prev</Button>
            <span style={{ fontFamily: 'Inter, sans-serif', color: '#9E9E9E', fontSize: 14 }}>Page {page} of {pages}</span>
            <Button variant="secondary" size="sm" onClick={() => fetchUsers(page + 1)} disabled={page >= pages}>Next →</Button>
          </div>
        )}
      </Card>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}
