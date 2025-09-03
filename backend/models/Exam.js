const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Exam name is required'],
    trim: true,
    maxlength: [100, 'Exam name cannot exceed 100 characters']
  },
  code: {
    type: String,
    required: [true, 'Exam code is required'],
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: [20, 'Exam code cannot exceed 20 characters']
  },
  category: {
    type: String,
    required: [true, 'Exam category is required'],
    enum: [
      'IT & Software',
      'Data Science & AI',
      'Cybersecurity',
      'Cloud Computing',
      'Project Management',
      'Business & Finance',
      'Healthcare',
      'Education',
      'Other'
    ]
  },
  subcategory: {
    type: String,
    trim: true,
    maxlength: [50, 'Subcategory cannot exceed 50 characters']
  },
  provider: {
    name: {
      type: String,
      required: [true, 'Provider name is required'],
      trim: true,
      maxlength: [100, 'Provider name cannot exceed 100 characters']
    },
    website: String,
    logo: String,
    description: String
  },
  description: {
    type: String,
    required: [true, 'Exam description is required'],
    minlength: [100, 'Exam description must be at least 100 characters long']
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: [15, 'Exam duration must be at least 15 minutes'],
    max: [480, 'Exam duration cannot exceed 8 hours']
  },
  format: {
    type: String,
    enum: ['Multiple Choice', 'Essay', 'Practical', 'Mixed', 'Other'],
    default: 'Multiple Choice'
  },
  passingScore: {
    type: Number,
    required: true,
    min: [0, 'Passing score cannot be negative'],
    max: [100, 'Passing score cannot exceed 100']
  },
  totalQuestions: {
    type: Number,
    min: [1, 'Total questions must be at least 1']
  },
  topics: [{
    name: String,
    weightage: {
      type: Number,
      min: [0, 'Weightage cannot be negative'],
      max: [100, 'Weightage cannot exceed 100']
    },
    description: String
  }],
  prerequisites: [{
    type: String,
    enum: ['None', 'Basic Knowledge', 'Previous Certification', 'Work Experience', 'Education', 'Other']
  }],
  validity: {
    type: Number,
    min: [0, 'Validity cannot be negative'],
    description: String
  },
  cost: {
    amount: {
      type: Number,
      min: [0, 'Cost cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD'
    },
    includes: [String]
  },
  schedule: {
    availability: {
      type: String,
      enum: ['Year-round', 'Quarterly', 'Monthly', 'On-demand', 'Other']
    },
    nextDate: Date,
    registrationDeadline: Date
  },
  locations: [{
    type: {
      type: String,
      enum: ['Online', 'Testing Center', 'Company Office', 'Other']
    },
    city: String,
    state: String,
    country: String,
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  }],
  studyMaterials: [{
    type: {
      type: String,
      enum: ['Book', 'Video Course', 'Practice Tests', 'Study Guide', 'Online Course', 'Other']
    },
    title: String,
    author: String,
    description: String,
    url: String,
    cost: {
      amount: Number,
      currency: String
    },
    isFree: {
      type: Boolean,
      default: false
    }
  }],
  practiceTests: [{
    name: String,
    description: String,
    questions: Number,
    duration: Number,
    cost: {
      amount: Number,
      currency: String
    },
    url: String,
    isFree: {
      type: Boolean,
      default: false
    }
  }],
  successRate: {
    type: Number,
    min: [0, 'Success rate cannot be negative'],
    max: [100, 'Success rate cannot exceed 100']
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Moderate', 'Hard', 'Very Hard']
  },
  popularity: {
    type: Number,
    default: 0,
    min: [0, 'Popularity cannot be negative']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  status: {
    type: String,
    enum: ['Active', 'Discontinued', 'Coming Soon', 'Beta'],
    default: 'Active'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    comment: {
      type: String,
      maxlength: [500, 'Review comment cannot exceed 500 characters']
    },
    date: {
      type: Date,
      default: Date.now
    },
    helpful: {
      type: Number,
      default: 0
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Average rating cannot be negative'],
    max: [5, 'Average rating cannot exceed 5']
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
examSchema.index({ name: 'text', description: 'text', 'provider.name': 'text' });
examSchema.index({ code: 1 });
examSchema.index({ category: 1, subcategory: 1 });
examSchema.index({ level: 1 });
examSchema.index({ 'provider.name': 1 });
examSchema.index({ status: 1, isFeatured: 1 });
examSchema.index({ tags: 1 });
examSchema.index({ averageRating: -1, popularity: -1 });
examSchema.index({ 'schedule.nextDate': 1 });

// Virtual for exam difficulty level
examSchema.virtual('difficultyLevel').get(function() {
  if (this.difficulty === 'Easy') return 1;
  if (this.difficulty === 'Moderate') return 2;
  if (this.difficulty === 'Hard') return 3;
  if (this.difficulty === 'Very Hard') return 4;
  return 2; // Default to moderate
});

// Virtual for exam cost display
examSchema.virtual('costDisplay').get(function() {
  if (!this.cost.amount) return 'Free';
  
  const currency = this.cost.currency || 'USD';
  const amount = this.cost.amount.toLocaleString();
  
  if (this.cost.includes && this.cost.includes.length > 0) {
    return `${currency} ${amount} (includes ${this.cost.includes.join(', ')})`;
  }
  
  return `${currency} ${amount}`;
});

// Virtual for exam duration display
examSchema.virtual('durationDisplay').get(function() {
  if (this.duration < 60) {
    return `${this.duration} minutes`;
  } else if (this.duration < 120) {
    return `${Math.floor(this.duration / 60)} hour ${this.duration % 60} minutes`;
  } else {
    return `${Math.floor(this.duration / 60)} hours ${this.duration % 60} minutes`;
  }
});

// Method to calculate average rating
examSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = Math.round((totalRating / this.reviews.length) * 10) / 10;
  }
  this.reviewCount = this.reviews.length;
  return this.save();
};

// Method to add review
examSchema.methods.addReview = function(reviewData) {
  this.reviews.push(reviewData);
  return this.calculateAverageRating();
};

// Method to check if exam is available
examSchema.methods.isAvailable = function() {
  if (this.status !== 'Active') return false;
  
  if (this.schedule.availability === 'On-demand') return true;
  
  if (this.schedule.nextDate && new Date() > this.schedule.nextDate) return false;
  
  return true;
};

// Ensure virtual fields are serialized
examSchema.set('toJSON', { virtuals: true });
examSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Exam', examSchema);
