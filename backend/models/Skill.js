const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['skill', 'certification'],
    required: true
  },
  name: {
    type: String,
    required: [true, 'Skill/certification name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Programming Languages',
      'Frameworks & Libraries',
      'Databases',
      'Cloud & DevOps',
      'Design & UI/UX',
      'Data Science & AI',
      'Cybersecurity',
      'Project Management',
      'Soft Skills',
      'Other'
    ]
  },
  proficiencyLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    required: function() { return this.type === 'skill'; }
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  icon: {
    type: String,
    default: 'fas fa-code'
  },
  url: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true; // URL is optional
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Please provide a valid URL starting with http:// or https://'
    }
  },
  // Certification specific fields
  certification: {
    issuer: {
      type: String,
      required: function() { return this.type === 'certification'; },
      trim: true,
      maxlength: [100, 'Issuer name cannot exceed 100 characters']
    },
    level: {
      type: String,
      enum: ['Foundation', 'Associate', 'Professional', 'Expert', 'Specialist'],
      required: function() { return this.type === 'certification'; }
    },
    dateObtained: {
      type: Date,
      required: function() { return this.type === 'certification'; }
    },
    expiryDate: {
      type: Date,
      validate: {
        validator: function(v) {
          if (!v) return true; // Expiry date is optional
          return v > this.certification.dateObtained;
        },
        message: 'Expiry date must be after the date obtained'
      }
    },
    certificationId: {
      type: String,
      trim: true,
      maxlength: [50, 'Certification ID cannot exceed 50 characters']
    },
    // PDF file upload
    pdfFile: {
      filename: String,
      originalName: String,
      path: String,
      size: Number,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }
  },
  // Skill specific fields
  skill: {
    yearsOfExperience: {
      type: Number,
      min: [0, 'Years of experience cannot be negative'],
      max: [50, 'Years of experience cannot exceed 50']
    },
    projects: [{
      name: String,
      description: String,
      technologies: [String],
      year: Number,
      url: String
    }]
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  endorsements: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  endorsementCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
skillSchema.index({ user: 1, type: 1 });
skillSchema.index({ category: 1 });
skillSchema.index({ 'certification.issuer': 1 });
skillSchema.index({ tags: 1 });
skillSchema.index({ isPublic: 1 });

// Virtual for certification expiry status
skillSchema.virtual('certification.expiryStatus').get(function() {
  if (this.type !== 'certification' || !this.certification.expiryDate) {
    return null;
  }
  
  const now = new Date();
  const expiry = this.certification.expiryDate;
  const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) {
    return 'expired';
  } else if (daysUntilExpiry <= 30) {
    return 'expires-soon';
  } else {
    return 'valid';
  }
});

// Virtual for days until expiry
skillSchema.virtual('certification.daysUntilExpiry').get(function() {
  if (this.type !== 'certification' || !this.certification.expiryDate) {
    return null;
  }
  
  const now = new Date();
  const expiry = this.certification.expiryDate;
  return Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
});

// Method to check if certification is expired
skillSchema.methods.isExpired = function() {
  if (this.type !== 'certification' || !this.certification.expiryDate) {
    return false;
  }
  return new Date() > this.certification.expiryDate;
};

// Method to get skill level for display
skillSchema.methods.getDisplayLevel = function() {
  if (this.type === 'certification') {
    return `${this.certification.level} - ${this.certification.issuer}`;
  }
  return this.proficiencyLevel;
};

// Ensure virtual fields are serialized
skillSchema.set('toJSON', { virtuals: true });
skillSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Skill', skillSchema);
