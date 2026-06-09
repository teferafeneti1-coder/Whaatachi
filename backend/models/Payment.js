const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  payerInfo: {
    type: String,
    required: true, // anonymous device ID or session token
  },
  viewedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    default: 200,
  },
  method: {
    type: String,
    enum: ['telebirr', 'cbe'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for quick lookup: has this payer already paid for this user?
paymentSchema.index({ payerInfo: 1, viewedUser: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
