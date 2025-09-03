const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  profilePicture: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  location: {
    city: String,
    state: String,
    country: String
  },
  professionalInfo: {
    title: String,
    company: String,
    experience: Number, // in years
    industry: String
  },
  education: [{
    degree: String,
    field: String,
    institution: String,
    graduationYear: Number,
    gpa: Number
  }],
  socialLinks: {
    linkedin: String,
    github: String,
    portfolio: String,
    twitter: String
  },
  preferences: {
    jobAlerts: {
      type: Boolean,
      default: true
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    privacy: {
      type: String,
      enum: ['public', 'private', 'connections'],
      default: 'public'
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ 'location.city': 1, 'location.state': 1 });
userSchema.index({ 'professionalInfo.industry': 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get full name
userSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

// Virtual for profile completion percentage
userSchema.virtual('profileCompletion').get(function() {
  let completed = 0;
  let total = 0;
  
  // Basic info
  if (this.firstName) completed++; total++;
  if (this.lastName) completed++; total++;
  if (this.email) completed++; total++;
  if (this.phone) completed++; total++;
  if (this.profilePicture) completed++; total++;
  if (this.bio) completed++; total++;
  
  // Professional info
  if (this.professionalInfo.title) completed++; total++;
  if (this.professionalInfo.company) completed++; total++;
  if (this.professionalInfo.experience) completed++; total++;
  if (this.professionalInfo.industry) completed++; total++;
  
  // Education
  if (this.education && this.education.length > 0) completed++; total++;
  
  // Social links
  if (this.socialLinks.linkedin || this.socialLinks.github || this.socialLinks.portfolio) completed++; total++;
  
  return Math.round((completed / total) * 100);
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
