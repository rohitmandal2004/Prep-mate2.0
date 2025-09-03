const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job');
const { protect, employer, optionalAuth } = require('../middleware/auth');

// @route   GET /api/jobs
// @desc    Get all jobs with filtering and pagination
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      location,
      jobType,
      experience,
      category,
      platform,
      featured,
      urgent,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = { status: 'Active' };

    // Search in title, description, and company name
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by location
    if (location) {
      if (location === 'Remote') {
        query['location.type'] = 'Remote';
      } else if (location === 'On-site') {
        query['location.type'] = 'On-site';
      } else if (location === 'Hybrid') {
        query['location.type'] = 'Hybrid';
      } else {
        // Search in city, state, country
        query.$or = [
          { 'location.city': { $regex: location, $options: 'i' } },
          { 'location.state': { $regex: location, $options: 'i' } },
          { 'location.country': { $regex: location, $options: 'i' } }
        ];
      }
    }

    // Filter by job type
    if (jobType) {
      query.jobType = jobType;
    }

    // Filter by experience
    if (experience) {
      const [minExp] = experience.split('-').map(Number);
      query['experience.min'] = { $lte: minExp };
    }

    // Filter by category (industry)
    if (category) {
      query['company.industry'] = category;
    }

    // Filter by platform
    if (platform) {
      query.platform = platform;
    }

    // Filter by featured/urgent
    if (featured === 'true') {
      query.isFeatured = true;
    }
    if (urgent === 'true') {
      query.isUrgent = true;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const jobs = await Job.find(query)
      .populate('postedBy.user', 'firstName lastName email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Job.countDocuments(query);

    // Increment view count for each job
    if (req.user) {
      jobs.forEach(job => {
        job.incrementViews();
      });
    }

    res.json({
      jobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalJobs: total,
        hasNext: skip + jobs.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      message: 'Server error while fetching jobs'
    });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get a specific job by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy.user', 'firstName lastName email')
      .populate('applications.applicant', 'firstName lastName email profilePicture');

    if (!job) {
      return res.status(404).json({
        message: 'Job not found'
      });
    }

    // Check if job is active
    if (job.status !== 'Active') {
      return res.status(404).json({
        message: 'This job is no longer available'
      });
    }

    // Increment view count
    await job.incrementViews();

    res.json({
      job
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      message: 'Server error while fetching job'
    });
  }
});

// @route   POST /api/jobs
// @desc    Create a new job posting
// @access  Private (Employers only)
router.post('/', [
  protect,
  employer,
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Job title must be between 5 and 100 characters'),
  body('company.name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  body('location.type')
    .isIn(['Remote', 'On-site', 'Hybrid'])
    .withMessage('Invalid location type'),
  body('jobType')
    .isIn(['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'])
    .withMessage('Invalid job type'),
  body('experience.min')
    .isInt({ min: 0 })
    .withMessage('Minimum experience must be a non-negative integer'),
  body('description')
    .trim()
    .isLength({ min: 100 })
    .withMessage('Job description must be at least 100 characters long'),
  body('requirements.skills')
    .isArray()
    .withMessage('Skills must be an array'),
  body('requirements.education.degree')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Degree must be between 2 and 50 characters'),
  body('salary.min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum salary must be a non-negative number'),
  body('salary.max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum salary must be a non-negative number'),
  body('applicationProcess.deadline')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid deadline date')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      title,
      company,
      location,
      jobType,
      experience,
      description,
      requirements,
      benefits,
      salary,
      applicationProcess,
      tags,
      isFeatured,
      isUrgent,
      platform,
      externalUrl
    } = req.body;

    // Create job object
    const jobData = {
      title,
      company: {
        ...company,
        logo: company.logo || '',
        website: company.website || '',
        description: company.description || ''
      },
      location: {
        ...location,
        coordinates: location.coordinates || {}
      },
      jobType,
      experience: {
        min: experience.min,
        max: experience.max || undefined
      },
      description,
      requirements: {
        skills: requirements.skills || [],
        education: requirements.education || {},
        certifications: requirements.certifications || [],
        languages: requirements.languages || []
      },
      benefits: benefits || [],
      salary: {
        min: salary?.min,
        max: salary?.max,
        currency: salary?.currency || 'USD',
        period: salary?.period || 'Yearly',
        isNegotiable: salary?.isNegotiable !== undefined ? salary.isNegotiable : true
      },
      applicationProcess: {
        deadline: applicationProcess?.deadline ? new Date(applicationProcess.deadline) : undefined,
        requirements: applicationProcess?.requirements || [],
        documents: applicationProcess?.documents || []
      },
      postedBy: {
        user: req.user._id,
        role: req.user.role || 'Other'
      },
      tags: tags || [],
      isFeatured: isFeatured || false,
      isUrgent: isUrgent || false,
      platform: platform || 'Other',
      externalUrl: externalUrl || ''
    };

    const newJob = new Job(jobData);
    await newJob.save();

    // Populate user info
    await newJob.populate('postedBy.user', 'firstName lastName email');

    res.status(201).json({
      message: 'Job posted successfully',
      job: newJob
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      message: 'Server error while creating job'
    });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job posting
// @access  Private (Job owner or admin)
router.put('/:id', [
  protect,
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Job title must be between 5 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 100 })
    .withMessage('Job description must be at least 100 characters long'),
  body('status')
    .optional()
    .isIn(['Active', 'Closed', 'Draft', 'Archived'])
    .withMessage('Invalid status')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        message: 'Job not found'
      });
    }

    // Check if user owns this job or is admin
    if (job.postedBy.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied. You can only modify your own job postings.'
      });
    }

    // Update fields
    const updateFields = [
      'title', 'company', 'location', 'jobType', 'experience', 'description',
      'requirements', 'benefits', 'salary', 'applicationProcess', 'tags',
      'isFeatured', 'isUrgent', 'platform', 'externalUrl', 'status'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    // Handle date fields
    if (req.body.applicationProcess?.deadline) {
      job.applicationProcess.deadline = new Date(req.body.applicationProcess.deadline);
    }

    await job.save();
    await job.populate('postedBy.user', 'firstName lastName email');

    res.json({
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      message: 'Server error while updating job'
    });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job posting
// @access  Private (Job owner or admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        message: 'Job not found'
      });
    }

    // Check if user owns this job or is admin
    if (job.postedBy.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied. You can only delete your own job postings.'
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      message: 'Server error while deleting job'
    });
  }
});

// @route   POST /api/jobs/:id/apply
// @desc    Apply for a job
// @access  Private
router.post('/:id/apply', [
  protect,
  body('resume')
    .optional()
    .isURL()
    .withMessage('Please provide a valid resume URL'),
  body('coverLetter')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Cover letter cannot exceed 2000 characters'),
  body('portfolio')
    .optional()
    .isURL()
    .withMessage('Please provide a valid portfolio URL')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        message: 'Job not found'
      });
    }

    // Check if job is still accepting applications
    if (!job.isAcceptingApplications()) {
      return res.status(400).json({
        message: 'This job is no longer accepting applications'
      });
    }

    // Check if user has already applied
    const existingApplication = job.applications.find(
      app => app.applicant.toString() === req.user._id.toString()
    );

    if (existingApplication) {
      return res.status(400).json({
        message: 'You have already applied for this job'
      });
    }

    const { resume, coverLetter, portfolio, notes } = req.body;

    // Add application
    const applicationData = {
      applicant: req.user._id,
      resume: resume || '',
      coverLetter: coverLetter || '',
      portfolio: portfolio || '',
      notes: notes || ''
    };

    await job.addApplication(applicationData);

    res.json({
      message: 'Application submitted successfully'
    });
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({
      message: 'Server error while submitting application'
    });
  }
});

// @route   GET /api/jobs/:id/applications
// @desc    Get applications for a job (employers only)
// @access  Private (Job owner or admin)
router.get('/:id/applications', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('applications.applicant', 'firstName lastName email profilePicture professionalInfo');
    
    if (!job) {
      return res.status(404).json({
        message: 'Job not found'
      });
    }

    // Check if user owns this job or is admin
    if (job.postedBy.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied. You can only view applications for your own job postings.'
      });
    }

    res.json({
      applications: job.applications,
      count: job.applications.length
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      message: 'Server error while fetching applications'
    });
  }
});

// @route   PUT /api/jobs/:id/applications/:applicationId
// @desc    Update application status (employers only)
// @access  Private (Job owner or admin)
router.put('/:id/applications/:applicationId', [
  protect,
  body('status')
    .isIn(['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Rejected', 'Hired'])
    .withMessage('Invalid application status'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, notes } = req.body;

    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        message: 'Job not found'
      });
    }

    // Check if user owns this job or is admin
    if (job.postedBy.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied. You can only modify applications for your own job postings.'
      });
    }

    // Find and update application
    const application = job.applications.id(req.params.applicationId);
    
    if (!application) {
      return res.status(404).json({
        message: 'Application not found'
      });
    }

    application.status = status;
    if (notes !== undefined) {
      application.notes = notes;
    }

    await job.save();

    res.json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({
      message: 'Server error while updating application'
    });
  }
});

// @route   GET /api/jobs/stats/overview
// @desc    Get job statistics
// @access  Private (Employers only)
router.get('/stats/overview', protect, async (req, res) => {
  try {
    let matchQuery = {};
    
    // If not admin, only show stats for user's own jobs
    if (req.user.role !== 'admin') {
      matchQuery['postedBy.user'] = req.user._id;
    }

    const stats = await Job.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalJobs: { $sum: 1 },
          activeJobs: { $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] } },
          totalApplications: { $sum: '$applicationsCount' },
          totalViews: { $sum: '$views' },
          avgApplications: { $avg: '$applicationsCount' },
          avgViews: { $avg: '$views' }
        }
      }
    ]);

    const statusBreakdown = await Job.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const categoryBreakdown = await Job.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$company.industry',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const response = {
      overview: stats[0] || {
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        totalViews: 0,
        avgApplications: 0,
        avgViews: 0
      },
      statusBreakdown,
      categoryBreakdown
    };

    res.json(response);
  } catch (error) {
    console.error('Get job stats error:', error);
    res.status(500).json({
      message: 'Server error while fetching job statistics'
    });
  }
});

module.exports = router;
