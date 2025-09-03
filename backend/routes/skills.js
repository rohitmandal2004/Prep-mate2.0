const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const Skill = require('../models/Skill');
const { protect, authorize } = require('../middleware/auth');

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/certifications';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp + original name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // Only allow PDF files
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  },
  fileFilter: fileFilter
});

// @route   GET /api/skills
// @desc    Get all skills for a user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { type, category, search } = req.query;
    
    let query = { user: req.user._id };
    
    // Filter by type (skill or certification)
    if (type && ['skill', 'certification'].includes(type)) {
      query.type = type;
    }
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Search in name and description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skills = await Skill.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'firstName lastName email');
    
    res.json({
      count: skills.length,
      skills
    });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({
      message: 'Server error while fetching skills'
    });
  }
});

// @route   GET /api/skills/:id
// @desc    Get a specific skill by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate('user', 'firstName lastName email');
    
    if (!skill) {
      return res.status(404).json({
        message: 'Skill not found'
      });
    }
    
    // Check if user owns this skill or if it's public
    if (skill.user._id.toString() !== req.user._id.toString() && !skill.isPublic) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }
    
    res.json({
      skill
    });
  } catch (error) {
    console.error('Get skill error:', error);
    res.status(500).json({
      message: 'Server error while fetching skill'
    });
  }
});

// @route   POST /api/skills
// @desc    Create a new skill or certification
// @access  Private
router.post('/', [
  protect,
  upload.single('pdfFile'),
  body('type')
    .isIn(['skill', 'certification'])
    .withMessage('Type must be either skill or certification'),
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('category')
    .isIn([
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
    ])
    .withMessage('Invalid category'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('url')
    .optional()
    .isURL()
    .withMessage('Please provide a valid URL'),
  // Certification specific validation
  body('certification.issuer')
    .if(body('type').equals('certification'))
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Certification issuer is required and must be between 1 and 100 characters'),
  body('certification.level')
    .if(body('type').equals('certification'))
    .isIn(['Foundation', 'Associate', 'Professional', 'Expert', 'Specialist'])
    .withMessage('Invalid certification level'),
  body('certification.dateObtained')
    .if(body('type').equals('certification'))
    .isISO8601()
    .withMessage('Valid date obtained is required for certifications'),
  body('certification.expiryDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid expiry date'),
  body('certification.certificationId')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Certification ID cannot exceed 50 characters'),
  // Skill specific validation
  body('skill.yearsOfExperience')
    .optional()
    .isFloat({ min: 0, max: 50 })
    .withMessage('Years of experience must be between 0 and 50'),
  body('proficiencyLevel')
    .if(body('type').equals('skill'))
    .isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
    .withMessage('Proficiency level is required for skills')
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
      type,
      name,
      category,
      description,
      icon,
      url,
      certification,
      skill,
      tags,
      isPublic
    } = req.body;

    // Create skill object
    const skillData = {
      user: req.user._id,
      type,
      name,
      category,
      description,
      icon: icon || 'fas fa-code',
      url,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      isPublic: isPublic !== undefined ? isPublic : true
    };

    // Add type-specific data
    if (type === 'certification') {
      skillData.certification = {
        ...certification,
        dateObtained: new Date(certification.dateObtained),
        expiryDate: certification.expiryDate ? new Date(certification.expiryDate) : undefined
      };

      // Handle PDF file upload
      if (req.file) {
        skillData.certification.pdfFile = {
          filename: req.file.filename,
          originalName: req.file.originalname,
          path: req.file.path,
          size: req.file.size,
          uploadedAt: new Date()
        };
      }
    } else if (type === 'skill') {
      skillData.proficiencyLevel = req.body.proficiencyLevel;
      if (skill) {
        skillData.skill = skill;
      }
    }

    const newSkill = new Skill(skillData);
    await newSkill.save();

    // Populate user info
    await newSkill.populate('user', 'firstName lastName email');

    res.status(201).json({
      message: `${type === 'certification' ? 'Certification' : 'Skill'} created successfully`,
      skill: newSkill
    });
  } catch (error) {
    console.error('Create skill error:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    res.status(500).json({
      message: 'Server error while creating skill'
    });
  }
});

// @route   PUT /api/skills/:id
// @desc    Update a skill or certification
// @access  Private
router.put('/:id', [
  protect,
  upload.single('pdfFile'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('url')
    .optional()
    .isURL()
    .withMessage('Please provide a valid URL')
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

    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({
        message: 'Skill not found'
      });
    }

    // Check if user owns this skill
    if (skill.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Access denied. You can only modify your own skills.'
      });
    }

    // Update fields
    const updateFields = ['name', 'category', 'description', 'icon', 'url', 'tags', 'isPublic'];
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'tags') {
          skill[field] = req.body[field].split(',').map(tag => tag.trim());
        } else {
          skill[field] = req.body[field];
        }
      }
    });

    // Update type-specific fields
    if (skill.type === 'certification' && req.body.certification) {
      Object.keys(req.body.certification).forEach(key => {
        if (req.body.certification[key] !== undefined) {
          if (key === 'dateObtained' || key === 'expiryDate') {
            skill.certification[key] = new Date(req.body.certification[key]);
          } else {
            skill.certification[key] = req.body.certification[key];
          }
        }
      });

      // Handle new PDF file upload
      if (req.file) {
        // Delete old file if it exists
        if (skill.certification.pdfFile && skill.certification.pdfFile.path) {
          fs.unlink(skill.certification.pdfFile.path, (err) => {
            if (err) console.error('Error deleting old file:', err);
          });
        }

        skill.certification.pdfFile = {
          filename: req.file.filename,
          originalName: req.file.originalname,
          path: req.file.path,
          size: req.file.size,
          uploadedAt: new Date()
        };
      }
    } else if (skill.type === 'skill') {
      if (req.body.proficiencyLevel) {
        skill.proficiencyLevel = req.body.proficiencyLevel;
      }
      if (req.body.skill) {
        skill.skill = { ...skill.skill, ...req.body.skill };
      }
    }

    await skill.save();
    await skill.populate('user', 'firstName lastName email');

    res.json({
      message: 'Skill updated successfully',
      skill
    });
  } catch (error) {
    console.error('Update skill error:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    res.status(500).json({
      message: 'Server error while updating skill'
    });
  }
});

// @route   DELETE /api/skills/:id
// @desc    Delete a skill or certification
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({
        message: 'Skill not found'
      });
    }

    // Check if user owns this skill
    if (skill.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Access denied. You can only delete your own skills.'
      });
    }

    // Delete associated PDF file if it exists
    if (skill.type === 'certification' && skill.certification.pdfFile && skill.certification.pdfFile.path) {
      fs.unlink(skill.certification.pdfFile.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    await Skill.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({
      message: 'Server error while deleting skill'
    });
  }
});

// @route   GET /api/skills/public/:userId
// @desc    Get public skills for a specific user
// @access  Public
router.get('/public/:userId', async (req, res) => {
  try {
    const skills = await Skill.find({
      user: req.params.userId,
      isPublic: true
    })
    .populate('user', 'firstName lastName')
    .sort({ createdAt: -1 });

    res.json({
      count: skills.length,
      skills
    });
  } catch (error) {
    console.error('Get public skills error:', error);
    res.status(500).json({
      message: 'Server error while fetching public skills'
    });
  }
});

// @route   POST /api/skills/:id/endorse
// @desc    Endorse a skill
// @access  Private
router.post('/:id/endorse', protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({
        message: 'Skill not found'
      });
    }

    // Check if user already endorsed this skill
    const existingEndorsement = skill.endorsements.find(
      endorsement => endorsement.user.toString() === req.user._id.toString()
    );

    if (existingEndorsement) {
      return res.status(400).json({
        message: 'You have already endorsed this skill'
      });
    }

    // Add endorsement
    skill.endorsements.push({
      user: req.user._id,
      date: new Date()
    });

    skill.endorsementCount = skill.endorsements.length;
    await skill.save();

    res.json({
      message: 'Skill endorsed successfully',
      endorsementCount: skill.endorsementCount
    });
  } catch (error) {
    console.error('Endorse skill error:', error);
    res.status(500).json({
      message: 'Server error while endorsing skill'
    });
  }
});

// @route   DELETE /api/skills/:id/endorse
// @desc    Remove endorsement from a skill
// @access  Private
router.delete('/:id/endorse', protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({
        message: 'Skill not found'
      });
    }

    // Remove endorsement
    skill.endorsements = skill.endorsements.filter(
      endorsement => endorsement.user.toString() !== req.user._id.toString()
    );

    skill.endorsementCount = skill.endorsements.length;
    await skill.save();

    res.json({
      message: 'Endorsement removed successfully',
      endorsementCount: skill.endorsementCount
    });
  } catch (error) {
    console.error('Remove endorsement error:', error);
    res.status(500).json({
      message: 'Server error while removing endorsement'
    });
  }
});

// @route   GET /api/skills/stats/overview
// @desc    Get skills statistics for the current user
// @access  Private
router.get('/stats/overview', protect, async (req, res) => {
  try {
    const stats = await Skill.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalSkills: { $sum: { $cond: [{ $eq: ['$type', 'skill'] }, 1, 0] } },
          totalCertifications: { $sum: { $cond: [{ $eq: ['$type', 'certification'] }, 1, 0] } },
          categories: { $addToSet: '$category' },
          avgEndorsements: { $avg: '$endorsementCount' }
        }
      }
    ]);

    const categoryStats = await Skill.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const response = {
      overview: stats[0] || {
        totalSkills: 0,
        totalCertifications: 0,
        categories: [],
        avgEndorsements: 0
      },
      categoryBreakdown: categoryStats
    };

    res.json(response);
  } catch (error) {
    console.error('Get skills stats error:', error);
    res.status(500).json({
      message: 'Server error while fetching skills statistics'
    });
  }
});

module.exports = router;
