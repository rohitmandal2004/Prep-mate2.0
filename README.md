# Prepmate - Job Search & Career Development Website

A modern, responsive website that showcases job openings from different platforms, exam preparation resources, and essential skills for career development.

## 🌟 Features

### 📋 Job Openings Section
- **Multi-Platform Integration**: Jobs from LinkedIn, Indeed, Glassdoor, and Monster
- **Filtering System**: Filter jobs by platform using interactive tabs
- **Detailed Job Cards**: Each job includes:
  - Job title and company name
  - Location and salary information
  - Job type (Full-time, Part-time, etc.)
  - Required skills and technologies
  - Platform source badge
- **Apply Functionality**: Interactive application modal with form submission

### 📚 Exam Preparation Section
- **Professional Certifications**:
  - AWS Certification (Foundation, Associate, Professional)
  - Microsoft Azure (Fundamentals, Associate, Expert)
  - CISSP (Information Security)
- **Programming & Development**:
  - Oracle Java (Associate, Professional)
  - Python Institute (PCAP, PCPP)
  - Microsoft .NET (Associate, Expert)
- **Business & Management**:
  - PMP Certification (Project Management)
  - ITIL Foundation (IT Service Management)
  - Six Sigma (Green Belt, Black Belt)

### 💼 Skills Section
- **Technical Skills**:
  - Web Development (HTML, CSS, JavaScript, React, Angular, Vue.js)
  - Mobile Development (iOS, Android, React Native, Flutter)
  - Cloud Computing (AWS, Azure, Google Cloud, Docker, Kubernetes)
  - Data Science & AI (Python, R, Machine Learning, Deep Learning)
- **Soft Skills**:
  - Communication
  - Problem Solving
  - Teamwork
  - Time Management
- **Demand Level Indicators**: Visual bars showing skill demand in the market

### 🎨 Design Features
- **Modern UI/UX**: Clean, professional design with gradient backgrounds
- **Responsive Design**: Fully responsive across all devices
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Accessibility**: Proper contrast ratios and keyboard navigation
- **Loading Animations**: Smooth page load and element animations

### 🔧 Interactive Features
- **Mobile Navigation**: Hamburger menu for mobile devices
- **Smooth Scrolling**: Navigation links with smooth scroll behavior
- **Job Application Modal**: Complete application form with file upload
- **Contact Form**: Functional contact form with validation
- **Newsletter Subscription**: Email subscription with validation
- **Notification System**: Success/error notifications
- **Scroll to Top**: Floating button for easy navigation

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Installation
1. Clone or download the project files
2. Open `index.html` in your web browser
3. The website will load with all features ready to use

### File Structure
```
job/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Desktop**: 1200px+ (Full layout with side-by-side sections)
- **Tablet**: 768px - 1199px (Adjusted grid layouts)
- **Mobile**: < 768px (Single column layout with mobile navigation)

## 🎯 Key Sections

### 1. Hero Section
- Eye-catching gradient background
- Clear value proposition
- Call-to-action buttons

### 2. Job Openings
- Platform filtering tabs
- Job cards with comprehensive information
- Apply functionality with modal form

### 3. Exam Preparation
- Categorized certification programs
- Visual icons for each certification
- Level indicators for different expertise levels

### 4. Skills Development
- Technical and soft skills categories
- Demand level visualization
- Interactive skill cards

### 5. Contact Section
- Contact information display
- Functional contact form
- Newsletter subscription

## 🔧 Customization

### Adding New Jobs
To add new job listings, add a new `.job-card` element in the jobs section:

```html
<div class="job-card" data-platform="linkedin">
    <div class="job-header">
        <h3>Job Title</h3>
        <span class="company">Company Name</span>
        <span class="location"><i class="fas fa-map-marker-alt"></i> Location</span>
    </div>
    <div class="job-details">
        <span class="salary">$Salary Range</span>
        <span class="type">Job Type</span>
        <span class="platform-badge linkedin">Platform</span>
    </div>
    <p class="job-description">Job description...</p>
    <div class="job-tags">
        <span class="tag">Skill 1</span>
        <span class="tag">Skill 2</span>
    </div>
    <button class="btn btn-apply">Apply Now</button>
</div>
```

### Adding New Platforms
To add a new job platform:

1. Add a new tab button in the platform tabs section
2. Add corresponding CSS for the platform badge
3. Update the JavaScript filtering logic if needed

### Modifying Colors
The website uses CSS custom properties for easy color customization. Main colors are defined in the CSS file and can be easily modified.

## 🌐 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support or questions, please contact:
- Email: info@prepmate.com
- Phone: +1 (555) 123-4567

## 🔄 Updates

### Version 1.0.0
- Initial release with core features
- Job listings from multiple platforms
- Exam preparation resources
- Skills development section
- Responsive design
- Interactive application system

---

**Prepmate** - Your gateway to career opportunities, exam preparation, and skill development. 