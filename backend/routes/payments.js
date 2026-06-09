const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const supabase = require('../supabase');

// POST /api/payments/initiate
router.post(
  '/initiate',
  [
    body('payerInfo').notEmpty().withMessage('Payer info required'),
    body('viewedUserId').notEmpty().withMessage('Viewed user ID required'),
    body('method').isIn(['telebirr', 'cbe']).withMessage('Method must be telebirr or cbe'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { payerInfo, viewedUserId, method } = req.body;

    try {
      // Check user exists
      const { data: user, error: userErr } = await supabase
        .from('users')
        .select('id')
        .eq('id', viewedUserId)
        .eq('is_approved', true)
        .single();

      if (userErr || !user) return res.status(404).json({ success: false, message: 'User not found' });

      // Check already verified
      const { data: existing } = await supabase
        .from('payments')
        .select('id')
        .eq('payer_info', payerInfo)
        .eq('viewed_user_id', viewedUserId)
        .eq('status', 'verified')
        .single();

      if (existing) {
        return res.json({ success: true, alreadyPaid: true, message: 'Contact already unlocked', paymentId: existing.id });
      }

      const { data: payment, error } = await supabase
        .from('payments')
        .insert([{ payer_info: payerInfo, viewed_user_id: viewedUserId, amount: 200, method, status: 'pending' }])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        success: true,
        message: 'Payment initiated',
        payment: { _id: payment.id, amount: payment.amount, method: payment.method, status: payment.status },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// POST /api/payments/confirm/:id — demo confirmation
router.post('/confirm/:id', async (req, res) => {
  try {
    const { data: payment, error } = await supabase
      .from('payments')
      .update({ status: 'verified' })
      .eq('id', req.params.id)
      .select('*, users:viewed_user_id(*)')
      .single();

    if (error || !payment) return res.status(404).json({ success: false, message: 'Payment not found' });

    const u = payment.users;
    res.json({
      success: true,
      message: 'Payment confirmed! Contact info unlocked.',
      contact: {
        fullName: u.full_name,
        photoUrl: u.photo_url,
        telegramUsername: u.telegram_username,
        phoneNumber: u.phone_number,
        instagramUsername: u.instagram_username,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
