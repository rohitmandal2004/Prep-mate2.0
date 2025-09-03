const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json({
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      message: 'Server error while fetching profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update current user profile
// @access  Private
router.put('/profile', [
  protect,
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('location.city')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('City cannot exceed 50 characters'),
  body('location.state')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('State cannot exceed 50 characters'),
  body('location.country')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Country cannot exceed 50 characters'),
  body('professionalInfo.title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Professional title cannot exceed 100 characters'),
  body('professionalInfo.company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  body('professionalInfo.experience')
    .optional()
    .isFloat({ min: 0, max: 50 })
    .withMessage('Experience must be between 0 and 50 years'),
  body('professionalInfo.industry')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Industry cannot exceed 100 characters'),
  body('socialLinks.linkedin')
    .optional()
    .isURL()
    .withMessage('Please provide a valid LinkedIn URL'),
  body('socialLinks.github')
    .optional()
    .isURL()
    .withMessage('Please provide a valid GitHub URL'),
  body('socialLinks.portfolio')
    .optional()
    .isURL()
    .withMessage('Please provide a valid portfolio URL'),
  body('socialLinks.twitter')
    .optional()
    .isURL()
    .withMessage('Please provide a valid Twitter URL'),
  body('preferences.jobAlerts')
    .optional()
    .isBoolean()
    .withMessage('Job alerts must be a boolean value'),
  body('preferences.emailNotifications')
    .optional()
    .isBoolean()
    .withMessage('Email notifications must be a boolean value'),
  body('preferences.privacy')
    .optional()
    .isIn(['public', 'private', 'connections'])
    .withMessage('Privacy must be public, private, or connections')
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

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Update basic info
    const updateFields = [
      'firstName', 'lastName', 'phone', 'bio', 'profilePicture'
    ];
    
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // Update location
    if (req.body.location) {
      Object.keys(req.body.location).forEach(key => {
        if (req.body.location[key] !== undefined) {
          user.location[key] = req.body.location[key];
        }
      });
    }

    // Update professional info
    if (req.body.professionalInfo) {
      Object.keys(req.body.professionalInfo).forEach(key => {
        if (req.body.professionalInfo[key] !== undefined) {
          user.professionalInfo[key] = req.body.professionalInfo[key];
        }
      });
    }

    // Update education
    if (req.body.education) {
      user.education = req.body.education;
    }

    // Update social links
    if (req.body.socialLinks) {
      Object.keys(req.body.socialLinks).forEach(key => {
        if (req.body.socialLinks[key] !== undefined) {
          user.socialLinks[key] = req.body.socialLinks[key];
        }
      });
    }

    // Update preferences
    if (req.body.preferences) {
      Object.keys(req.body.preferences).forEach(key => {
        if (req.body.preferences[key] !== undefined) {
          user.preferences[key] = req.body.preferences[key];
        }
      });
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      message: 'Server error while updating profile'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get public profile of a user
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('firstName lastName bio location professionalInfo education socialLinks preferences');
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Check privacy settings
    if (user.preferences.privacy === 'private') {
      return res.status(403).json({
        message: 'This profile is private'
      });
    }

    res.json({
      user
    });
  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({
      message: 'Server error while fetching profile'
    });
  }
});

// @route   GET /api/users/search
// @desc    Search users by skills, location, or other criteria
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const {
      q,
      location,
      skills,
      experience,
      industry,
      page = 1,
      limit = 10
    } = req.query;

    let query = { isActive: true, 'preferences.privacy': { $ne: 'private' } };

    // Search in name, bio, and professional info
    if (q) {
      query.$or = [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } },
        { 'professionalInfo.title': { $regex: q, $options: 'i' } },
        { 'professionalInfo.company': { $regex: q, $options: 'i' } }
      ];
    }

    // Filter by location
    if (location) {
      query.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } },
        { 'location.country': { $regex: location, $options: 'i' } }
      ];
    }

    // Filter by industry
    if (industry) {
      query['professionalInfo.industry'] = { $regex: industry, $options: 'i' };
    }

    // Filter by experience
    if (experience) {
      const [minExp] = experience.split('-').map(Number);
      query['professionalInfo.experience'] = { $gte: minExp };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const users = await User.find(query)
      .select('firstName lastName bio location professionalInfo profilePicture')
      .sort({ 'professionalInfo.experience': -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalUsers: total,
        hasNext: skip + users.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      message: 'Server error while searching users'
    });
  }
});

// @route   POST /api/users/profile-picture
// @desc    Upload profile picture
// @access  Private
router.post('/profile-picture', protect, async (req, res) => {
  try {
    const { profilePictureUrl } = req.body;

    if (!profilePictureUrl) {
      return res.status(400).json({
        message: 'Profile picture URL is required'
      });
    }

    // Validate URL
    try {
      new URL(profilePictureUrl);
    } catch (error) {
      return res.status(400).json({
        message: 'Please provide a valid URL'
      });
    }

    const user = await User.findById(req.user._id);
    user.profilePicture = profilePictureUrl;
    await user.save();

    res.json({
      message: 'Profile picture updated successfully',
      profilePicture: profilePictureUrl
    });
  } catch (error) {
    console.error('Update profile picture error:', error);
    res.status(500).json({
      message: 'Server error while updating profile picture'
    });
  }
});

// @route   DELETE /api/users/profile-picture
// @desc    Remove profile picture
// @access  Private
router.delete('/profile-picture', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.profilePicture = '';
    await user.save();

    res.json({
      message: 'Profile picture removed successfully'
    });
  } catch (error) {
    console.error('Remove profile picture error:', error);
    res.status(500).json({
      message: 'Server error while removing profile picture'
    });
  }
});

// @route   GET /api/users/:id/skills
// @desc    Get public skills of a user
// @access  Public
router.get('/:id/skills', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Check privacy settings
    if (user.preferences.privacy === 'private') {
      return res.status(403).json({
        message: 'This profile is private'
      });
    }

    // Import Skill model here to avoid circular dependency
    const Skill = require('../models/Skill');
    
    const skills = await Skill.find({
      user: req.params.id,
      isPublic: true
    })
    .sort({ createdAt: -1 });

    res.json({
      skills,
      count: skills.length
    });
  } catch (error) {
    console.error('Get user skills error:', error);
    res.status(500).json({
      message: 'Server error while fetching user skills'
    });
  }
});

// @route   GET /api/users/stats/overview
// @desc    Get user statistics
// @access  Private
router.get('/stats/overview', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Import Skill model here to avoid circular dependency
    const Skill = require('../models/Skill');
    const Job = require('../models/Job');
    
    // Get skills count
    const skillsCount = await Skill.countDocuments({ user: req.user._id });
    const certificationsCount = await Skill.countDocuments({ 
      user: req.user._id, 
      type: 'certification' 
    });

    // Get job applications count
    const applicationsCount = await Job.countDocuments({
      'applications.applicant': req.user._id
    });

    // Get profile completion percentage
    const profileCompletion = user.profileCompletion;

    const stats = {
      profileCompletion,
      skillsCount,
      certificationsCount,
      applicationsCount,
      memberSince: user.createdAt,
      lastActive: user.lastLogin
    };

    res.json(stats);
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      message: 'Server error while fetching user statistics'
    });
  }
});

// @route   POST /api/users/connect/:id
// @desc    Send connection request to another user
// @access  Private
router.post('/connect/:id', protect, async (req, res) => {
  try {
    const targetUserId = req.params.id;
    
    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({
        message: 'You cannot connect with yourself'
      });
    }

    const targetUser = await User.findById(targetUserId);
    
    if (!targetUser) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Check if target user accepts connections
    if (targetUser.preferences.privacy === 'private') {
      return res.status(403).json({
        message: 'This user is not accepting connections'
      });
    }

    // In a real application, you would:
    // 1. Create a connection request
    // 2. Send notification to target user
    // 3. Handle connection status

    res.json({
      message: 'Connection request sent successfully'
    });
  } catch (error) {
    console.error('Send connection request error:', error);
    res.status(500).json({
      message: 'Server error while sending connection request'
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user account
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user owns this account or is admin
    if (userId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied. You can only delete your own account.'
      });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // In a real application, you would:
    // 1. Delete all associated data (skills, job applications, etc.)
    // 2. Handle file cleanup
    // 3. Send confirmation email
    // 4. Log the deletion

    await User.findByIdAndDelete(userId);

    res.json({
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      message: 'Server error while deleting account'
    });
  }
});

module.exports = router;
