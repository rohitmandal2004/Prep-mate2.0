const mongoose = require('mongoose');
require('dotenv').config();

// Import the Job model
const Job = require('./models/Job');

// Sample tech jobs data that matches the Job schema
const sampleJobs = [
    {
        title: "Senior Frontend Developer",
        company: {
            name: "TechCorp Solutions",
            size: "Medium",
            industry: "Technology"
        },
        location: {
            type: "Remote",
            country: "United States"
        },
        jobType: "Full-time",
        experience: {
            min: 3,
            max: 5
        },
        salary: {
            min: 80000,
            max: 120000,
            currency: "USD",
            period: "Yearly"
        },
        description: "We're looking for a skilled Frontend Developer to join our team and help build amazing user experiences. You'll work with modern technologies and collaborate with designers and backend developers to create responsive, accessible, and performant web applications.",
        requirements: {
            skills: [
                { name: "React.js", level: "Required" },
                { name: "TypeScript", level: "Required" },
                { name: "CSS3", level: "Required" },
                { name: "HTML5", level: "Required" },
                { name: "JavaScript ES6+", level: "Required" },
                { name: "Responsive design", level: "Required" },
                { name: "Git", level: "Required" },
                { name: "REST APIs", level: "Preferred" },
                { name: "Performance optimization", level: "Preferred" }
            ],
            education: {
                degree: "Bachelor's",
                field: "Computer Science or related",
                required: false
            }
        },
        benefits: [
            { category: "Health", name: "Health insurance", description: "Comprehensive health coverage" },
            { category: "Financial", name: "401k matching", description: "Company matches up to 6%" },
            { category: "Work-Life Balance", name: "Remote work", description: "Work from anywhere" },
            { category: "Work-Life Balance", name: "Flexible hours", description: "Flexible working schedule" },
            { category: "Professional Development", name: "Professional development", description: "Learning budget and courses" },
            { category: "Financial", name: "Stock options", description: "Equity in the company" }
        ],
        applicationProcess: {
            requirements: ["Resume", "Portfolio", "Cover Letter"],
            documents: ["Resume", "Portfolio", "Cover Letter"]
        },
        status: "Active",
        postedBy: {
            user: new mongoose.Types.ObjectId(), // Generate a dummy ObjectId
            role: "HR"
        },
        platform: "LinkedIn",
        tags: ["frontend", "react", "typescript", "remote"],
        isFeatured: true,
        isUrgent: true,
        externalUrl: "https://linkedin.com/jobs/view/123456"
    },
    {
        title: "Backend Engineer",
        company: {
            name: "DataFlow Systems",
            size: "Large",
            industry: "Data & Analytics"
        },
        location: {
            type: "On-site",
            city: "San Francisco",
            state: "CA",
            country: "United States"
        },
        jobType: "Full-time",
        experience: {
            min: 2,
            max: 4
        },
        salary: {
            min: 100000,
            max: 150000,
            currency: "USD",
            period: "Yearly"
        },
        description: "Join our backend team to build scalable APIs and microservices. You'll work on high-traffic applications and help optimize our database performance. This role involves working with cutting-edge technologies and contributing to architectural decisions.",
        requirements: {
            skills: [
                { name: "Node.js", level: "Required" },
                { name: "MongoDB", level: "Required" },
                { name: "Express.js", level: "Required" },
                { name: "REST APIs", level: "Required" },
                { name: "Microservices", level: "Required" },
                { name: "Docker", level: "Preferred" },
                { name: "AWS", level: "Preferred" },
                { name: "Testing", level: "Required" },
                { name: "Performance optimization", level: "Preferred" }
            ],
            education: {
                degree: "Bachelor's",
                field: "Computer Science or related",
                required: true
            }
        },
        benefits: [
            { category: "Financial", name: "Competitive salary", description: "Above market rate compensation" },
            { category: "Health", name: "Health benefits", description: "Medical, dental, and vision" },
            { category: "Financial", name: "Stock options", description: "Equity participation" },
            { category: "Work-Life Balance", name: "Gym membership", description: "Fitness center access" },
            { category: "Professional Development", name: "Learning budget", description: "Annual learning allowance" },
            { category: "Professional Development", name: "Conference attendance", description: "Tech conference budget" }
        ],
        applicationProcess: {
            requirements: ["Resume", "Technical Assessment", "Interview"],
            documents: ["Resume", "Cover Letter"]
        },
        status: "Active",
        postedBy: {
            user: new mongoose.Types.ObjectId(),
            role: "Hiring Manager"
        },
        platform: "Indeed",
        tags: ["backend", "nodejs", "mongodb", "microservices"],
        isFeatured: false,
        isUrgent: false,
        externalUrl: "https://indeed.com/viewjob?jk=789012"
    },
    {
        title: "Full Stack Developer",
        company: {
            name: "StartupXYZ",
            size: "Startup",
            industry: "Fintech"
        },
        location: {
            type: "Hybrid",
            city: "New York",
            state: "NY",
            country: "United States"
        },
        jobType: "Contract",
        experience: {
            min: 1,
            max: 3
        },
        salary: {
            min: 90000,
            max: 130000,
            currency: "USD",
            period: "Yearly"
        },
        description: "Help us build the next big thing in fintech with modern web technologies. This is a contract position with potential for full-time conversion. You'll work on both frontend and backend, contributing to product decisions and technical architecture.",
        requirements: {
            skills: [
                { name: "React", level: "Required" },
                { name: "Node.js", level: "Required" },
                { name: "PostgreSQL", level: "Required" },
                { name: "AWS", level: "Required" },
                { name: "TypeScript", level: "Preferred" },
                { name: "GraphQL", level: "Preferred" },
                { name: "Testing", level: "Required" },
                { name: "CI/CD", level: "Preferred" },
                { name: "Agile methodology", level: "Required" }
            ],
            education: {
                degree: "Bachelor's",
                field: "Computer Science or related",
                required: false
            }
        },
        benefits: [
            { category: "Financial", name: "Competitive hourly rate", description: "Above market hourly compensation" },
            { category: "Work-Life Balance", name: "Flexible schedule", description: "Choose your working hours" },
            { category: "Work-Life Balance", name: "Remote options", description: "Work from home when needed" },
            { category: "Professional Development", name: "Latest equipment", description: "High-end development setup" },
            { category: "Professional Development", name: "Professional development", description: "Skill enhancement opportunities" }
        ],
        applicationProcess: {
            requirements: ["Portfolio", "Technical Assessment", "Interview"],
            documents: ["Resume", "Portfolio", "Cover Letter"]
        },
        status: "Active",
        postedBy: {
            user: new mongoose.Types.ObjectId(),
            role: "Recruiter"
        },
        platform: "Glassdoor",
        tags: ["fullstack", "react", "nodejs", "fintech"],
        isFeatured: true,
        isUrgent: true,
        externalUrl: "https://glassdoor.com/job-listing/345678"
    },
    {
        title: "DevOps Engineer",
        company: {
            name: "CloudTech Solutions",
            size: "Large",
            industry: "Cloud Computing"
        },
        location: {
            type: "On-site",
            city: "Austin",
            state: "TX",
            country: "United States"
        },
        jobType: "Full-time",
        experience: {
            min: 3,
            max: 6
        },
        salary: {
            min: 110000,
            max: 160000,
            currency: "USD",
            period: "Yearly"
        },
        description: "Manage our cloud infrastructure and deployment pipelines. You'll work on automation, monitoring, and ensuring our systems are scalable and reliable. This role involves working with multiple cloud providers and implementing best practices.",
        requirements: {
            skills: [
                { name: "Docker", level: "Required" },
                { name: "Kubernetes", level: "Required" },
                { name: "AWS", level: "Required" },
                { name: "CI/CD", level: "Required" },
                { name: "Terraform", level: "Required" },
                { name: "Monitoring", level: "Required" },
                { name: "Linux", level: "Required" },
                { name: "Scripting", level: "Required" },
                { name: "Networking", level: "Preferred" }
            ],
            education: {
                degree: "Bachelor's",
                field: "Computer Science, IT, or related",
                required: true
            }
        },
        benefits: [
            { category: "Health", name: "Health insurance", description: "Comprehensive medical coverage" },
            { category: "Health", name: "Dental coverage", description: "Dental and vision benefits" },
            { category: "Health", name: "Vision coverage", description: "Eye care benefits" },
            { category: "Financial", name: "401k", description: "Retirement savings plan" },
            { category: "Professional Development", name: "Professional certifications", description: "Certification reimbursement" },
            { category: "Professional Development", name: "Conference budget", description: "Annual conference allowance" }
        ],
        applicationProcess: {
            requirements: ["Resume", "Technical Interview", "Reference Check"],
            documents: ["Resume", "Cover Letter"]
        },
        status: "Active",
        postedBy: {
            user: new mongoose.Types.ObjectId(),
            role: "Hiring Manager"
        },
        platform: "LinkedIn",
        tags: ["devops", "kubernetes", "aws", "automation"],
        isFeatured: false,
        isUrgent: false,
        externalUrl: "https://linkedin.com/jobs/view/456789"
    },
    {
        title: "UI/UX Designer",
        company: {
            name: "DesignStudio Creative",
            size: "Small",
            industry: "Design & Creative"
        },
        location: {
            type: "Remote",
            country: "United States"
        },
        jobType: "Part-time",
        experience: {
            min: 2,
            max: 4
        },
        salary: {
            min: 60000,
            max: 90000,
            currency: "USD",
            period: "Yearly"
        },
        description: "Create beautiful and intuitive user interfaces for web and mobile applications. You'll work closely with developers and product managers to deliver exceptional user experiences. This role involves user research, prototyping, and design system development.",
        requirements: {
            skills: [
                { name: "Figma", level: "Required" },
                { name: "Adobe Creative Suite", level: "Required" },
                { name: "User Research", level: "Required" },
                { name: "Prototyping", level: "Required" },
                { name: "Design Systems", level: "Preferred" },
                { name: "Accessibility", level: "Preferred" },
                { name: "Mobile design", level: "Required" },
                { name: "User testing", level: "Required" }
            ],
            education: {
                degree: "Bachelor's",
                field: "Design, HCI, or related",
                required: false
            }
        },
        benefits: [
            { category: "Work-Life Balance", name: "Flexible hours", description: "Choose your working schedule" },
            { category: "Work-Life Balance", name: "Remote work", description: "Work from anywhere" },
            { category: "Professional Development", name: "Creative freedom", description: "Autonomy in design decisions" },
            { category: "Professional Development", name: "Portfolio building", description: "Build your design portfolio" },
            { category: "Professional Development", name: "Professional tools", description: "Access to design software" },
            { category: "Professional Development", name: "Learning resources", description: "Design courses and resources" }
        ],
        applicationProcess: {
            requirements: ["Portfolio", "Design Challenge", "Interview"],
            documents: ["Resume", "Portfolio", "Cover Letter"]
        },
        status: "Active",
        postedBy: {
            user: new mongoose.Types.ObjectId(),
            role: "Hiring Manager"
        },
        platform: "Other",
        tags: ["design", "ui", "ux", "figma"],
        isFeatured: false,
        isUrgent: false,
        externalUrl: "https://behance.net/job/567890"
    },
    {
        title: "Data Scientist",
        company: {
            name: "AnalyticsPro Inc",
            size: "Medium",
            industry: "Data & Analytics"
        },
        location: {
            type: "On-site",
            city: "Boston",
            state: "MA",
            country: "United States"
        },
        jobType: "Full-time",
        experience: {
            min: 3,
            max: 5
        },
        salary: {
            min: 120000,
            max: 180000,
            currency: "USD",
            period: "Yearly"
        },
        description: "Build machine learning models and analyze complex datasets to drive business decisions. You'll work on predictive analytics and data visualization. This role involves working with large datasets and implementing ML algorithms.",
        requirements: {
            skills: [
                { name: "Python", level: "Required" },
                { name: "TensorFlow", level: "Required" },
                { name: "SQL", level: "Required" },
                { name: "Statistics", level: "Required" },
                { name: "Machine Learning", level: "Required" },
                { name: "Data visualization", level: "Required" },
                { name: "Big Data", level: "Preferred" },
                { name: "A/B testing", level: "Preferred" },
                { name: "R or Julia", level: "Preferred" }
            ],
            education: {
                degree: "Master's",
                field: "Data Science, Statistics, or related",
                required: true
            }
        },
        benefits: [
            { category: "Financial", name: "Competitive salary", description: "Above market compensation" },
            { category: "Health", name: "Health benefits", description: "Medical, dental, and vision" },
            { category: "Financial", name: "401k", description: "Retirement savings plan" },
            { category: "Financial", name: "Stock options", description: "Equity participation" },
            { category: "Professional Development", name: "Research budget", description: "Research and experimentation funds" },
            { category: "Professional Development", name: "Conference attendance", description: "Data science conferences" },
            { category: "Professional Development", name: "Publication support", description: "Support for research publications" }
        ],
        applicationProcess: {
            requirements: ["Resume", "Technical Assessment", "Take-home Project"],
            documents: ["Resume", "Cover Letter"]
        },
        status: "Active",
        postedBy: {
            user: new mongoose.Types.ObjectId(),
            role: "Hiring Manager"
        },
        platform: "LinkedIn",
        tags: ["datascience", "machinelearning", "python", "analytics"],
        isFeatured: true,
        isUrgent: true,
        externalUrl: "https://linkedin.com/jobs/view/678901"
    }
];

// Connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prepmate', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

// Seed the database with sample jobs
async function seedJobs() {
    try {
        // Clear existing jobs
        await Job.deleteMany({});
        console.log('🗑️  Cleared existing jobs');

        // Insert sample jobs
        const insertedJobs = await Job.insertMany(sampleJobs);
        console.log(`✅ Successfully inserted ${insertedJobs.length} jobs`);

        // Display summary
        console.log('\n📊 Jobs Summary:');
        insertedJobs.forEach(job => {
            console.log(`- ${job.title} at ${job.company.name} (${job.location.type})`);
        });

        console.log('\n🎉 Database seeding completed successfully!');
        console.log('🚀 Your frontend should now display these jobs from MongoDB');

    } catch (error) {
        console.error('❌ Error seeding jobs:', error);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

// Run the seeding process
async function main() {
    console.log('🌱 Starting job database seeding...\n');
    await connectDB();
    await seedJobs();
}

// Run if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { seedJobs, sampleJobs };
