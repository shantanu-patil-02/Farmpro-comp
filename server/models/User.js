import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'hi', 'mr', 'pa', 'gu', 'te', 'kn', 'bn'],
    },
    role: {
      type: String,
      enum: ['farmer', 'agronomist', 'admin'],
      default: 'farmer',
    },
    subscriptionPlan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free',
    },
    freeRecommendationsUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Pre-save hook: automatically hash password with bcryptjs before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare candidate password with stored bcrypt hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!candidatePassword || !this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Fallback in-memory store for demo / offline operation
// Pre-computed bcrypt hash for 'password123': $2a$10$wN1F1y1w6K...
const DEMO_PASSWORD_HASH = bcrypt.hashSync('password123', 10);

export const inMemoryUsers = [
  {
    _id: 'user_default_1',
    id: 'user_default_1',
    name: 'Ramesh Patil',
    email: 'farmer@farmpro.ai',
    password: DEMO_PASSWORD_HASH,
    phone: '+91 98234 56789',
    language: 'en',
    role: 'farmer',
    subscriptionPlan: 'pro',
    freeRecommendationsUsed: 0,
    createdAt: new Date('2025-03-01T00:00:00.000Z'),
  },
  {
    _id: 'user_default_2',
    id: 'user_default_2',
    name: 'Balwinder Singh',
    email: 'balwinder@punjabkisanfpo.org',
    password: DEMO_PASSWORD_HASH,
    phone: '+91 98141 23456',
    language: 'pa',
    role: 'farmer',
    subscriptionPlan: 'enterprise',
    freeRecommendationsUsed: 0,
    createdAt: new Date('2025-01-15T00:00:00.000Z'),
  },
];

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
