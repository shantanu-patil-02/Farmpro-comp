import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    farmerName: {
      type: String,
      trim: true,
      default: 'Anonymous Farmer',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    usefulness: {
      type: String,
      enum: ['yes', 'no', 'Yes', 'No', 'neutral'],
      default: 'yes',
    },
    feedbackText: {
      type: String,
      trim: true,
      default: '',
    },
    comments: {
      type: String,
      trim: true,
      default: '',
    },
    cropName: {
      type: String,
      trim: true,
      default: '',
    },
    crop: {
      type: String,
      trim: true,
      default: '',
    },
    recommendationId: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      default: 'Recommendation Accuracy',
    },
    location: {
      type: String,
      default: 'Nagpur, Maharashtra',
    },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'implemented'],
      default: 'new',
    },
  },
  { timestamps: true }
);

export const inMemoryFeedback = [
  {
    _id: 'fb_1',
    farmerName: 'Suresh More',
    rating: 5,
    usefulness: 'yes',
    cropName: 'Soybean',
    category: 'Market Data',
    feedbackText: 'The mandi shortage alert was very accurate. Sold at 18% premium in APMC Nagpur.',
    comments: 'The mandi shortage alert was very accurate. Sold at 18% premium in APMC Nagpur.',
    location: 'Nagpur, Maharashtra',
    createdAt: new Date(Date.now() - 86400000 * 3),
  },
];

export const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
export default Feedback;

