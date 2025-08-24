// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Job Platform Filtering
const tabButtons = document.querySelectorAll('.tab-btn');
const jobCards = document.querySelectorAll('.job-card');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        const platform = button.getAttribute('data-platform');
        
        // Filter job cards
        jobCards.forEach(card => {
            if (platform === 'all' || card.getAttribute('data-platform') === platform) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.6s ease-out';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Apply Button Functionality
document.querySelectorAll('.btn-apply').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const jobTitle = this.closest('.job-card').querySelector('h3').textContent;
        const company = this.closest('.job-card').querySelector('.company').textContent;
        
        // Show application modal or redirect
        showApplicationModal(jobTitle, company);
    });
});

// Application Modal
function showApplicationModal(jobTitle, company) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay" id="applicationModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Apply for ${jobTitle}</h3>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <p><strong>Company:</strong> ${company}</p>
                    <p><strong>Position:</strong> ${jobTitle}</p>
                    <form class="application-form">
                        <div class="form-group">
                            <label for="applicantName">Full Name *</label>
                            <input type="text" id="applicantName" required>
                        </div>
                        <div class="form-group">
                            <label for="applicantEmail">Email *</label>
                            <input type="email" id="applicantEmail" required>
                        </div>
                        <div class="form-group">
                            <label for="applicantPhone">Phone</label>
                            <input type="tel" id="applicantPhone">
                        </div>
                        <div class="form-group">
                            <label for="applicantResume">Resume/CV *</label>
                            <input type="file" id="applicantResume" accept=".pdf,.doc,.docx" required>
                        </div>
                        <div class="form-group">
                            <label for="applicantCover">Cover Letter</label>
                            <textarea id="applicantCover" rows="4" placeholder="Tell us why you're interested in this position..."></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                            <button type="submit" class="btn btn-primary">Submit Application</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add modal styles
    addModalStyles();
    
    // Handle form submission
    document.querySelector('.application-form').addEventListener('submit', function(e) {
        e.preventDefault();
        submitApplication(jobTitle, company);
    });
}

function closeModal() {
    const modal = document.getElementById('applicationModal');
    if (modal) {
        modal.remove();
    }
}

function addModalStyles() {
    const styles = `
        <style>
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease-out;
            }
            
            .modal-content {
                background: white;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideIn 0.3s ease-out;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .modal-header h3 {
                margin: 0;
                color: #1f2937;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #6b7280;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .modal-close:hover {
                background: #f3f4f6;
                color: #1f2937;
            }
            
            .modal-body {
                padding: 1.5rem;
            }
            
            .application-form .form-group {
                margin-bottom: 1.5rem;
            }
            
            .application-form label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 500;
                color: #374151;
            }
            
            .application-form input,
            .application-form textarea {
                width: 100%;
                padding: 10px 12px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 1rem;
                transition: all 0.3s ease;
            }
            
            .application-form input:focus,
            .application-form textarea:focus {
                outline: none;
                border-color: #4f46e5;
                box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
            }
            
            .form-actions {
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
                margin-top: 2rem;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            @media (max-width: 768px) {
                .modal-content {
                    width: 95%;
                    margin: 1rem;
                }
                
                .form-actions {
                    flex-direction: column;
                }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

function submitApplication(jobTitle, company) {
    // Simulate form submission
    const submitBtn = document.querySelector('.application-form .btn-primary');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        // Show success message
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="success-message" style="text-align: center; padding: 2rem;">
                <i class="fas fa-check-circle" style="font-size: 3rem; color: #10b981; margin-bottom: 1rem;"></i>
                <h3 style="color: #10b981; margin-bottom: 1rem;">Application Submitted!</h3>
                <p style="color: #6b7280; margin-bottom: 2rem;">
                    Thank you for applying for the <strong>${jobTitle}</strong> position at <strong>${company}</strong>. 
                    We'll review your application and get back to you soon.
                </p>
                <button class="btn btn-primary" onclick="closeModal()">Close</button>
            </div>
        `;
    }, 2000);
}

// Contact Form Handling
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        this.innerHTML = `
            <div class="success-message" style="text-align: center; padding: 2rem;">
                <i class="fas fa-check-circle" style="font-size: 3rem; color: #10b981; margin-bottom: 1rem;"></i>
                <h3 style="color: #10b981; margin-bottom: 1rem;">Message Sent!</h3>
                <p style="color: #6b7280;">
                    Thank you for your message. We'll get back to you as soon as possible.
                </p>
            </div>
        `;
    }, 2000);
});

// Newsletter Subscription
document.querySelector('.newsletter-form .btn').addEventListener('click', function(e) {
    e.preventDefault();
    
    const emailInput = document.querySelector('.newsletter-form input');
    const email = emailInput.value.trim();
    
    if (!email || !isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    const originalText = this.textContent;
    this.textContent = 'Subscribing...';
    this.disabled = true;
    
    setTimeout(() => {
        emailInput.value = '';
        this.textContent = originalText;
        this.disabled = false;
        showNotification('Successfully subscribed to our newsletter!', 'success');
    }, 1500);
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Add notification styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = `
            <style id="notification-styles">
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10001;
                    animation: slideInRight 0.3s ease-out;
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    min-width: 300px;
                }
                
                .notification-success {
                    background: #10b981;
                }
                
                .notification-error {
                    background: #ef4444;
                }
                
                .notification-info {
                    background: #3b82f6;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    margin-left: auto;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Scroll to top functionality
window.addEventListener('scroll', function() {
    const scrollTop = document.querySelector('.scroll-top');
    
    if (window.pageYOffset > 300) {
        if (!scrollTop) {
            createScrollTopButton();
        }
    } else {
        if (scrollTop) {
            scrollTop.remove();
        }
    }
});

function createScrollTopButton() {
    const scrollTop = document.createElement('button');
    scrollTop.className = 'scroll-top';
    scrollTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const styles = `
        <style>
            .scroll-top {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: #4f46e5;
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.2rem;
                box-shadow: 0 4px 20px rgba(79, 70, 229, 0.3);
                transition: all 0.3s ease;
                z-index: 1000;
                animation: fadeInUp 0.3s ease-out;
            }
            
            .scroll-top:hover {
                background: #3730a3;
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
            }
        </style>
    `;
    
    if (!document.querySelector('#scroll-top-styles')) {
        document.head.insertAdjacentHTML('beforeend', styles.replace('}', '}').replace('{', '{'));
    }
    
    document.body.appendChild(scrollTop);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.job-card, .exam-card, .skill-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('applicationModal');
    if (modal && e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Initialize tooltips for skill levels
document.addEventListener('DOMContentLoaded', function() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        const levelBars = card.querySelectorAll('.bar');
        const levelLabel = card.querySelector('.level-label');
        
        levelBars.forEach((bar, index) => {
            bar.addEventListener('mouseenter', function() {
                const level = index + 1;
                const maxLevel = levelBars.length;
                const percentage = (level / maxLevel) * 100;
                
                this.title = `${level}/${maxLevel} (${percentage}%)`;
            });
        });
    });
    
    // Initialize My Skills section
    initializeMySkills();
    
    // Add event listener for skill form
    const addSkillForm = document.getElementById('addSkillForm');
    if (addSkillForm) {
        addSkillForm.addEventListener('submit', addSkill);
    }
});

// Add loading animation for images and icons
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Authentication Functions
function showLoginModal() {
    document.getElementById('loginModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function showSignupModal() {
    document.getElementById('signupModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAuthModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = 'auto';
}

function switchToSignup() {
    closeAuthModal('loginModal');
    setTimeout(() => showSignupModal(), 300);
}

function switchToLogin() {
    closeAuthModal('signupModal');
    setTimeout(() => showLoginModal(), 300);
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.parentElement.querySelector('.password-toggle i');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        toggle.className = 'fas fa-eye';
    }
}

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    let feedback = [];
    
    if (password.length >= 8) strength++;
    else feedback.push('At least 8 characters');
    
    if (/[a-z]/.test(password)) strength++;
    else feedback.push('Include lowercase letters');
    
    if (/[A-Z]/.test(password)) strength++;
    else feedback.push('Include uppercase letters');
    
    if (/[0-9]/.test(password)) strength++;
    else feedback.push('Include numbers');
    
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    else feedback.push('Include special characters');
    
    return { strength, feedback };
}

function updatePasswordStrength() {
    const password = document.getElementById('signupPassword').value;
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (password.length === 0) {
        strengthFill.className = 'strength-fill';
        strengthText.textContent = 'Password strength';
        return;
    }
    
    const { strength, feedback } = checkPasswordStrength(password);
    
    strengthFill.className = 'strength-fill';
    if (strength <= 1) {
        strengthFill.classList.add('weak');
        strengthText.textContent = 'Weak';
    } else if (strength <= 2) {
        strengthFill.classList.add('fair');
        strengthText.textContent = 'Fair';
    } else if (strength <= 3) {
        strengthFill.classList.add('good');
        strengthText.textContent = 'Good';
    } else {
        strengthFill.classList.add('strong');
        strengthText.textContent = 'Strong';
    }
}

// Form validation
function validateSignupForm() {
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return false;
    }
    
    if (!agreeTerms) {
        showNotification('Please agree to the Terms of Service', 'error');
        return false;
    }
    
    const { strength } = checkPasswordStrength(password);
    if (strength < 3) {
        showNotification('Please choose a stronger password', 'error');
        return false;
    }
    
    return true;
}

// Login form handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Simulate login process
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        // Simulate successful login
        showNotification('Successfully logged in!', 'success');
        closeAuthModal('loginModal');
        
        // Update UI to show logged-in state
        updateAuthUI(true);
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
});

// Signup form handler
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateSignupForm()) {
        return;
    }
    
    const firstName = document.getElementById('signupFirstName').value;
    const lastName = document.getElementById('signupLastName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const newsletterSignup = document.getElementById('newsletterSignup').checked;
    
    // Simulate signup process
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Creating account...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        // Simulate successful signup
        showNotification('Account created successfully!', 'success');
        closeAuthModal('signupModal');
        
        // Update UI to show logged-in state
        updateAuthUI(true);
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
});

// Update authentication UI
function updateAuthUI(isLoggedIn) {
    const authButtons = document.querySelector('.auth-buttons');
    
    if (isLoggedIn) {
        authButtons.innerHTML = `
            <div class="user-menu">
                <button class="btn btn-outline btn-sm" onclick="showUserMenu()">
                    <i class="fas fa-user"></i>
                    <span>John Doe</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="user-dropdown" id="userDropdown">
                    <a href="#"><i class="fas fa-user-circle"></i> Profile</a>
                    <a href="#"><i class="fas fa-bookmark"></i> Saved Jobs</a>
                    <a href="#"><i class="fas fa-cog"></i> Settings</a>
                    <div class="dropdown-divider"></div>
                    <a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Logout</a>
                </div>
            </div>
        `;
    } else {
        authButtons.innerHTML = `
            <button class="btn btn-outline btn-sm" onclick="showLoginModal()">Login</button>
            <button class="btn btn-primary btn-sm" onclick="showSignupModal()">Sign Up</button>
        `;
    }
}

function showUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('active');
}

function logout() {
    updateAuthUI(false);
    showNotification('Successfully logged out', 'success');
}

// Social authentication handlers
document.querySelectorAll('.btn-social').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const provider = this.classList.contains('btn-google') ? 'Google' : 'LinkedIn';
        showNotification(`Connecting with ${provider}...`, 'info');
        
        // Simulate social login
        setTimeout(() => {
            showNotification(`Successfully connected with ${provider}!`, 'success');
            closeAuthModal('loginModal');
            closeAuthModal('signupModal');
            updateAuthUI(true);
        }, 2000);
    });
});

// Password strength monitoring
document.getElementById('signupPassword').addEventListener('input', updatePasswordStrength);

// Close auth modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('auth-modal')) {
        closeAuthModal(e.target.id);
    }
});

// Close auth modals with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.auth-modal.active').forEach(modal => {
            closeAuthModal(modal.id);
        });
    }
});

// Add user menu styles
const userMenuStyles = `
    <style>
        .user-menu {
            position: relative;
        }
        
        .user-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            min-width: 200px;
            display: none;
            z-index: 1000;
        }
        
        .user-dropdown.active {
            display: block;
        }
        
        .user-dropdown a {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1rem;
            color: #374151;
            text-decoration: none;
            transition: background-color 0.3s ease;
        }
        
        .user-dropdown a:hover {
            background: #f3f4f6;
        }
        
        .dropdown-divider {
            height: 1px;
            background: #e5e7eb;
            margin: 0.5rem 0;
        }
        
        @media (max-width: 768px) {
            .user-dropdown {
                right: -50px;
            }
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', userMenuStyles);

// My Skills Management
let mySkills = JSON.parse(localStorage.getItem('mySkills')) || [];

// Initialize My Skills section
function initializeMySkills() {
    renderMySkills();
    setupSkillFilters();
}

// Toggle certification fields visibility
function toggleCertificationFields() {
    const itemType = document.getElementById('itemType').value;
    const certificationFields = document.getElementById('certificationFields');
    
    if (itemType === 'certification') {
        certificationFields.style.display = 'block';
        certificationFields.classList.add('show');
    } else {
        certificationFields.style.display = 'none';
        certificationFields.classList.remove('show');
    }
}

// Add new skill or certification
function addSkill(event) {
    event.preventDefault();
    
    const itemType = document.getElementById('itemType').value;
    const skillName = document.getElementById('skillName').value.trim();
    const skillCategory = document.getElementById('skillCategory').value;
    const skillDescription = document.getElementById('skillDescription').value.trim();
    const skillLevel = document.getElementById('skillLevel').value;
    const skillIcon = document.getElementById('skillIcon').value;
    const skillUrl = document.getElementById('skillUrl').value.trim();
    
    if (!skillName || !skillCategory || !skillLevel) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    const newItem = {
        id: Date.now(),
        type: itemType,
        name: skillName,
        category: skillCategory,
        description: skillDescription,
        level: parseInt(skillLevel),
        icon: skillIcon,
        url: skillUrl,
        dateAdded: new Date().toISOString()
    };
    
    // Add certification-specific fields if it's a certification
    if (itemType === 'certification') {
        const certIssuer = document.getElementById('certIssuer').value.trim();
        const certLevel = document.getElementById('certLevel').value;
        const certDate = document.getElementById('certDate').value;
        const certExpiry = document.getElementById('certExpiry').value;
        const certId = document.getElementById('certId').value.trim();
        
        if (!certIssuer || !certLevel || !certDate) {
            showNotification('Please fill in all certification fields', 'error');
            return;
        }
        
        newItem.certification = {
            issuer: certIssuer,
            level: certLevel,
            dateObtained: certDate,
            expiryDate: certExpiry,
            id: certId
        };
    }
    
    mySkills.push(newItem);
    saveSkills();
    renderMySkills();
    
    // Reset form
    event.target.reset();
    document.getElementById('certificationFields').style.display = 'none';
    showNotification(`${itemType === 'certification' ? 'Certification' : 'Skill'} added successfully!`, 'success');
}

// Render skills grid
function renderMySkills(filterCategory = 'all', filterType = null) {
    const skillsGrid = document.getElementById('mySkillsGrid');
    
    if (mySkills.length === 0) {
        skillsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-plus-circle"></i>
                <h4>No Skills or Certifications Added Yet</h4>
                <p>Start building your professional profile by adding your first skill or certification above.</p>
            </div>
        `;
        return;
    }
    
    let filteredItems = mySkills;
    
    // Filter by type if specified
    if (filterType) {
        filteredItems = filteredItems.filter(item => item.type === filterType);
    }
    // Filter by category if specified
    else if (filterCategory !== 'all') {
        filteredItems = filteredItems.filter(item => item.category === filterCategory);
    }
    
    if (filteredItems.length === 0) {
        skillsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-filter"></i>
                <h4>No Items in This Category</h4>
                <p>Try selecting a different category or add new skills/certifications.</p>
            </div>
        `;
        return;
    }
    
    skillsGrid.innerHTML = filteredItems.map(item => {
        const isCertification = item.type === 'certification';
        const expiryWarning = isCertification && item.certification.expiryDate ? 
            (new Date(item.certification.expiryDate) < new Date() ? 
                '<div class="expiry-warning"><i class="fas fa-exclamation-triangle"></i> Expired</div>' : 
                (new Date(item.certification.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 
                    '<div class="expiry-warning"><i class="fas fa-clock"></i> Expires Soon</div>' : '')
            ) : '';
        
        return `
            <div class="my-skill-card" data-category="${item.category}" data-type="${item.type}">
                ${isCertification ? '<div class="certification-badge">Certification</div>' : ''}
                <div class="my-skill-header">
                    <div class="my-skill-info">
                        <div class="my-skill-icon">
                            <i class="${item.icon}"></i>
                        </div>
                        <div class="my-skill-details">
                            <h4>${item.name}</h4>
                            <span class="my-skill-category">${item.category.replace('-', ' ')}</span>
                        </div>
                    </div>
                    <div class="my-skill-actions">
                        <button class="edit-btn" onclick="editSkill(${item.id})" title="Edit ${isCertification ? 'Certification' : 'Skill'}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn" onclick="deleteSkill(${item.id})" title="Delete ${isCertification ? 'Certification' : 'Skill'}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                ${item.description ? `<p class="my-skill-description">${item.description}</p>` : ''}
                
                ${isCertification && item.certification ? `
                    <div class="certification-details">
                        <h5><i class="fas fa-certificate"></i> Certification Details</h5>
                        <div class="certification-info">
                            <div>
                                <label>Issuer:</label>
                                <span>${item.certification.issuer}</span>
                            </div>
                            <div>
                                <label>Level:</label>
                                <span>${item.certification.level}</span>
                            </div>
                            <div>
                                <label>Date Obtained:</label>
                                <span>${new Date(item.certification.dateObtained).toLocaleDateString()}</span>
                            </div>
                            ${item.certification.expiryDate ? `
                                <div>
                                    <label>Expiry Date:</label>
                                    <span>${new Date(item.certification.expiryDate).toLocaleDateString()}</span>
                                </div>
                            ` : ''}
                        </div>
                        ${item.certification.id ? `<div class="certification-id">ID: ${item.certification.id}</div>` : ''}
                        ${expiryWarning}
                    </div>
                ` : ''}
                
                <div class="my-skill-level">
                    <span class="level-label">Proficiency Level</span>
                    <div class="level-bars">
                        ${Array.from({length: 5}, (_, i) => 
                            `<div class="bar ${i < item.level ? 'active' : ''}"></div>`
                        ).join('')}
                    </div>
                </div>
                
                ${item.url ? `
                    <div class="skill-url">
                        <a href="${item.url}" target="_blank" rel="noopener noreferrer">
                            <i class="fas fa-external-link-alt"></i>
                            ${isCertification ? 'View Certificate' : 'View Details'}
                        </a>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

// Setup skill filters
function setupSkillFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            const type = btn.dataset.type;
            
            if (type) {
                renderMySkills('all', type);
            } else {
                renderMySkills(category);
            }
        });
    });
}

// Edit skill or certification
function editSkill(skillId) {
    const item = mySkills.find(s => s.id === skillId);
    if (!item) return;
    
    // Populate form with item data
    document.getElementById('itemType').value = item.type;
    document.getElementById('skillName').value = item.name;
    document.getElementById('skillCategory').value = item.category;
    document.getElementById('skillDescription').value = item.description;
    document.getElementById('skillLevel').value = item.level;
    document.getElementById('skillIcon').value = item.icon;
    document.getElementById('skillUrl').value = item.url || '';
    
    // Toggle certification fields if needed
    toggleCertificationFields();
    
    // Populate certification fields if it's a certification
    if (item.type === 'certification' && item.certification) {
        document.getElementById('certIssuer').value = item.certification.issuer || '';
        document.getElementById('certLevel').value = item.certification.level || '';
        document.getElementById('certDate').value = item.certification.dateObtained || '';
        document.getElementById('certExpiry').value = item.certification.expiryDate || '';
        document.getElementById('certId').value = item.certification.id || '';
    }
    
    // Update form to edit mode
    const form = document.getElementById('addSkillForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    submitBtn.innerHTML = `<i class="fas fa-save"></i> Update ${item.type === 'certification' ? 'Certification' : 'Skill'}`;
    submitBtn.onclick = (e) => updateSkill(e, skillId);
    
    // Scroll to form
    document.querySelector('.skills-management').scrollIntoView({ behavior: 'smooth' });
}

// Update skill or certification
function updateSkill(event, skillId) {
    event.preventDefault();
    
    const skillIndex = mySkills.findIndex(s => s.id === skillId);
    if (skillIndex === -1) return;
    
    const itemType = document.getElementById('itemType').value;
    const skillName = document.getElementById('skillName').value.trim();
    const skillCategory = document.getElementById('skillCategory').value;
    const skillDescription = document.getElementById('skillDescription').value.trim();
    const skillLevel = document.getElementById('skillLevel').value;
    const skillIcon = document.getElementById('skillIcon').value;
    const skillUrl = document.getElementById('skillUrl').value.trim();
    
    if (!skillName || !skillCategory || !skillLevel) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    const updatedItem = {
        ...mySkills[skillIndex],
        type: itemType,
        name: skillName,
        category: skillCategory,
        description: skillDescription,
        level: parseInt(skillLevel),
        icon: skillIcon,
        url: skillUrl,
        dateUpdated: new Date().toISOString()
    };
    
    // Update certification-specific fields if it's a certification
    if (itemType === 'certification') {
        const certIssuer = document.getElementById('certIssuer').value.trim();
        const certLevel = document.getElementById('certLevel').value;
        const certDate = document.getElementById('certDate').value;
        const certExpiry = document.getElementById('certExpiry').value;
        const certId = document.getElementById('certId').value.trim();
        
        if (!certIssuer || !certLevel || !certDate) {
            showNotification('Please fill in all certification fields', 'error');
            return;
        }
        
        updatedItem.certification = {
            issuer: certIssuer,
            level: certLevel,
            dateObtained: certDate,
            expiryDate: certExpiry,
            id: certId
        };
    } else {
        // Remove certification data if switching from certification to skill
        delete updatedItem.certification;
    }
    
    mySkills[skillIndex] = updatedItem;
    saveSkills();
    renderMySkills();
    
    // Reset form to add mode
    resetSkillForm();
    showNotification(`${itemType === 'certification' ? 'Certification' : 'Skill'} updated successfully!`, 'success');
}

// Delete skill
function deleteSkill(skillId) {
    if (confirm('Are you sure you want to delete this skill?')) {
        mySkills = mySkills.filter(s => s.id !== skillId);
        saveSkills();
        renderMySkills();
        showNotification('Skill deleted successfully!', 'success');
    }
}

// Clear all skills
function clearAllSkills() {
    if (confirm('Are you sure you want to delete all skills? This action cannot be undone.')) {
        mySkills = [];
        saveSkills();
        renderMySkills();
        showNotification('All skills cleared!', 'success');
    }
}

// Export skills and certifications
function exportSkills() {
    if (mySkills.length === 0) {
        showNotification('No skills or certifications to export', 'error');
        return;
    }
    
    const skillsCount = mySkills.filter(item => item.type === 'skill').length;
    const certificationsCount = mySkills.filter(item => item.type === 'certification').length;
    
    const skillsData = {
        exportDate: new Date().toISOString(),
        totalItems: mySkills.length,
        skillsCount: skillsCount,
        certificationsCount: certificationsCount,
        items: mySkills
    };
    
    const dataStr = JSON.stringify(skillsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `my-skills-certifications-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification(`Exported ${skillsCount} skills and ${certificationsCount} certifications successfully!`, 'success');
}

// Save skills to localStorage
function saveSkills() {
    localStorage.setItem('mySkills', JSON.stringify(mySkills));
}

// Reset skill form to add mode
function resetSkillForm() {
    const form = document.getElementById('addSkillForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    form.reset();
    document.getElementById('certificationFields').style.display = 'none';
    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Item';
    submitBtn.onclick = addSkill;
}

// Add loaded class styles
const loadedStyles = `
    <style>
        body:not(.loaded) {
            overflow: hidden;
        }
        
        body:not(.loaded)::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        body:not(.loaded)::after {
            content: 'Loading...';
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 1.5rem;
            font-weight: 600;
            z-index: 10000;
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', loadedStyles); 