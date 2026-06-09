const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  photoUrl: {
    type: String,
    default: '',
  },
  telegramUsername: {
    type: String,
    trim: true,
    default: '',
  },
  phoneNumber: {
    type: String,
    trim: true,
    default: '',
  },
  instagramUsername: {
    type: String,
    trim: true,
    default: '',
  },
  age: {
    type: Number,
    min: 18,
    max: 100,
    default: null,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: [true, 'Gender is required'],
  },
  connectionGoal: {
    type: String,
    enum: ['relationship', 'dating', 'fwb', 'casual'],
    required: [true, 'Connection goal is required'],
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  // Admin-only: password for admin login
  password: {
    type: String,
    select: false,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving (admin users only)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Never expose private fields by default
userSchema.methods.toPublicJSON = function () {
  return {
    _id: this._id,
    fullName: this.fullName,
    photoUrl: this.photoUrl,
    age: this.age,
    gender: this.gender,
    connectionGoal: this.connectionGoal,
    isApproved: this.isApproved,
    createdAt: this.createdAt,
  };
};

userSchema.methods.toContactJSON = function () {
  return {
    _id: this._id,
    fullName: this.fullName,
    photoUrl: this.photoUrl,
    age: this.age,
    gender: this.gender,
    connectionGoal: this.connectionGoal,
    telegramUsername: this.telegramUsername,
    phoneNumber: this.phoneNumber,
    instagramUsername: this.instagramUsername,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
