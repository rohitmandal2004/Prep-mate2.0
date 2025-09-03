const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  company: {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    logo: String,
    website: String,
    description: String,
    size: {
      type: String,
      enum: ['Startup', 'Small', 'Medium', 'Large', 'Enterprise']
    },
    industry: String
  },
  location: {
    type: {
      type: String,
      enum: ['Remote', 'On-site', 'Hybrid'],
      required: true
    },
    city: String,
    state: String,
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
    required: true
  },
  experience: {
    min: {
      type: Number,
      min: [0, 'Minimum experience cannot be negative'],
      required: true
    },
    max: {
      type: Number,
      min: [0, 'Maximum experience cannot be negative']
    }
  },
  salary: {
    min: {
      type: Number,
      min: [0, 'Minimum salary cannot be negative']
    },
    max: {
      type: Number,
      min: [0, 'Maximum salary cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD'
    },
    period: {
      type: String,
      enum: ['Hourly', 'Daily', 'Weekly', 'Monthly', 'Yearly'],
      default: 'Yearly'
    },
    isNegotiable: {
      type: Boolean,
      default: true
    }
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    minlength: [100, 'Job description must be at least 100 characters long']
  },
  requirements: {
    skills: [{
      name: String,
      level: {
        type: String,
        enum: ['Required', 'Preferred', 'Nice to have']
      }
    }],
    education: {
      degree: String,
      field: String,
      required: Boolean
    },
    certifications: [String],
    languages: [{
      name: String,
      proficiency: {
        type: String,
        enum: ['Basic', 'Conversational', 'Fluent', 'Native']
      }
    }]
  },
  benefits: [{
    category: {
      type: String,
      enum: ['Health', 'Financial', 'Work-Life Balance', 'Professional Development', 'Other']
    },
    name: String,
    description: String
  }],
  applicationProcess: {
    deadline: Date,
    requirements: [String],
    documents: [{
      type: String,
      enum: ['Resume', 'Cover Letter', 'Portfolio', 'References', 'Other'],
      required: Boolean
    }]
  },
  status: {
    type: String,
    enum: ['Active', 'Closed', 'Draft', 'Archived'],
    default: 'Active'
  },
  postedBy: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['HR', 'Hiring Manager', 'Recruiter', 'Other']
    }
  },
  applications: [{
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Rejected', 'Hired'],
      default: 'Applied'
    },
    resume: String,
    coverLetter: String,
    portfolio: String,
    notes: String
  }],
  views: {
    type: Number,
    default: 0
  },
  applicationsCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  platform: {
    type: String,
    enum: ['LinkedIn', 'Indeed', 'Glassdoor', 'Company Website', 'Other'],
    default: 'Other'
  },
  externalUrl: String
}, {
  timestamps: true
});

// Indexes for better query performance
jobSchema.index({ title: 'text', description: 'text', 'company.name': 'text' });
jobSchema.index({ status: 1, isActive: 1 });
jobSchema.index({ 'location.type': 1, 'location.city': 1, 'location.country': 1 });
jobSchema.index({ jobType: 1 });
jobSchema.index({ 'experience.min': 1, 'experience.max': 1 });
jobSchema.index({ 'salary.min': 1, 'salary.max': 1 });
jobSchema.index({ 'requirements.skills.name': 1 });
jobSchema.index({ tags: 1 });
jobSchema.index({ isFeatured: 1, isUrgent: 1 });
jobSchema.index({ createdAt: -1 });

// Virtual for job duration
jobSchema.virtual('duration').get(function() {
  if (!this.createdAt) return null;
  
  const now = new Date();
  const posted = this.createdAt;
  const diffTime = Math.abs(now - posted);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
});

// Virtual for experience range display
jobSchema.virtual('experienceRange').get(function() {
  if (this.experience.max) {
    return `${this.experience.min}-${this.experience.max} years`;
  }
  return `${this.experience.min}+ years`;
});

// Virtual for salary range display
jobSchema.virtual('salaryRange').get(function() {
  if (!this.salary.min && !this.salary.max) return 'Not specified';
  
  const currency = this.salary.currency || 'USD';
  const period = this.salary.period || 'Yearly';
  
  if (this.salary.min && this.salary.max) {
    return `${currency} ${this.salary.min.toLocaleString()}-${this.salary.max.toLocaleString()} ${period}`;
  } else if (this.salary.min) {
    return `${currency} ${this.salary.min.toLocaleString()}+ ${period}`;
  } else if (this.salary.max) {
    return `Up to ${currency} ${this.salary.max.toLocaleString()} ${period}`;
  }
  
  return 'Not specified';
});

// Method to increment view count
jobSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to add application
jobSchema.methods.addApplication = function(applicationData) {
  this.applications.push(applicationData);
  this.applicationsCount = this.applications.length;
  return this.save();
};

// Method to check if job is still accepting applications
jobSchema.methods.isAcceptingApplications = function() {
  if (this.status !== 'Active') return false;
  if (this.applicationProcess.deadline && new Date() > this.applicationProcess.deadline) return false;
  return true;
};

// Ensure virtual fields are serialized
jobSchema.set('toJSON', { virtuals: true });
jobSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Job', jobSchema);
