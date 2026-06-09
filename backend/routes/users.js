const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const { body, validationResult, query } = require('express-validator');
const supabase = require('../supabase');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only JPG/PNG/WEBP allowed'), false);
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/users/register
router.post(
  '/register',
  upload.single('photo'),
  [
    body('fullName').notEmpty().trim().withMessage('Full name required'),
    body('gender').isIn(['male', 'female']).withMessage('Gender must be male or female'),
    body('connectionGoal').isIn(['relationship', 'dating', 'fwb', 'casual']).withMessage('Invalid goal'),
    body('age').optional({ nullable: true, checkFalsy: true }).isInt({ min: 18, max: 100 }).withMessage('Age must be 18–100'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { fullName, telegramUsername, phoneNumber, instagramUsername, age, gender, connectionGoal } = req.body;
      const photoUrl = req.file ? `/uploads/${req.file.filename}` : '';

      const { data, error } = await supabase
        .from('users')
        .insert([{
          full_name: fullName,
          photo_url: photoUrl,
          telegram_username: telegramUsername || '',
          phone_number: phoneNumber || '',
          instagram_username: instagramUsername || '',
          age: age ? parseInt(age) : null,
          gender,
          connection_goal: connectionGoal,
          is_approved: false,
          is_admin: false,
        }])
        .select('id, full_name, photo_url, age, gender, connection_goal, is_approved, created_at')
        .single();

      if (error) throw error;

      res.status(201).json({
        success: true,
        message: 'Profile created! It will appear after admin approval.',
        user: formatPublic(data),
      });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
  }
);

// GET /api/users — list approved profiles
router.get('/', async (req, res) => {
  try {
    const { gender, goal, page = 1, limit = 20 } = req.query;
    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit) - 1;

    let q = supabase
      .from('users')
      .select('id, full_name, photo_url, age, gender, connection_goal, is_approved, created_at', { count: 'exact' })
      .eq('is_approved', true)
      .eq('is_admin', false)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (gender) q = q.eq('gender', gender);
    if (goal)   q = q.eq('connection_goal', goal);

    const { data, error, count } = await q;
    if (error) throw error;

    res.json({
      success: true,
      users: data.map(formatPublic),
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / parseInt(limit)),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/users/:id/public
router.get('/:id/public', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, photo_url, age, gender, connection_goal, is_approved, created_at')
      .eq('id', req.params.id)
      .eq('is_approved', true)
      .single();

    if (error || !data) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: formatPublic(data) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/users/:id/contact — returns private info only after verified payment
router.get('/:id/contact', async (req, res) => {
  try {
    const { payerInfo } = req.query;
    if (!payerInfo) return res.status(400).json({ success: false, message: 'payerInfo required' });

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.params.id)
      .eq('is_approved', true)
      .single();

    if (error || !user) return res.status(404).json({ success: false, message: 'User not found' });

    // Men are free
    if (user.gender === 'male') {
      return res.json({ success: true, user: formatContact(user) });
    }

    // Women require verified payment
    const { data: payment } = await supabase
      .from('payments')
      .select('id')
      .eq('payer_info', payerInfo)
      .eq('viewed_user_id', req.params.id)
      .eq('status', 'verified')
      .single();

    if (!payment) {
      return res.status(402).json({ success: false, message: 'Payment required', requiresPayment: true });
    }

    res.json({ success: true, user: formatContact(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Helpers
function formatPublic(u) {
  return {
    _id: u.id,
    fullName: u.full_name,
    photoUrl: u.photo_url,
    age: u.age,
    gender: u.gender,
    connectionGoal: u.connection_goal,
    isApproved: u.is_approved,
    createdAt: u.created_at,
  };
}

function formatContact(u) {
  return {
    _id: u.id,
    fullName: u.full_name,
    photoUrl: u.photo_url,
    age: u.age,
    gender: u.gender,
    connectionGoal: u.connection_goal,
    telegramUsername: u.telegram_username,
    phoneNumber: u.phone_number,
    instagramUsername: u.instagram_username,
    createdAt: u.created_at,
  };
}

module.exports = router;
