const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const supabase = require('../supabase');
const { adminProtect } = require('../middleware/adminAuth');

// POST /api/admin/login
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { username, password } = req.body;

    try {
      const { data: admin, error } = await supabase
        .from('users')
        .select('*')
        .eq('full_name', username)
        .eq('is_admin', true)
        .single();

      if (error || !admin) return res.status(401).json({ success: false, message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, admin.password_hash);
      if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

      const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

      res.json({
        success: true,
        token,
        user: { _id: admin.id, fullName: admin.full_name, isAdmin: true },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// All routes below require admin JWT
router.use(adminProtect);

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit) - 1;

    const { data, error, count } = await supabase
      .from('users')
      .select('id, full_name, photo_url, gender, connection_goal, is_approved, created_at, age', { count: 'exact' })
      .eq('is_admin', false)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    res.json({
      success: true,
      users: data.map((u) => ({
        _id: u.id,
        fullName: u.full_name,
        photoUrl: u.photo_url,
        gender: u.gender,
        connectionGoal: u.connection_goal,
        isApproved: u.is_approved,
        age: u.age,
        createdAt: u.created_at,
      })),
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / parseInt(limit)),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/users/:id
router.patch('/users/:id', async (req, res) => {
  try {
    const { isApproved } = req.body;
    const { data, error } = await supabase
      .from('users')
      .update({ is_approved: isApproved })
      .eq('id', req.params.id)
      .select('id, full_name, is_approved, gender')
      .single();

    if (error) throw error;
    res.json({ success: true, user: { _id: data.id, fullName: data.full_name, isApproved: data.is_approved } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    await supabase.from('payments').delete().eq('viewed_user_id', req.params.id);
    const { error } = await supabase.from('users').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/payments
router.get('/payments', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit) - 1;

    const { data, error, count } = await supabase
      .from('payments')
      .select('*, viewed_user:viewed_user_id(full_name, gender)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    res.json({
      success: true,
      payments: data.map((p) => ({
        _id: p.id,
        payerInfo: p.payer_info,
        viewedUser: p.viewed_user ? { fullName: p.viewed_user.full_name, gender: p.viewed_user.gender } : null,
        amount: p.amount,
        method: p.method,
        status: p.status,
        createdAt: p.created_at,
      })),
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / parseInt(limit)),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/payments/:id
router.patch('/payments/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be verified or rejected' });
    }
    const { data, error } = await supabase
      .from('payments')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, payment: { _id: data.id, status: data.status } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [
      { count: totalUsers },
      { count: approvedUsers },
      { count: pendingPayments },
      { data: revenueData },
      { data: genderData },
      { data: monthlyData },
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('is_admin', false),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('is_approved', true).eq('is_admin', false),
      supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('payments').select('amount').eq('status', 'verified'),
      supabase.from('users').select('gender').eq('is_admin', false),
      supabase.from('payments').select('amount, created_at').eq('status', 'verified'),
    ]);

    const totalRevenue = (revenueData || []).reduce((sum, p) => sum + (p.amount || 0), 0);

    // Group gender counts
    const genderCounts = (genderData || []).reduce((acc, u) => {
      acc[u.gender] = (acc[u.gender] || 0) + 1;
      return acc;
    }, {});
    const usersByGender = Object.entries(genderCounts).map(([g, count]) => ({ _id: g, count }));

    // Group payments by month
    const monthMap = {};
    (monthlyData || []).forEach((p) => {
      const d = new Date(p.created_at);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      if (!monthMap[key]) monthMap[key] = { _id: { year: d.getFullYear(), month: d.getMonth() + 1 }, count: 0, revenue: 0 };
      monthMap[key].count++;
      monthMap[key].revenue += p.amount || 0;
    });
    const paymentsByMonth = Object.values(monthMap).sort((a, b) =>
      a._id.year !== b._id.year ? a._id.year - b._id.year : a._id.month - b._id.month
    );

    res.json({
      success: true,
      stats: { totalUsers, approvedUsers, totalRevenue, pendingPayments, usersByGender, paymentsByMonth },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
