# Prepmate Backend API

A comprehensive MERN stack backend for the Prepmate job portal and skills management platform.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (User, Employer, Admin)
  - Password hashing with bcrypt
  - Email verification system

- **Skills & Certifications Management**
  - Add, edit, delete skills and certifications
  - PDF file upload for certifications
  - Skill endorsements and ratings
  - Category-based organization
  - Expiry tracking for certifications

- **Job Management**
  - Create, edit, delete job postings
  - Advanced filtering and search
  - Application tracking system
  - Job statistics and analytics

- **Exam Preparation Resources**
  - Comprehensive exam database
  - Study materials and practice tests
  - User reviews and ratings
  - Difficulty and category filtering

- **User Profiles**
  - Professional profile management
  - Privacy controls
  - Connection system
  - Profile completion tracking

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd prepmate-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy the environment template
   cp env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Environment Variables**
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/prepmate
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   
   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   
   # File Upload Configuration
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=uploads
   ```

5. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 🗄️ Database Setup

1. **Install MongoDB**
   - [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

2. **Create Database**
   ```bash
   mongosh
   use prepmate
   ```

3. **Or use MongoDB Atlas (Cloud)**
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create cluster and get connection string
   - Update `MONGODB_URI` in `.env`

## 📁 Project Structure

```
backend/
├── models/           # Database models
│   ├── User.js      # User model with authentication
│   ├── Skill.js     # Skills and certifications
│   ├── Job.js       # Job postings
│   └── Exam.js      # Exam resources
├── routes/           # API route handlers
│   ├── auth.js      # Authentication routes
│   ├── users.js     # User management
│   ├── skills.js    # Skills and certifications
│   ├── jobs.js      # Job management
│   └── exams.js     # Exam resources
├── middleware/       # Custom middleware
│   └── auth.js      # Authentication middleware
├── uploads/          # File uploads directory
├── server.js         # Main server file
├── package.json      # Dependencies and scripts
└── README.md         # This file
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify-email` - Email verification

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id` - Get public user profile
- `GET /api/users/search` - Search users
- `POST /api/users/profile-picture` - Upload profile picture
- `DELETE /api/users/profile-picture` - Remove profile picture
- `GET /api/users/:id/skills` - Get user's public skills
- `GET /api/users/stats/overview` - Get user statistics
- `POST /api/users/connect/:id` - Send connection request
- `DELETE /api/users/:id` - Delete user account

### Skills & Certifications
- `GET /api/skills` - Get user's skills
- `GET /api/skills/:id` - Get specific skill
- `POST /api/skills` - Create new skill/certification
- `PUT /api/skills/:id` - Update skill/certification
- `DELETE /api/skills/:id` - Delete skill/certification
- `GET /api/skills/public/:userId` - Get public skills
- `POST /api/skills/:id/endorse` - Endorse a skill
- `DELETE /api/skills/:id/endorse` - Remove endorsement
- `GET /api/skills/stats/overview` - Get skills statistics

### Jobs
- `GET /api/jobs` - Get all jobs with filtering
- `GET /api/jobs/:id` - Get specific job
- `POST /api/jobs` - Create new job posting
- `PUT /api/jobs/:id` - Update job posting
- `DELETE /api/jobs/:id` - Delete job posting
- `POST /api/jobs/:id/apply` - Apply for a job
- `GET /api/jobs/:id/applications` - Get job applications
- `PUT /api/jobs/:id/applications/:applicationId` - Update application status
- `GET /api/jobs/stats/overview` - Get job statistics

### Exams
- `GET /api/exams` - Get all exams with filtering
- `GET /api/exams/:id` - Get specific exam
- `POST /api/exams` - Create new exam (admin only)
- `PUT /api/exams/:id` - Update exam (admin only)
- `DELETE /api/exams/:id` - Delete exam (admin only)
- `POST /api/exams/:id/reviews` - Add exam review
- `PUT /api/exams/:id/reviews/:reviewId` - Update review
- `DELETE /api/exams/:id/reviews/:reviewId` - Delete review
- `GET /api/exams/categories/list` - Get exam categories
- `GET /api/exams/stats/overview` - Get exam statistics

## 🔒 Authentication & Authorization

### JWT Token
- Include in request headers: `Authorization: Bearer <token>`
- Token expires in 7 days (configurable)
- Automatic token refresh endpoint available

### Role-Based Access Control
- **User**: Basic access to own resources
- **Employer**: Can post jobs and manage applications
- **Admin**: Full system access

### Protected Routes
- Most routes require valid JWT token
- Some routes have additional role requirements
- Public routes marked with `optionalAuth` middleware

## 📁 File Uploads

### Supported Formats
- **Certifications**: PDF files only
- **Profile Pictures**: URL-based (external service)

### File Storage
- Files stored in `uploads/certifications/` directory
- Unique filename generation to prevent conflicts
- File size limit: 10MB (configurable)
- Automatic cleanup on deletion

## 🧪 Testing

### Manual Testing
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test authentication
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"Password123!"}'
```

### API Testing Tools
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- [Thunder Client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client)

## 🚀 Deployment

### Production Considerations
1. **Environment Variables**
   - Set `NODE_ENV=production`
   - Use strong `JWT_SECRET`
   - Configure production MongoDB URI

2. **Security**
   - Enable HTTPS
   - Configure CORS for production domain
   - Set up rate limiting
   - Use environment-specific secrets

3. **Performance**
   - Enable compression
   - Configure proper logging
   - Set up monitoring and alerts

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📊 Monitoring & Logging

### Built-in Logging
- HTTP request logging with Morgan
- Error logging to console
- Request/response logging

### Health Checks
- `/api/health` endpoint for monitoring
- Database connection status
- Server uptime information

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the error logs

## 🔄 Updates & Maintenance

### Regular Maintenance
- Update dependencies regularly
- Monitor security advisories
- Backup database regularly
- Monitor performance metrics

### Version Updates
- Follow semantic versioning
- Maintain backward compatibility
- Document breaking changes
- Provide migration guides

---

**Happy Coding! 🚀**
