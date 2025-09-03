const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Exam = require('../models/Exam');
const { protect, optionalAuth } = require('../middleware/auth');

// @route   GET /api/exams
// @desc    Get all exams with filtering and pagination
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      subcategory,
      level,
      provider,
      difficulty,
      featured,
      sortBy = 'popularity',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = { status: 'Active' };

    // Search in name, description, and provider name
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by subcategory
    if (subcategory) {
      query.subcategory = subcategory;
    }

    // Filter by level
    if (level) {
      query.level = level;
    }

    // Filter by provider
    if (provider) {
      query['provider.name'] = { $regex: provider, $options: 'i' };
    }

    // Filter by difficulty
    if (difficulty) {
      query.difficulty = difficulty;
    }

    // Filter by featured
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const exams = await Exam.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Exam.countDocuments(query);

    res.json({
      exams,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalExams: total,
        hasNext: skip + exams.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get exams error:', error);
    res.status(500).json({
      message: 'Server error while fetching exams'
    });
  }
});

// @route   GET /api/exams/:id
// @desc    Get a specific exam by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        message: 'Exam not found'
      });
    }

    // Check if exam is available
    if (!exam.isAvailable()) {
      return res.status(404).json({
        message: 'This exam is no longer available'
      });
    }

    res.json({
      exam
    });
  } catch (error) {
    console.error('Get exam error:', error);
    res.status(500).json({
      message: 'Server error while fetching exam'
    });
  }
});

// @route   POST /api/exams
// @desc    Create a new exam (admin only)
// @access  Private (Admin only)
router.post('/', [
  protect,
  body('name')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Exam name must be between 5 and 100 characters'),
  body('code')
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('Exam code must be between 2 and 20 characters'),
  body('category')
    .isIn([
      'IT & Software',
      'Data Science & AI',
      'Cybersecurity',
      'Cloud Computing',
      'Project Management',
      'Business & Finance',
      'Healthcare',
      'Education',
      'Other'
    ])
    .withMessage('Invalid category'),
  body('provider.name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Provider name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 100 })
    .withMessage('Exam description must be at least 100 characters long'),
  body('level')
    .isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
    .withMessage('Invalid level'),
  body('duration')
    .isInt({ min: 15, max: 480 })
    .withMessage('Duration must be between 15 minutes and 8 hours'),
  body('passingScore')
    .isInt({ min: 0, max: 100 })
    .withMessage('Passing score must be between 0 and 100'),
  body('cost.amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cost must be a non-negative number'),
  body('schedule.availability')
    .isIn(['Year-round', 'Quarterly', 'Monthly', 'On-demand', 'Other'])
    .withMessage('Invalid availability'),
  body('schedule.nextDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid next date'),
  body('locations')
    .isArray()
    .withMessage('Locations must be an array'),
  body('studyMaterials')
    .isArray()
    .withMessage('Study materials must be an array'),
  body('practiceTests')
    .isArray()
    .withMessage('Practice tests must be an array')
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

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied. Admin role required.'
      });
    }

    const {
      name,
      code,
      category,
      subcategory,
      provider,
      description,
      level,
      duration,
      format,
      passingScore,
      totalQuestions,
      topics,
      prerequisites,
      validity,
      cost,
      schedule,
      locations,
      studyMaterials,
      practiceTests,
      difficulty,
      tags,
      isFeatured
    } = req.body;

    // Check if exam code already exists
    const existingExam = await Exam.findOne({ code });
    if (existingExam) {
      return res.status(400).json({
        message: 'Exam with this code already exists'
      });
    }

    // Create exam object
    const examData = {
      name,
      code: code.toUpperCase(),
      category,
      subcategory,
      provider: {
        name: provider.name,
        website: provider.website || '',
        logo: provider.logo || '',
        description: provider.description || ''
      },
      description,
      level,
      duration,
      format: format || 'Multiple Choice',
      passingScore,
      totalQuestions,
      topics: topics || [],
      prerequisites: prerequisites || [],
      validity: validity || 0,
      cost: {
        amount: cost?.amount,
        currency: cost?.currency || 'USD',
        includes: cost?.includes || []
      },
      schedule: {
        availability: schedule.availability,
        nextDate: schedule.nextDate ? new Date(schedule.nextDate) : undefined,
        registrationDeadline: schedule.registrationDeadline ? new Date(schedule.registrationDeadline) : undefined
      },
      locations: locations || [],
      studyMaterials: studyMaterials || [],
      practiceTests: practiceTests || [],
      difficulty: difficulty || 'Moderate',
      tags: tags || [],
      isFeatured: isFeatured || false
    };

    const newExam = new Exam(examData);
    await newExam.save();

    res.status(201).json({
      message: 'Exam created successfully',
      exam: newExam
    });
  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({
      message: 'Server error while creating exam'
    });
  }
});

// @route   PUT /api/exams/:id
// @desc    Update an exam (admin only)
// @access  Private (Admin only)
router.put('/:id', [
  protect,
  body('name')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Exam name must be between 5 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 100 })
    .withMessage('Exam description must be at least 100 characters long'),
  body('status')
    .optional()
    .isIn(['Active', 'Discontinued', 'Coming Soon', 'Beta'])
    .withMessage('Invalid status'),
  body('difficulty')
    .optional()
    .isIn(['Easy', 'Moderate', 'Hard', 'Very Hard'])
    .withMessage('Invalid difficulty')
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

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied. Admin role required.'
      });
    }

    const exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return res.status(404).json({
        message: 'Exam not found'
      });
    }

    // Update fields
    const updateFields = [
      'name', 'category', 'subcategory', 'description', 'level', 'duration',
      'format', 'passingScore', 'totalQuestions', 'topics', 'prerequisites',
      'validity', 'cost', 'schedule', 'locations', 'studyMaterials',
      'practiceTests', 'difficulty', 'tags', 'isFeatured', 'status'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        exam[field] = req.body[field];
      }
    });

    // Handle date fields
    if (req.body.schedule?.nextDate) {
      exam.schedule.nextDate = new Date(req.body.schedule.nextDate);
    }
    if (req.body.schedule?.registrationDeadline) {
      exam.schedule.registrationDeadline = new Date(req.body.schedule.registrationDeadline);
    }

    await exam.save();

    res.json({
      message: 'Exam updated successfully',
      exam
    });
  } catch (error) {
    console.error('Update exam error:', error);
    res.status(500).json({
      message: 'Server error while updating exam'
    });
  }
});

// @route   DELETE /api/exams/:id
// @desc    Delete an exam (admin only)
// @access  Private (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied. Admin role required.'
      });
    }

    const exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return res.status(404).json({
        message: 'Exam not found'
      });
    }

    await Exam.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Exam deleted successfully'
    });
  } catch (error) {
    console.error('Delete exam error:', error);
    res.status(500).json({
      message: 'Server error while deleting exam'
    });
  }
});

// @route   POST /api/exams/:id/reviews
// @desc    Add a review to an exam
// @access  Private
router.post('/:id/reviews', [
  protect,
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Review comment cannot exceed 500 characters')
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

    const { rating, comment } = req.body;

    const exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return res.status(404).json({
        message: 'Exam not found'
      });
    }

    // Check if exam is available
    if (!exam.isAvailable()) {
      return res.status(400).json({
        message: 'Cannot review an unavailable exam'
      });
    }

    // Check if user has already reviewed this exam
    const existingReview = exam.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({
        message: 'You have already reviewed this exam'
      });
    }

    // Add review
    const reviewData = {
      user: req.user._id,
      rating,
      comment: comment || '',
      date: new Date()
    };

    await exam.addReview(reviewData);

    res.json({
      message: 'Review added successfully',
      averageRating: exam.averageRating,
      reviewCount: exam.reviewCount
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      message: 'Server error while adding review'
    });
  }
});

// @route   PUT /api/exams/:id/reviews/:reviewId
// @desc    Update a review
// @access  Private
router.put('/:id/reviews/:reviewId', [
  protect,
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Review comment cannot exceed 500 characters')
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

    const { rating, comment } = req.body;

    const exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return res.status(404).json({
        message: 'Exam not found'
      });
    }

    // Find the review
    const review = exam.reviews.id(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({
        message: 'Review not found'
      });
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Access denied. You can only modify your own reviews.'
      });
    }

    // Update review
    review.rating = rating;
    if (comment !== undefined) {
      review.comment = comment;
    }
    review.date = new Date();

    await exam.save();

    res.json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      message: 'Server error while updating review'
    });
  }
});

// @route   DELETE /api/exams/:id/reviews/:reviewId
// @desc    Delete a review
// @access  Private
router.delete('/:id/reviews/:reviewId', protect, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return res.status(404).json({
        message: 'Exam not found'
      });
    }

    // Find the review
    const review = exam.reviews.id(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({
        message: 'Review not found'
      });
    }

    // Check if user owns this review or is admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied. You can only delete your own reviews.'
      });
    }

    // Remove review
    review.remove();
    await exam.save();

    res.json({
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      message: 'Server error while deleting review'
    });
  }
});

// @route   GET /api/exams/categories/list
// @desc    Get list of all exam categories
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Exam.distinct('category');
    const subcategories = await Exam.distinct('subcategory');
    const providers = await Exam.distinct('provider.name');

    res.json({
      categories: categories.filter(Boolean),
      subcategories: subcategories.filter(Boolean),
      providers: providers.filter(Boolean)
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      message: 'Server error while fetching categories'
    });
  }
});

// @route   GET /api/exams/stats/overview
// @desc    Get exam statistics
// @access  Public
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Exam.aggregate([
      { $match: { status: 'Active' } },
      {
        $group: {
          _id: null,
          totalExams: { $sum: 1 },
          avgRating: { $avg: '$averageRating' },
          avgDifficulty: { $avg: '$difficultyLevel' },
          totalReviews: { $sum: '$reviewCount' }
        }
      }
    ]);

    const categoryStats = await Exam.aggregate([
      { $match: { status: 'Active' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgRating: { $avg: '$averageRating' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const levelStats = await Exam.aggregate([
      { $match: { status: 'Active' } },
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const response = {
      overview: stats[0] || {
        totalExams: 0,
        avgRating: 0,
        avgDifficulty: 0,
        totalReviews: 0
      },
      categoryBreakdown: categoryStats,
      levelBreakdown: levelStats
    };

    res.json(response);
  } catch (error) {
    console.error('Get exam stats error:', error);
    res.status(500).json({
      message: 'Server error while fetching exam statistics'
    });
  }
});

module.exports = router;
