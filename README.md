# 🚀 Prepmate - Job Portal & Skills Management Platform

A comprehensive MERN stack application that combines job searching, skills management, and exam preparation in one platform.

## ✨ Features

### 🎯 **Job Portal**
- Browse and search job openings from multiple platforms
- Advanced filtering by location, experience, salary, and more
- Job application tracking system
- Employer dashboard for posting and managing jobs

### 💼 **Skills Management**
- **Personal Skills Portfolio**: Add, edit, and organize your skills
- **Certification Management**: Upload and track professional certifications
- **PDF Upload Support**: Store certification documents securely
- **Skill Endorsements**: Get recognized by peers and colleagues
- **Category Organization**: Organize skills by technology, domain, or expertise level

### 📚 **Exam Preparation**
- Comprehensive exam database with study materials
- Practice tests and study guides
- User reviews and ratings
- Difficulty-based filtering and recommendations

### 👤 **User Profiles**
- Professional profile management
- Privacy controls and settings
- Connection system for networking
- Profile completion tracking

## 🛠️ Tech Stack

### **Frontend**
- **HTML5, CSS3, JavaScript** - Core web technologies
- **Responsive Design** - Mobile-first approach
- **Modern UI/UX** - Clean, professional interface
- **Faded Blues Color Palette** - Consistent visual theme

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - Object Data Modeling
- **JWT** - Authentication and authorization
- **Multer** - File upload handling
- **Express-validator** - Input validation

### **Architecture**
- **RESTful API** - Clean, scalable API design
- **MVC Pattern** - Organized code structure
- **Middleware Architecture** - Modular request processing
- **Role-Based Access Control** - Secure user permissions

## 🚀 Quick Start

### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd prepmate
```

### **2. Backend Setup**
```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit environment variables
# Update MONGODB_URI and JWT_SECRET

# Start development server
npm run dev
```

### **3. Frontend Setup**
```bash
cd frontend

# Open index.html in your browser
# Or serve with a local server
python -m http.server 8000
```

### **4. Database Setup**
```bash
# Start MongoDB (if local)
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

## 📁 Project Structure

```
prepmate/
├── backend/                 # Backend API server
│   ├── models/             # Database models
│   ├── routes/             # API route handlers
│   ├── middleware/         # Custom middleware
│   ├── uploads/            # File storage
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── frontend/               # Frontend application
│   ├── index.html          # Main HTML file
│   ├── styles.css          # CSS styles
│   ├── script.js           # JavaScript functionality
│   └── README.md           # Frontend documentation
└── README.md               # This file
```

## 🔐 API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### **Skills & Certifications**
- `GET /api/skills` - Get user's skills
- `POST /api/skills` - Create new skill/certification
- `PUT /api/skills/:id` - Update skill/certification
- `DELETE /api/skills/:id` - Delete skill/certification

### **Jobs**
- `GET /api/jobs` - Browse job openings
- `POST /api/jobs` - Post new job (employers)
- `POST /api/jobs/:id/apply` - Apply for a job

### **Exams**
- `GET /api/exams` - Browse exam resources
- `GET /api/exams/:id` - Get exam details
- `POST /api/exams/:id/reviews` - Add exam review

## 🎨 Design Features

### **Color Palette**
- **Primary**: #edf2fa (Light Blue)
- **Secondary**: #d7e3fc (Soft Blue)
- **Accent**: #ccdbfd (Medium Blue)
- **Highlight**: #c1d3fe (Bright Blue)
- **Deep**: #abc4ff (Rich Blue)

### **UI Components**
- **Modern Cards**: Clean, shadow-based design
- **Responsive Grid**: Mobile-first layout system
- **Smooth Animations**: CSS transitions and hover effects
- **Interactive Elements**: Dynamic forms and modals

## 📱 Responsive Design

- **Desktop**: Full-featured interface
- **Tablet**: Optimized for medium screens
- **Mobile**: Touch-friendly mobile experience

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: Bcrypt encryption
- **Input Validation**: Server-side validation
- **File Upload Security**: Type and size restrictions
- **CORS Protection**: Cross-origin request handling

## 🧪 Testing

### **Backend Testing**
```bash
cd backend
npm run test
```

### **API Testing**
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test authentication
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"Password123!"}'
```

## 🚀 Deployment

### **Backend Deployment**
1. Set environment variables
2. Configure production database
3. Set up reverse proxy (nginx)
4. Use PM2 for process management

### **Frontend Deployment**
1. Build optimized assets
2. Deploy to CDN or web server
3. Configure CORS for production

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

## 🔄 Roadmap

### **Phase 1** ✅
- [x] Basic website structure
- [x] Job listings display
- [x] Skills management system
- [x] Exam preparation section

### **Phase 2** ✅
- [x] User authentication system
- [x] Backend API development
- [x] Database models and relationships
- [x] File upload functionality

### **Phase 3** 🚧
- [ ] Real-time notifications
- [ ] Advanced search algorithms
- [ ] Mobile app development
- [ ] AI-powered job matching

### **Phase 4** 📋
- [ ] Payment integration
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Enterprise features

## 🎯 Use Cases

### **Job Seekers**
- Browse and apply for jobs
- Build professional skills portfolio
- Track certifications and achievements
- Prepare for technical interviews

### **Employers**
- Post job openings
- Review applications
- Find qualified candidates
- Manage hiring process

### **Students & Professionals**
- Access exam preparation resources
- Track learning progress
- Build professional network
- Showcase skills and achievements

## 🌟 Key Benefits

- **All-in-One Platform**: Job search, skills management, and exam prep
- **Professional Portfolio**: Showcase skills and certifications
- **Modern Interface**: Clean, responsive design
- **Secure Backend**: Robust API with authentication
- **File Management**: PDF upload for certifications
- **Scalable Architecture**: MERN stack for growth

---

**Built with ❤️ using the MERN Stack**

**Happy Job Hunting & Skill Building! 🚀**
