// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});
// Wait until DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Check authentication status first
    checkAuthStatus();
    
    // Reference buttons by id
    const browseJobsBtn = document.getElementById('browse-jobs-btn');
    const learnMoreBtn = document.getElementById('learn-more-btn');
    // Add click event to Browse Jobs button
    browseJobsBtn.addEventListener('click', function () {
        // Redirect to the "jobs" page or section
        window.location.href = '#jobs';  // put the path to your jobs page
    });
    // Add click event to Learn More button
    learnMoreBtn.addEventListener('click', function () {
        // Redirect to the "about" page or specific section
        // Or open a modal or expand content, adjust as necessary
        window.location.href = '#contact'; // put the path to your learn more page
    });
});

// Check authentication status and update UI
function checkAuthStatus() {
    // Prefer persistent login (localStorage), fall back to sessionStorage
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    
    if (token && userData) {
        try {
            const user = JSON.parse(userData);
            updateAuthUI(true, user);
        } catch (error) {
            console.error('Error parsing user data:', error);
            updateAuthUI(false);
        }
    } else {
        updateAuthUI(false);
    }
}

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

// Contact Form Handling with Web3Forms
function handleContactFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Get form data
    const formData = new FormData(form);
    
    // Submit to Web3Forms
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showContactSuccess();
            form.reset();
        } else {
            showContactError('Failed to send message. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showContactError('Network error. Please check your connection and try again.');
    })
    .finally(() => {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function showContactSuccess() {
    const notification = document.createElement('div');
    notification.className = 'contact-success-notification';
    notification.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <div class="success-text">
                <h4>Message Sent Successfully!</h4>
                <p>Thank you for contacting us. We'll get back to you soon!</p>
            </div>
        </div>
        <button class="close-notification" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 8000);
}

function showContactError(message) {
    const notification = document.createElement('div');
    notification.className = 'contact-error-notification';
    notification.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-circle"></i>
            <div class="error-text">
                <h4>Message Not Sent</h4>
                <p>${message}</p>
            </div>
        </div>
        <button class="close-notification" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 8000);
}

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
function updateAuthUI(isLoggedIn, user = null) {
    const authButtons = document.querySelector('.auth-buttons');
    
    if (isLoggedIn && user) {
        // Prefer full name; otherwise derive a unique username from email
        const usernameFromEmail = user && user.email ? String(user.email).split('@')[0] : 'User';
        const displayName = (user.firstName && user.lastName)
            ? `${user.firstName} ${user.lastName}`
            : (user.firstName || usernameFromEmail);
        
        authButtons.innerHTML = `
            <div class="user-menu">
                <button class="btn btn-outline btn-sm" onclick="showUserMenu()">
                    <i class="fas fa-user"></i>
                    <span>${displayName}</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="user-dropdown" id="userDropdown">
                    <div class="user-info">
                        <div class="user-name">${displayName}</div>
                        <div class="user-email">${user.email}</div>
                    </div>
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
    // Clear both storages
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Update UI
    updateAuthUI(false);
    
    // Show notification
    showNotification('Successfully logged out', 'success');
    
    // Redirect to home page after a short delay
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 1500);
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

// Close user dropdown when clicking outside
document.addEventListener('click', function(e) {
    const userMenu = document.querySelector('.user-menu');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userMenu && userDropdown && !userMenu.contains(e.target)) {
        userDropdown.classList.remove('active');
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

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Job Management Functions
async function fetchJobsFromAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/jobs`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.jobs || [];
    } catch (error) {
        console.error('Error fetching jobs:', error);
        // Fallback to static data if API fails
        return getStaticJobs();
    }
}

function getStaticJobs() {
    return [
        {
            id: 1,
            title: "Frontend Developer",
            company: "TCS",
            location: "Bangalore, Karnataka",
            type: "Full-time",
            salary: "₹6.5L - ₹12L",
            description: "Join our frontend team to build responsive and modern web applications using React, Angular, and Vue.js.",
            requirements: ["React", "JavaScript", "CSS3", "HTML5", "TypeScript"],
            platform: "LinkedIn",
            isUrgent: true
        },
        {
            id: 2,
            title: "Backend Engineer",
            company: "Infosys",
            location: "Hyderabad, Telangana",
            type: "Full-time",
            salary: "₹7L - ₹15L",
            description: "Develop scalable backend services and APIs using Node.js, Java, and microservices architecture.",
            requirements: ["Node.js", "Java", "Spring Boot", "MongoDB", "REST APIs"],
            platform: "Indeed",
            isUrgent: false
        },
        {
            id: 3,
            title: "Full Stack Developer",
            company: "Wipro",
            location: "Pune, Maharashtra",
            type: "Full-time",
            salary: "₹8L - ₹18L",
            description: "Build end-to-end web applications using modern technologies and cloud platforms.",
            requirements: ["React", "Node.js", "PostgreSQL", "AWS", "Docker"],
            platform: "Glassdoor",
            isUrgent: true
        },
        {
            id: 4,
            title: "DevOps Engineer",
            company: "HCL Technologies",
            location: "Noida, Uttar Pradesh",
            type: "Full-time",
            salary: "₹9L - ₹20L",
            description: "Manage cloud infrastructure, CI/CD pipelines, and deployment automation.",
            requirements: ["Docker", "Kubernetes", "AWS", "Jenkins", "Terraform"],
            platform: "LinkedIn",
            isUrgent: false
        },
        {
            id: 5,
            title: "UI/UX Designer",
            company: "Tech Mahindra",
            location: "Mumbai, Maharashtra",
            type: "Full-time",
            salary: "₹5L - ₹12L",
            description: "Create beautiful and intuitive user interfaces for web and mobile applications.",
            requirements: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping", "Design Systems"],
            platform: "Behance",
            isUrgent: false
        },
        {
            id: 6,
            title: "Data Scientist",
            company: "Cognizant",
            location: "Chennai, Tamil Nadu",
            type: "Full-time",
            salary: "₹10L - ₹25L",
            description: "Build machine learning models and analyze complex datasets for business insights.",
            requirements: ["Python", "TensorFlow", "SQL", "Statistics", "Machine Learning"],
            platform: "LinkedIn",
            isUrgent: true
        },
        {
            id: 7,
            title: "Mobile App Developer",
            company: "L&T Infotech",
            location: "Gurgaon, Haryana",
            type: "Full-time",
            salary: "₹6L - ₹15L",
            description: "Develop native and cross-platform mobile applications for iOS and Android.",
            requirements: ["React Native", "Flutter", "Swift", "Kotlin", "Mobile UI/UX"],
            platform: "Indeed",
            isUrgent: false
        },
        {
            id: 8,
            title: "Cloud Architect",
            company: "Mindtree",
            location: "Bangalore, Karnataka",
            type: "Full-time",
            salary: "₹15L - ₹35L",
            description: "Design and implement cloud solutions using AWS, Azure, and Google Cloud Platform.",
            requirements: ["AWS", "Azure", "GCP", "Terraform", "Cloud Security"],
            platform: "LinkedIn",
            isUrgent: true
        },
        {
            id: 9,
            title: "QA Engineer",
            company: "Mphasis",
            location: "Pune, Maharashtra",
            type: "Full-time",
            salary: "₹4L - ₹10L",
            description: "Ensure software quality through manual and automated testing methodologies.",
            requirements: ["Selenium", "JUnit", "TestNG", "API Testing", "Performance Testing"],
            platform: "Glassdoor",
            isUrgent: false
        },
        {
            id: 10,
            title: "Product Manager",
            company: "Zensar Technologies",
            location: "Hyderabad, Telangana",
            type: "Full-time",
            salary: "₹12L - ₹30L",
            description: "Lead product development from concept to launch, working with cross-functional teams.",
            requirements: ["Product Strategy", "Agile", "User Research", "Data Analysis", "Stakeholder Management"],
            platform: "LinkedIn",
            isUrgent: false
        },
        {
            id: 11,
            title: "React Developer",
            company: "Persistent Systems",
            location: "Pune, Maharashtra",
            type: "Full-time",
            salary: "₹6L - ₹14L",
            description: "Build modern React applications with Redux, TypeScript, and modern JavaScript.",
            requirements: ["React", "Redux", "TypeScript", "JavaScript ES6+", "CSS-in-JS"],
            platform: "Indeed",
            isUrgent: true
        },
        {
            id: 12,
            title: "Python Developer",
            company: "Cybage",
            location: "Pune, Maharashtra",
            type: "Full-time",
            salary: "₹5L - ₹12L",
            description: "Develop Python applications, APIs, and data processing scripts.",
            requirements: ["Python", "Django", "Flask", "FastAPI", "Pandas"],
            platform: "LinkedIn",
            isUrgent: false
        },
        {
            id: 13,
            title: "Java Developer",
            company: "Larsen & Toubro",
            location: "Mumbai, Maharashtra",
            type: "Full-time",
            salary: "₹6L - ₹16L",
            description: "Build enterprise Java applications using Spring Framework and microservices.",
            requirements: ["Java", "Spring Boot", "Hibernate", "JUnit", "Maven"],
            platform: "Glassdoor",
            isUrgent: true
        },
        {
            id: 14,
            title: "Angular Developer",
            company: "KPIT Technologies",
            location: "Bangalore, Karnataka",
            type: "Full-time",
            salary: "₹5L - ₹13L",
            description: "Develop Angular applications with modern practices and responsive design.",
            requirements: ["Angular", "TypeScript", "RxJS", "Angular Material", "Unit Testing"],
            platform: "Indeed",
            isUrgent: false
        },
        {
            id: 15,
            title: "Node.js Developer",
            company: "Birlasoft",
            location: "Noida, Uttar Pradesh",
            type: "Full-time",
            salary: "₹6L - ₹15L",
            description: "Build scalable backend services using Node.js and Express framework.",
            requirements: ["Node.js", "Express", "MongoDB", "REST APIs", "JWT"],
            platform: "LinkedIn",
            isUrgent: true
        },
        {
            id: 16,
            title: "Data Engineer",
            company: "Hexaware Technologies",
            location: "Chennai, Tamil Nadu",
            type: "Full-time",
            salary: "₹8L - ₹20L",
            description: "Build data pipelines and ETL processes for big data processing.",
            requirements: ["Python", "Apache Spark", "Hadoop", "SQL", "Data Modeling"],
            platform: "Glassdoor",
            isUrgent: false
        },
        {
            id: 17,
            title: "Machine Learning Engineer",
            company: "Mastek",
            location: "Mumbai, Maharashtra",
            type: "Full-time",
            salary: "₹10L - ₹25L",
            description: "Develop and deploy machine learning models for production use.",
            requirements: ["Python", "TensorFlow", "PyTorch", "MLOps", "Model Deployment"],
            platform: "LinkedIn",
            isUrgent: true
        },
        {
            id: 18,
            title: "Frontend Lead",
            company: "Virtusa",
            location: "Hyderabad, Telangana",
            type: "Full-time",
            salary: "₹12L - ₹28L",
            description: "Lead frontend development team and mentor junior developers.",
            requirements: ["React", "Team Leadership", "Code Review", "Architecture", "Performance"],
            platform: "Indeed",
            isUrgent: false
        },
        {
            id: 19,
            title: "Backend Lead",
            company: "QuEST Global",
            location: "Bangalore, Karnataka",
            type: "Full-time",
            salary: "₹14L - ₹32L",
            description: "Lead backend development and architecture decisions for scalable systems.",
            requirements: ["System Design", "Team Leadership", "Microservices", "Database Design", "API Design"],
            platform: "LinkedIn",
            isUrgent: true
        },
        {
            id: 20,
            title: "UI Developer",
            company: "KPIT Technologies",
            location: "Pune, Maharashtra",
            type: "Full-time",
            salary: "₹4L - ₹10L",
            description: "Create pixel-perfect user interfaces using HTML, CSS, and JavaScript.",
            requirements: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "Cross-browser"],
            platform: "Glassdoor",
            isUrgent: false
        },
        {
            id: 21,
            title: "Full Stack Lead",
            company: "L&T Technology Services",
            location: "Bangalore, Karnataka",
            type: "Full-time",
            salary: "₹16L - ₹35L",
            description: "Lead full-stack development team and drive technical decisions.",
            requirements: ["Full Stack", "Team Leadership", "Architecture", "Code Review", "Best Practices"],
            platform: "LinkedIn",
            isUrgent: true
        },
        {
            id: 22,
            title: "DevOps Lead",
            company: "Tech Mahindra",
            location: "Mumbai, Maharashtra",
            type: "Full-time",
            salary: "₹18L - ₹40L",
            description: "Lead DevOps practices and cloud infrastructure management.",
            requirements: ["DevOps", "Team Leadership", "Cloud Architecture", "Security", "Automation"],
            platform: "Indeed",
            isUrgent: false
        },
        {
            id: 23,
            title: "React Native Developer",
            company: "Persistent Systems",
            location: "Pune, Maharashtra",
            type: "Full-time",
            salary: "₹7L - ₹16L",
            description: "Build cross-platform mobile applications using React Native.",
            requirements: ["React Native", "JavaScript", "Mobile Development", "Redux", "Native Modules"],
            platform: "LinkedIn",
            isUrgent: true
        },
        {
            id: 24,
            title: "Flutter Developer",
            company: "Cybage",
            location: "Pune, Maharashtra",
            type: "Full-time",
            salary: "₹6L - ₹15L",
            description: "Develop beautiful mobile applications using Flutter framework.",
            requirements: ["Flutter", "Dart", "Mobile UI/UX", "State Management", "API Integration"],
            platform: "Glassdoor",
            isUrgent: false
        },
        {
            id: 25,
            title: "Vue.js Developer",
            company: "Larsen & Toubro",
            location: "Mumbai, Maharashtra",
            type: "Full-time",
            salary: "₹5L - ₹12L",
            description: "Build modern web applications using Vue.js framework.",
            requirements: ["Vue.js", "JavaScript", "Vuex", "Vue Router", "Component Design"],
            platform: "Indeed",
            isUrgent: true
        },
        {
            id: 26,
            title: "PHP Developer",
            company: "KPIT Technologies",
            location: "Bangalore, Karnataka",
            type: "Full-time",
            salary: "₹4L - ₹10L",
            description: "Develop web applications using PHP and Laravel framework.",
            requirements: ["PHP", "Laravel", "MySQL", "REST APIs", "MVC Pattern"],
            platform: "LinkedIn",
            isUrgent: false
        },
        {
            id: 27,
            title: "WordPress Developer",
            company: "Birlasoft",
            location: "Noida, Uttar Pradesh",
            type: "Full-time",
            salary: "₹3L - ₹8L",
            description: "Build and customize WordPress websites and themes.",
            requirements: ["WordPress", "PHP", "CSS", "JavaScript", "Theme Development"],
            platform: "Glassdoor",
            isUrgent: false
        },
        {
            id: 28,
            title: "Shopify Developer",
            company: "Hexaware Technologies",
            location: "Chennai, Tamil Nadu",
            type: "Full-time",
            salary: "₹5L - ₹12L",
            description: "Develop and customize Shopify e-commerce stores.",
            requirements: ["Shopify", "Liquid", "JavaScript", "CSS", "E-commerce"],
            platform: "Indeed",
            isUrgent: true
        },
        {
            id: 29,
            title: "Magento Developer",
            company: "Mastek",
            location: "Mumbai, Maharashtra",
            type: "Full-time",
            salary: "₹6L - ₹14L",
            description: "Build and customize Magento e-commerce platforms.",
            requirements: ["Magento", "PHP", "MySQL", "E-commerce", "Custom Modules"],
            platform: "LinkedIn",
            isUrgent: false
        },
        {
            id: 30,
            title: "Drupal Developer",
            company: "Virtusa",
            location: "Hyderabad, Telangana",
            type: "Full-time",
            salary: "₹5L - ₹12L",
            description: "Develop and customize Drupal content management systems.",
            requirements: ["Drupal", "PHP", "MySQL", "Content Management", "Custom Modules"],
            platform: "Glassdoor",
            isUrgent: false
        },
        {
            id: 31,
            title: "Joomla Developer",
            company: "QuEST Global",
            location: "Bangalore, Karnataka",
            type: "Full-time",
            salary: "₹4L - ₹10L",
            description: "Build and customize Joomla websites and extensions.",
            requirements: ["Joomla", "PHP", "MySQL", "Extension Development", "Template Design"],
            platform: "Indeed",
            isUrgent: false
        },
        {
            id: 32,
            title: "Laravel Developer",
            company: "KPIT Technologies",
            location: "Pune, Maharashtra",
            type: "Full-time",
            salary: "₹5L - ₹12L",
            description: "Develop web applications using Laravel PHP framework.",
            requirements: ["Laravel", "PHP", "MySQL", "REST APIs", "Eloquent ORM"],
            platform: "LinkedIn",
            isUrgent: true
        },
        {
            id: 33,
            title: "CodeIgniter Developer",
            company: "Cybage",
            location: "Pune, Maharashtra",
            type: "Full-time",
            salary: "₹4L - ₹10L",
            description: "Build web applications using CodeIgniter PHP framework.",
            requirements: ["CodeIgniter", "PHP", "MySQL", "MVC Pattern", "REST APIs"],
            platform: "Glassdoor",
            isUrgent: false
        },
        {
            id: 34,
            title: "Symfony Developer",
            company: "L&T Technology Services",
            location: "Bangalore, Karnataka",
            type: "Full-time",
            salary: "₹6L - ₹14L",
            description: "Develop enterprise applications using Symfony PHP framework.",
            requirements: ["Symfony", "PHP", "Doctrine ORM", "Twig", "Composer"],
            platform: "Indeed",
            isUrgent: false
        },
        {
            id: 35,
            title: "Yii Developer",
            company: "Tech Mahindra",
            location: "Mumbai, Maharashtra",
            type: "Full-time",
            salary: "₹4L - ₹10L",
            description: "Build web applications using Yii PHP framework.",
            requirements: ["Yii", "PHP", "MySQL", "ActiveRecord", "REST APIs"],
            platform: "LinkedIn",
            isUrgent: false
        },
        {
            id: 36,
            title: "ASP.NET Developer",
            company: "Persistent Systems",
            location: "Pune, Maharashtra",
            type: "Full-time",
            salary: "₹6L - ₹15L",
            description: "Develop web applications using ASP.NET Core and C#.",
            requirements: ["ASP.NET Core", "C#", "SQL Server", "Entity Framework", "REST APIs"],
            platform: "Glassdoor",
            isUrgent: true
        },
        {
            id: 37,
            title: "C# Developer",
            company: "Birlasoft",
            location: "Noida, Uttar Pradesh",
            type: "Full-time",
            salary: "₹5L - ₹12L",
            description: "Develop applications using C# and .NET framework.",
            requirements: ["C#", ".NET", "SQL Server", "WPF", "Console Applications"],
            platform: "Indeed",
            isUrgent: false
        },
        {
            id: 38,
            title: "VB.NET Developer",
            company: "Hexaware Technologies",
            location: "Chennai, Tamil Nadu",
            type: "Full-time",
            salary: "₹4L - ₹10L",
            description: "Develop applications using VB.NET and .NET framework.",
            requirements: ["VB.NET", ".NET", "SQL Server", "Windows Forms", "Web Services"],
            platform: "LinkedIn",
            isUrgent: false
        },
        {
            id: 39,
            title: "Ruby Developer",
            company: "Mastek",
            location: "Mumbai, Maharashtra",
            type: "Full-time",
            salary: "₹6L - ₹14L",
            description: "Develop web applications using Ruby on Rails framework.",
            requirements: ["Ruby", "Ruby on Rails", "PostgreSQL", "REST APIs", "RSpec"],
            platform: "Glassdoor",
            isUrgent: false
        },
        {
            id: 40,
            title: "Python Django Developer",
            company: "Virtusa",
            location: "Hyderabad, Telangana",
            type: "Full-time",
            salary: "₹5L - ₹12L",
            description: "Build web applications using Django Python framework.",
            requirements: ["Django", "Python", "PostgreSQL", "REST APIs", "Django ORM"],
            platform: "Indeed",
            isUrgent: true
        },
        {
            id: 41,
            title: "Python Flask Developer",
            company: "QuEST Global",
            location: "Bangalore, Karnataka",
            type: "Full-time",
            salary: "₹4L - ₹10L",
            description: "Develop web applications using Flask Python framework.",
            requirements: ["Flask", "Python", "SQLite", "REST APIs", "Jinja2"],
            platform: "LinkedIn",
            isUrgent: false
        },
        {
            id: 42,
            title: "Python FastAPI Developer",
            company: "KPIT Technologies",
            location: "Pune, Maharashtra",
            type: "Full-time",
            salary: "₹6L - ₹14L",
            description: "Build high-performance APIs using FastAPI Python framework.",
            requirements: ["FastAPI", "Python", "Pydantic", "Async/Await", "OpenAPI"],
            platform: "Glassdoor",
            isUrgent: true
        },
        {
            id: 43,
            title: "Go Developer",
            company: "Cybage",
            location: "Pune, Maharashtra",
            type: "Full-time",
            salary: "₹7L - ₹16L",
            description: "Develop high-performance applications using Go programming language.",
            requirements: ["Go", "Gin", "GORM", "REST APIs", "Microservices"],
            platform: "Indeed",
            isUrgent: false
        },
        {
            id: 44,
            title: "Rust Developer",
            company: "L&T Technology Services",
            location: "Bangalore, Karnataka",
            type: "Full-time",
            salary: "₹8L - ₹18L",
            description: "Build system-level applications using Rust programming language.",
            requirements: ["Rust", "Systems Programming", "Memory Safety", "Performance", "Cargo"],
            platform: "LinkedIn",
            isUrgent: true
        },
        {
            id: 45,
            title: "Scala Developer",
            company: "Tech Mahindra",
            location: "Mumbai, Maharashtra",
            type: "Full-time",
            salary: "₹8L - ₹18L",
            description: "Develop applications using Scala and functional programming.",
            requirements: ["Scala", "Functional Programming", "Spark", "Akka", "SBT"],
            platform: "Glassdoor",
            isUrgent: false
        },
        {
            id: 46,
            title: "Kotlin Developer",
            company: "Persistent Systems",
            location: "Pune, Maharashtra",
            type: "Full-time",
            salary: "₹6L - ₹15L",
            description: "Develop Android applications using Kotlin programming language.",
            requirements: ["Kotlin", "Android", "Android Studio", "Jetpack", "Coroutines"],
            platform: "Indeed",
            isUrgent: true
        },
        {
            id: 47,
            title: "Swift Developer",
            company: "Birlasoft",
            location: "Noida, Uttar Pradesh",
            type: "Full-time",
            salary: "₹7L - ₹16L",
            description: "Develop iOS applications using Swift programming language.",
            requirements: ["Swift", "iOS", "Xcode", "UIKit", "SwiftUI"],
            platform: "LinkedIn",
            isUrgent: false
        },
        {
            id: 48,
            title: "Objective-C Developer",
            company: "Hexaware Technologies",
            location: "Chennai, Tamil Nadu",
            type: "Full-time",
            salary: "₹5L - ₹12L",
            description: "Develop iOS applications using Objective-C programming language.",
            requirements: ["Objective-C", "iOS", "Xcode", "UIKit", "Foundation"],
            platform: "Glassdoor",
            isUrgent: false
        },
        {
            id: 49,
            title: "React Developer (Senior)",
            company: "Mastek",
            location: "Mumbai, Maharashtra",
            type: "Full-time",
            salary: "₹12L - ₹28L",
            description: "Lead React development and mentor junior developers.",
            requirements: ["React", "Team Leadership", "Code Review", "Architecture", "Performance"],
            platform: "Indeed",
            isUrgent: true
        },
        {
            id: 50,
            title: "Full Stack Developer (Senior)",
            company: "Virtusa",
            location: "Hyderabad, Telangana",
            type: "Full-time",
            salary: "₹15L - ₹35L",
            description: "Lead full-stack development and drive technical decisions.",
            requirements: ["Full Stack", "Team Leadership", "Architecture", "Code Review", "Best Practices"],
            platform: "LinkedIn",
            isUrgent: false
        },
        {
            id: 51,
            title: "DevOps Engineer (Senior)",
            company: "QuEST Global",
            location: "Bangalore, Karnataka",
            type: "Full-time",
            salary: "₹18L - ₹40L",
            description: "Lead DevOps practices and cloud infrastructure management.",
            requirements: ["DevOps", "Team Leadership", "Cloud Architecture", "Security", "Automation"],
            platform: "Glassdoor",
            isUrgent: true
        },
        {
            id: 52,
            title: "Data Scientist (Senior)",
            company: "KPIT Technologies",
            location: "Pune, Maharashtra",
            type: "Full-time",
            salary: "₹20L - ₹45L",
            description: "Lead data science initiatives and mentor junior data scientists.",
            requirements: ["Data Science", "Team Leadership", "MLOps", "Model Deployment", "Mentoring"],
            platform: "Indeed",
            isUrgent: false
        },
        {
            id: 53,
            title: "Machine Learning Engineer (Senior)",
            company: "Cybage",
            location: "Pune, Maharashtra",
            type: "Full-time",
            salary: "₹22L - ₹50L",
            description: "Lead machine learning initiatives and drive AI strategy.",
            requirements: ["Machine Learning", "Team Leadership", "AI Strategy", "Model Deployment", "Mentoring"],
            platform: "LinkedIn",
            isUrgent: true
        },
        {
            id: 54,
            title: "Cloud Architect (Senior)",
            company: "L&T Technology Services",
            location: "Bangalore, Karnataka",
            type: "Full-time",
            salary: "₹25L - ₹55L",
            description: "Lead cloud architecture and drive cloud transformation initiatives.",
            requirements: ["Cloud Architecture", "Team Leadership", "Cloud Strategy", "Security", "Cost Optimization"],
            platform: "Glassdoor",
            isUrgent: false
        },
        {
            id: 55,
            title: "Product Manager (Senior)",
            company: "Tech Mahindra",
            location: "Mumbai, Maharashtra",
            type: "Full-time",
            salary: "₹12L - ₹30L",
            description: "Lead product strategy and drive product development initiatives.",
            requirements: ["Product Strategy", "Team Leadership", "Product Vision", "Stakeholder Management", "Mentoring"],
            platform: "Indeed",
            isUrgent: true
        },
        {
            id: 56,
            title: "Engineering Manager",
            company: "Persistent Systems",
            location: "Pune, Maharashtra",
            type: "Full-time",
            salary: "₹30L - ₹70L",
            description: "Lead engineering teams and drive technical excellence.",
            requirements: ["Team Leadership", "Technical Leadership", "Project Management", "Mentoring", "Strategy"],
            platform: "LinkedIn",
            isUrgent: false
        },
        {
            id: 57,
            title: "Technical Lead",
            company: "Birlasoft",
            location: "Noida, Uttar Pradesh",
            type: "Full-time",
            salary: "₹20L - ₹45L",
            description: "Lead technical decisions and mentor development teams.",
            requirements: ["Technical Leadership", "Architecture", "Code Review", "Mentoring", "Best Practices"],
            platform: "Glassdoor",
            isUrgent: true
        },
        {
            id: 58,
            title: "Solution Architect",
            company: "Hexaware Technologies",
            location: "Chennai, Tamil Nadu",
            type: "Full-time",
            salary: "₹25L - ₹55L",
            description: "Design enterprise solutions and drive technical architecture decisions.",
            requirements: ["Solution Architecture", "Enterprise Design", "Technology Stack", "Integration", "Scalability"],
            platform: "Indeed",
            isUrgent: false
        },
        {
            id: 59,
            title: "System Architect",
            company: "Mastek",
            location: "Mumbai, Maharashtra",
            type: "Full-time",
            salary: "₹28L - ₹60L",
            description: "Design system architecture and drive technical decisions.",
            requirements: ["System Architecture", "Technical Leadership", "Scalability", "Performance", "Security"],
            platform: "LinkedIn",
            isUrgent: true
        },
        {
            id: 60,
            title: "CTO/VP Engineering",
            company: "Startup Company",
            location: "Bangalore, Karnataka",
            type: "Full-time",
            salary: "₹50L - ₹1.5Cr",
            description: "Lead technology strategy and drive engineering excellence for a growing startup.",
            requirements: ["Technology Strategy", "Executive Leadership", "Team Building", "Innovation", "Business Acumen"],
            platform: "AngelList",
            isUrgent: true
        }
    ];
}

async function displayJobs(jobs) {
    const jobsContainer = document.querySelector('.jobs-grid');
    if (!jobsContainer) return;

    // Clear existing content
    jobsContainer.innerHTML = '';

    if (jobs.length === 0) {
        jobsContainer.innerHTML = `
            <div class="no-jobs">
                <i class="fas fa-search"></i>
                <h3>No jobs found</h3>
                <p>Try adjusting your search criteria or check back later.</p>
            </div>
        `;
        return;
    }

    // Pagination settings
    const jobsPerPage = 12;
    let currentPage = 1;
    const totalPages = Math.ceil(jobs.length / jobsPerPage);

    // Function to display jobs for current page
    function displayCurrentPage() {
        const startIndex = (currentPage - 1) * jobsPerPage;
        const endIndex = startIndex + jobsPerPage;
        const currentJobs = jobs.slice(startIndex, endIndex);

        // Clear container
        jobsContainer.innerHTML = '';

        // Display current page jobs
        currentJobs.forEach(job => {
            const jobCard = createJobCard(job);
            jobsContainer.appendChild(jobCard);
        });

        // Add pagination info and show more button
        if (currentPage < totalPages) {
            const paginationDiv = document.createElement('div');
            paginationDiv.className = 'pagination-info';
            paginationDiv.innerHTML = `
                <div class="pagination-stats">
                    <span>Showing ${startIndex + 1}-${Math.min(endIndex, jobs.length)} of ${jobs.length} jobs</span>
                </div>
                <button class="btn btn-primary show-more-btn" onclick="showMoreJobs()">
                    <i class="fas fa-plus"></i> Show More Jobs
                </button>
            `;
            jobsContainer.appendChild(paginationDiv);
        } else {
            // Show completion message
            const completionDiv = document.createElement('div');
            completionDiv.className = 'pagination-info';
            completionDiv.innerHTML = `
                <div class="pagination-stats">
                    <span>Showing all ${jobs.length} jobs</span>
                </div>
                <button class="btn btn-outline show-all-btn" onclick="showAllJobs()">
                    <i class="fas fa-list"></i> Show All Jobs
                </button>
            `;
            jobsContainer.appendChild(completionDiv);
        }
    }

    // Function to show more jobs
    window.showMoreJobs = function() {
        currentPage++;
        displayCurrentPage();
        
        // Scroll to top of jobs section
        const jobsSection = document.getElementById('jobs');
        if (jobsSection) {
            jobsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Function to show all jobs at once
    window.showAllJobs = function() {
        currentPage = 1;
        jobsPerPage = jobs.length;
        displayCurrentPage();
        
        // Scroll to top of jobs section
        const jobsSection = document.getElementById('jobs');
        if (jobsSection) {
            jobsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Display first page
    displayCurrentPage();
}

function createJobCard(job) {
    // Helper: format location into a display string
    function formatLocation(loc) {
        if (!loc) return 'Location not specified';
        if (typeof loc === 'string') return loc;
        // If loc is an object
        if (loc.city && loc.state) return `${loc.city}, ${loc.state}`;
        if (loc.city && loc.country) return `${loc.city}, ${loc.country}`;
        if (loc.city) return loc.city;
        if (loc.state) return loc.state;
        if (loc.type) return loc.type; // e.g., Remote, On-site, Hybrid
        // Fallback to join any available fields
        return [loc.city, loc.state, loc.country, loc.type].filter(Boolean).join(', ') || 'Location not specified';
    }

    // Helper: prefer job.jobType, then job.type, then a sensible default
    function formatJobType(j) {
        return j.jobType || j.type || 'Full-time';
    }

    // Helper: format salary when it's provided as a string or an object
    function formatSalary(s) {
        if (!s) return 'Not disclosed';
        if (typeof s === 'string') return s;
        // If salary is an object { min, max, currency, period }
        if (typeof s === 'object') {
            const { min, max, currency, period } = s;
            // If INR numeric values provided, convert to Lakh format for display
            if (currency === 'INR' || currency === '₹') {
                const toL = v => (v >= 100000 ? `${(v/100000).toFixed(v%100000===0?0:1)}L` : `${v}`);
                if (min && max) return `₹${toL(min)} - ₹${toL(max)}`;
                if (min) return `₹${toL(min)}`;
            }
            // Generic fallback
            if (min && max) return `${min} - ${max} ${currency || ''} ${period ? '('+period+')' : ''}`;
            if (min) return `${min} ${currency || ''}`;
        }
        return 'Not disclosed';
    }

    // Helper: extract company name regardless of shape
    const companyName = job.company ? (job.company.name || job.company) : 'Unknown Company';
    const locationText = formatLocation(job.location);
    const jobTypeText = formatJobType(job);
    const salaryText = job.salaryRange || formatSalary(job.salary) || job.salary || 'Not disclosed';

    const card = document.createElement('div');
    card.className = 'job-card';

    // Build requirements tags safely
    const rawReqs = job.requirements;
    let reqSkills = [];
    if (Array.isArray(rawReqs)) reqSkills = rawReqs;
    else if (rawReqs && Array.isArray(rawReqs.skills)) reqSkills = rawReqs.skills.map(r => (typeof r === 'string' ? r : r.name));
    else if (rawReqs && rawReqs.length) reqSkills = rawReqs;

    card.innerHTML = `
        <div class="job-header">
            <h3>${job.title || 'Untitled Role'}</h3>
            ${job.isUrgent ? '<span class="urgent-badge">Urgent</span>' : ''}
        </div>
        <div class="company-info">
            <i class="fas fa-building"></i>
            <span>${companyName}</span>
        </div>
        <div class="job-details">
            <div class="detail">
                <i class="fas fa-map-marker-alt"></i>
                <span>${locationText}</span>
            </div>
            <div class="detail">
                <i class="fas fa-clock"></i>
                <span>${jobTypeText}</span>
            </div>
            <div class="detail">
                <i class="fas fa-money-bill-wave"></i>
                <span>${salaryText}</span>
            </div>
        </div>
        <p class="job-description">${job.description || ''}</p>
        <div class="requirements">
            <strong>Requirements:</strong>
            <div class="tags">
                ${reqSkills.map(req => `<span class="tag">${req}</span>`).join('')}
            </div>
        </div>
        <div class="platform-info">
            <i class="fas fa-external-link-alt"></i>
            <span>via ${job.platform || job.source || ''}</span>
        </div>
        <button class="apply-btn" onclick="openApplicationModal('${(job.title||'').replace(/'/g,"\'")}', '${(companyName||'').replace(/'/g,"\'")}')">
            Apply Now
        </button>
    `;

    return card;
}

// Initialize jobs on page load
async function initializeJobs() {
    try {
        const jobs = await fetchJobsFromAPI();
        await displayJobs(jobs);
        
        // Update job count
        const jobCountElement = document.querySelector('.section-header h2');
        if (jobCountElement) {
            const count = jobs.length;
            jobCountElement.innerHTML = `Job Openings <span class="job-count">(${count})</span>`;
        }
    } catch (error) {
        console.error('Error initializing jobs:', error);
        // Fallback to static data
        const staticJobs = getStaticJobs();
        displayJobs(staticJobs);
    }
}

// Update the DOMContentLoaded event listener to include job initialization
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Initialize jobs from API
    initializeJobs();
    
    // Setup contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmission);
    }
    
    // ... existing code ...
}); 

// Job Application Modal Functions
function openApplicationModal(jobTitle, companyName) {
    const modal = document.getElementById('applicationModal');
    const jobTitleSpan = document.getElementById('jobTitle');
    
    if (jobTitleSpan) {
        jobTitleSpan.textContent = jobTitle;
    }
    
    // Store job info for form submission
    modal.dataset.jobTitle = jobTitle;
    modal.dataset.companyName = companyName;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Focus on first input
    setTimeout(() => {
        const firstInput = modal.querySelector('input');
        if (firstInput) firstInput.focus();
    }, 100);
}

function closeApplicationModal() {
    const modal = document.getElementById('applicationModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function handleApplicationSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Get job info from modal
    const modal = document.getElementById('applicationModal');
    const jobTitle = modal.dataset.jobTitle;
    const companyName = modal.dataset.companyName;
    
    // Add job info to form data
    formData.append('jobTitle', jobTitle);
    formData.append('companyName', companyName);
    formData.append('appliedAt', new Date().toISOString());
    
    // Validate required fields
    const requiredFields = ['applicantFirstName', 'applicantLastName', 'applicantEmail', 'cvUpload'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.style.borderColor = '#ff6b6b';
            isValid = false;
        } else {
            field.style.borderColor = '#e1e8ed';
        }
    });
    
    if (!isValid) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Success message
        showApplicationSuccess(jobTitle, companyName);
        
        // Reset form and close modal
        form.reset();
        closeApplicationModal();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Application Success Message
function showApplicationSuccess(jobTitle, companyName) {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'application-success-notification';
    notification.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <div class="success-text">
                <h4>Application Submitted Successfully!</h4>
                <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been submitted.</p>
                <p>We'll review your application and get back to you soon.</p>
            </div>
        </div>
        <button class="close-notification" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 8000);
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('applicationModal');
    if (event.target === modal) {
        closeApplicationModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeApplicationModal();
    }
}); 

// Certification Detail Modal Functions
function openCertDetail(certType) {
    const modal = document.getElementById('certDetailModal');
    const certData = getCertificationData(certType);
    
    if (certData) {
        // Update modal content
        document.getElementById('certDetailTitle').textContent = certData.title;
        document.getElementById('certDetailName').textContent = certData.name;
        document.getElementById('certDetailDescription').textContent = certData.description;
        document.getElementById('certDetailDuration').textContent = certData.duration;
        document.getElementById('certDetailCost').textContent = certData.cost;
        document.getElementById('certDetailValidity').textContent = certData.validity;
        
        // Update icon
        const iconElement = document.getElementById('certDetailIcon');
        iconElement.innerHTML = `<i class="${certData.icon}"></i>`;
        
        // Load tab content
        loadTabContent(certData);
        
        // Show modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeCertDetail() {
    const modal = document.getElementById('certDetailModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function getCertificationData(certType) {
    const certifications = {
        'aws': {
            title: 'AWS Certification Details',
            name: 'Amazon Web Services (AWS)',
            description: 'Comprehensive cloud computing certification covering AWS services, architecture, and best practices.',
            duration: '3-6 months',
            cost: '$150-300',
            validity: '3 years',
            icon: 'fab fa-aws',
            overview: {
                content: `
                    <h5>What is AWS Certification?</h5>
                    <p>AWS certifications validate your expertise in cloud computing and demonstrate your ability to design, deploy, and operate applications on AWS infrastructure.</p>
                    
                    <h5>Why Choose AWS?</h5>
                    <ul>
                        <li>Market leader in cloud computing</li>
                        <li>High demand in job market</li>
                        <li>Comprehensive service portfolio</li>
                        <li>Excellent career growth opportunities</li>
                    </ul>
                `
            },
            prerequisites: {
                content: `
                    <h5>Basic Requirements</h5>
                    <ul>
                        <li>Basic IT knowledge</li>
                        <li>Understanding of cloud concepts</li>
                        <li>6+ months of AWS experience (recommended)</li>
                        <li>Familiarity with programming concepts</li>
                    </ul>
                    
                    <h5>Recommended Experience</h5>
                    <ul>
                        <li>1+ years in IT or software development</li>
                        <li>Experience with networking and security</li>
                        <li>Knowledge of Linux/Windows administration</li>
                    </ul>
                `
            },
            examDetails: {
                content: `
                    <h5>Exam Format</h5>
                    <ul>
                        <li>Multiple choice questions</li>
                        <li>65 questions for Associate level</li>
                        <li>75 questions for Professional level</li>
                        <li>130 minutes for Associate, 180 for Professional</li>
                        <li>Passing score: 720/1000</li>
                    </ul>
                    
                    <h5>Exam Topics</h5>
                    <ul>
                        <li>Security and Identity</li>
                        <li>Technology</li>
                        <li>Cloud Concepts</li>
                        <li>Billing and Pricing</li>
                    </ul>
                `
            },
            careerBenefits: {
                content: `
                    <h5>Salary Impact</h5>
                    <ul>
                        <li>Average salary increase: 20-30%</li>
                        <li>Entry-level: $70,000 - $90,000</li>
                        <li>Mid-level: $90,000 - $130,000</li>
                        <li>Senior-level: $130,000 - $180,000</li>
                    </ul>
                    
                    <h5>Career Opportunities</h5>
                    <ul>
                        <li>Cloud Architect</li>
                        <li>DevOps Engineer</li>
                        <li>Solutions Architect</li>
                        <li>Cloud Consultant</li>
                        <li>Infrastructure Engineer</li>
                    </ul>
                `
            },
            studyResources: {
                content: `
                    <h5>Official Resources</h5>
                    <ul>
                        <li>AWS Training and Certification</li>
                        <li>AWS Documentation</li>
                        <li>Practice Exams</li>
                        <li>Hands-on Labs</li>
                    </ul>
                    
                    <h5>Recommended Courses</h5>
                    <ul>
                        <li>AWS Certified Solutions Architect - Associate</li>
                        <li>AWS Certified Developer - Associate</li>
                        <li>AWS Certified SysOps Administrator - Associate</li>
                        <li>AWS Certified Solutions Architect - Professional</li>
                    </ul>
                `
            }
        },
        'azure': {
            title: 'Microsoft Azure Certification Details',
            name: 'Microsoft Azure',
            description: 'Microsoft\'s cloud platform certification covering Azure services, solutions, and enterprise integration.',
            duration: '3-6 months',
            cost: '$165-165',
            validity: '2 years',
            icon: 'fas fa-database',
            overview: {
                content: `
                    <h5>What is Azure Certification?</h5>
                    <p>Microsoft Azure certifications validate your expertise in Microsoft\'s cloud platform and demonstrate your ability to implement, manage, and monitor Azure solutions.</p>
                    
                    <h5>Why Choose Azure?</h5>
                    <ul>
                        <li>Enterprise-focused cloud platform</li>
                        <li>Strong integration with Microsoft ecosystem</li>
                        <li>Growing market share</li>
                        <li>Excellent for enterprise careers</li>
                    </ul>
                `
            },
            prerequisites: {
                content: `
                    <h5>Basic Requirements</h5>
                    <ul>
                        <li>Basic IT knowledge</li>
                        <li>Understanding of cloud concepts</li>
                        <li>6+ months of Azure experience (recommended)</li>
                        <li>Familiarity with Microsoft technologies</li>
                    </ul>
                `
            },
            examDetails: {
                content: `
                    <h5>Exam Format</h5>
                    <ul>
                        <li>Multiple choice questions</li>
                        <li>40-60 questions depending on level</li>
                        <li>120-150 minutes</li>
                        <li>Passing score: 700/1000</li>
                    </ul>
                `
            },
            careerBenefits: {
                content: `
                    <h5>Salary Impact</h5>
                    <ul>
                        <li>Average salary increase: 15-25%</li>
                        <li>Entry-level: $65,000 - $85,000</li>
                        <li>Mid-level: $85,000 - $120,000</li>
                        <li>Senior-level: $120,000 - $160,000</li>
                    </ul>
                `
            },
            studyResources: {
                content: `
                    <h5>Official Resources</h5>
                    <ul>
                        <li>Microsoft Learn</li>
                        <li>Azure Documentation</li>
                        <li>Practice Tests</li>
                        <li>Hands-on Labs</li>
                    </ul>
                `
            }
        },
        'java': {
            title: 'Oracle Java Certification Details',
            name: 'Oracle Java',
            description: 'Professional Java programming certification covering core Java concepts, advanced features, and enterprise development.',
            duration: '4-8 months',
            cost: '$245',
            validity: 'Lifetime',
            icon: 'fab fa-java',
            overview: {
                content: `
                    <h5>What is Java Certification?</h5>
                    <p>Oracle Java certifications validate your expertise in Java programming and demonstrate your ability to develop robust, scalable applications.</p>
                    
                    <h5>Why Choose Java?</h5>
                    <ul>
                        <li>Most popular programming language</li>
                        <li>Extensive job opportunities</li>
                        <li>Strong enterprise presence</li>
                        <li>Excellent for career growth</li>
                    </ul>
                `
            },
            prerequisites: {
                content: `
                    <h5>Basic Requirements</h5>
                    <ul>
                        <li>Basic programming knowledge</li>
                        <li>Understanding of OOP concepts</li>
                        <li>6+ months of Java experience</li>
                        <li>Familiarity with development tools</li>
                    </ul>
                `
            },
            examDetails: {
                content: `
                    <h5>Exam Format</h5>
                    <ul>
                        <li>Multiple choice questions</li>
                        <li>60-80 questions depending on level</li>
                        <li>150-180 minutes</li>
                        <li>Passing score: 65%</li>
                    </ul>
                `
            },
            careerBenefits: {
                content: `
                    <h5>Salary Impact</h5>
                    <ul>
                        <li>Average salary increase: 25-35%</li>
                        <li>Entry-level: $60,000 - $80,000</li>
                        <li>Mid-level: $80,000 - $120,000</li>
                        <li>Senior-level: $120,000 - $180,000</li>
                    </ul>
                `
            },
            studyResources: {
                content: `
                    <h5>Official Resources</h5>
                    <ul>
                        <li>Oracle Documentation</li>
                        <li>Java Tutorials</li>
                        <li>Practice Exams</li>
                        <li>Code Examples</li>
                    </ul>
                `
            }
        },
        'cissp': {
        title: 'CISSP Certification Details',
        name: 'CISSP',
        description: 'Information security and cybersecurity certification for professionals.',
        duration: '4-6 months',
        cost: '$699',
        validity: '3 years',
        icon: 'fas fa-shield-alt',
        overview: {
            content: `
                <h5>What is CISSP?</h5>
                <p>CISSP (Certified Information Systems Security Professional) is a globally recognized certification in information security, covering security and risk management, asset security, and network security.</p>
                <h5>Why Choose CISSP?</h5>
                    <ul>
                        <li>Enterprise-focused cloud platform</li>
                        <li>Strong integration with Microsoft ecosystem</li>
                        <li>Growing market share</li>
                        <li>Excellent for enterprise careers</li>
                    </ul>
            `
        },
        prerequisites: {
            content: `
                <h5>Requirements</h5>
                <ul>
                    <li>Minimum 5 years of professional experience in security</li>
                    <li>Understanding of security concepts and principles</li>
                    <li>Knowledge of information systems and risk management</li>
                </ul>
            `
        },
        examDetails: {
            content: `
                <h5>Exam Format</h5>
                <ul>
                    <li>Multiple-choice and advanced innovative questions</li>
                    <li>250 questions</li>
                    <li>6 hours duration</li>
                    <li>Passing score: 700/1000</li>
                </ul>
            `
        },
        careerBenefits: {
            content: `
                <h5>Career Impact</h5>
                <ul>
                    <li>Average salary: $90,000 - $140,000</li>
                    <li>Roles: Security Analyst, Security Engineer, Security Architect</li>
                    <li>High demand globally for cybersecurity professionals</li>
                </ul>
            `
        },
        studyResources: {
            content: `
                <h5>Recommended Resources</h5>
                <ul>
                    <li>(ISC)² Official Study Guide</li>
                    <li>Practice Exams and Labs</li>
                    <li>Online Training Platforms</li>
                </ul>
            `
        }
    },

    'gcp': {
        title: 'Google Cloud Certification Details',
        name: 'Google Cloud',
        description: 'Cloud infrastructure and services certification by Google.',
        duration: '3-6 months',
        cost: '$125-$200 per exam',
        validity: '2 years',
        icon: 'fab fa-google',
        overview: {
            content: `
                <h5>What is Google Cloud Certification?</h5>
                <p>Validates your ability to design, develop, and manage applications on Google Cloud Platform across multiple services and environments.</p>
                <h5>Why Choose Google Cloud?</h5>
                    <ul>
                        <li>Enterprise-focused cloud platform</li>
                        <li>Strong integration with Microsoft ecosystem</li>
                        <li>Growing market share</li>
                        <li>Excellent for enterprise careers</li>
                    </ul>
            `
        },
        prerequisites: {
            content: `
                <h5>Basic Requirements</h5>
                <ul>
                    <li>Basic cloud knowledge</li>
                    <li>Experience with GCP services recommended</li>
                    <li>Understanding of DevOps and networking concepts</li>
                </ul>
            `
        },
        examDetails: {
            content: `
                <h5>Exam Format</h5>
                <ul>
                    <li>Multiple choice and multiple select</li>
                    <li>60-90 minutes (Associate), 2 hours (Professional)</li>
                    <li>Passing score varies by exam</li>
                </ul>
            `
        },
        careerBenefits: {
            content: `
                <h5>Salary Impact</h5>
                <ul>
                    <li>Average salary: $70,000 - $130,000</li>
                    <li>Roles: Cloud Engineer, Cloud Architect, DevOps Engineer</li>
                </ul>
            `
        },
        studyResources: {
            content: `
                <h5>Official Resources</h5>
                <ul>
                    <li>Google Cloud Training</li>
                    <li>Coursera / Qwiklabs Labs</li>
                    <li>Practice Exams</li>
                </ul>
            `
        }
    },

    'ccna': {
        title: 'CCNA Certification Details',
        name: 'CCNA',
        description: 'Cisco networking fundamentals certification.',
        duration: '3-6 months',
        cost: '$300',
        validity: '3 years',
        icon: 'fas fa-network-wired',
        overview: {
            content: `
                <h5>What is CCNA?</h5>
                <p>CCNA (Cisco Certified Network Associate) validates your ability to install, configure, operate, and troubleshoot medium-size routed and switched networks.</p>
                <h5>Why Choose CCNA?</h5>
                    <ul>
                        <li>Enterprise-focused cloud platform</li>
                        <li>Strong integration with Microsoft ecosystem</li>
                        <li>Growing market share</li>
                        <li>Excellent for enterprise careers</li>
                    </ul>
            `
        },
        prerequisites: {
            content: `
                <h5>Requirements</h5>
                <ul>
                    <li>Basic understanding of networking</li>
                    <li>Knowledge of IP addressing and routing</li>
                </ul>
            `
        },
        examDetails: {
            content: `
                <h5>Exam Format</h5>
                <ul>
                    <li>Multiple choice, drag-and-drop, simulations</li>
                    <li>120 minutes duration</li>
                    <li>Passing score: ~825/1000</li>
                </ul>
            `
        },
        careerBenefits: {
            content: `
                <h5>Career Impact</h5>
                <ul>
                    <li>Average salary: $60,000 - $100,000</li>
                    <li>Roles: Network Engineer, System Administrator</li>
                </ul>
            `
        },
        studyResources: {
            content: `
                <h5>Recommended Resources</h5>
                <ul>
                    <li>Cisco Official Guide</li>
                    <li>Lab Simulations</li>
                    <li>Practice Exams</li>
                </ul>
            `
        }
    },

    'comptia-a': {
        title: 'CompTIA A+ Certification Details',
        name: 'CompTIA A+',
        description: 'IT fundamentals and hardware certification.',
        duration: '2-4 months',
        cost: '$246 per exam',
        validity: '3 years',
        icon: 'fas fa-server',
        overview: {
            content: `
                <h5>What is CompTIA A+?</h5>
                <p>CompTIA A+ validates foundational IT skills, including hardware, networking, mobile devices, operating systems, and troubleshooting.</p>
                <h5>Why Choose CompTIA A+?</h5>
                    <ul>
                        <li>Enterprise-focused cloud platform</li>
                        <li>Strong integration with Microsoft ecosystem</li>
                        <li>Growing market share</li>
                        <li>Excellent for enterprise careers</li>
                    </ul>
            `
        },
        prerequisites: {
            content: `
                <h5>Requirements</h5>
                <ul>
                    <li>No prior certification required</li>
                    <li>Recommended 9-12 months of IT experience</li>
                </ul>
            `
        },
        examDetails: {
            content: `
                <h5>Exam Format</h5>
                <ul>
                    <li>Multiple choice, drag-and-drop</li>
                    <li>Two exams (Core 1 and Core 2)</li>
                    <li>90 minutes per exam</li>
                    <li>Passing score: varies per exam</li>
                </ul>
            `
        },
        careerBenefits: {
            content: `
                <h5>Career Impact</h5>
                <ul>
                    <li>Average salary: $50,000 - $70,000</li>
                    <li>Roles: IT Support, Help Desk Technician, Technical Support</li>
                </ul>
            `
        },
        studyResources: {
            content: `
                <h5>Recommended Resources</h5>
                <ul>
                    <li>CompTIA Official Study Guide</li>
                    <li>Practice Labs and Tests</li>
                </ul>
            `
        }
    },
    python: {
        title: 'Python Institute Certification Details',
        name: 'Python Institute',
        description: 'Python programming certification covering foundational to advanced skills.',
        duration: '2-5 months',
        cost: '$150-$300',
        validity: '3 years',
        icon: 'fab fa-python',
        overview: {
            content: `
                <h5>What is Python Institute Certification?</h5>
                <p>Validates your proficiency in Python programming, from basic coding concepts to advanced development practices.</p>
                <h5>Why Choose Python Certification?</h5>
                <ul>
                    <li>Python is widely used in web development, AI/ML, and data analytics</li>
                    <li>High demand for Python developers</li>
                    <li>Strong community and learning resources</li>
                    <li>Enhances career opportunities and salary potential</li>
                </ul>
            
            `
        },
        

        prerequisites: {
            content: `
                <h5>Requirements</h5>
                <ul>
                    <li>Basic programming knowledge recommended</li>
                    <li>Familiarity with Python syntax helpful</li>
                </ul>
            `
        },
        examDetails: {
            content: `
                <h5>Exam Format</h5>
                <ul>
                    <li>Multiple choice questions</li>
                    <li>PCAP: Entry-level exam</li>
                    <li>PCPP: Advanced-level exam</li>
                    <li>Duration: 90-120 minutes</li>
                </ul>
            `
        },
        careerBenefits: {
            content: `
                <h5>Career Impact</h5>
                <ul>
                    <li>Roles: Python Developer, Data Analyst, AI/ML Engineer</li>
                    <li>Average salary: $60,000 - $120,000</li>
                </ul>
            `
        },
        studyResources: {
            content: `
                <h5>Resources</h5>
                <ul>
                    <li>Python Institute Official Study Guides</li>
                    <li>Practice labs and coding exercises</li>
                    <li>Online courses and tutorials</li>
                </ul>
            `
        }
    },

    dotnet: {
        title: 'Microsoft .NET Certification Details',
        name: 'Microsoft .NET',
        description: '.NET development certification covering C# and application development.',
        duration: '3-6 months',
        cost: '$165-$250',
        validity: '2 years',
        icon: 'fab fa-microsoft',
        overview: {
            content: `
                <h5>What is Microsoft .NET Certification?</h5>
                <p>Validates your skills in developing desktop, web, and cloud applications using the .NET framework.</p>
                <h5>Why Choose .NET Certification?</h5>
                <ul>
                    <li>.NET is widely used in enterprise software development</li>
                    <li>Strong demand for full-stack and backend developers</li>
                    <li>Enhances problem-solving and software architecture skills</li>
                    <li>Opens opportunities in Microsoft ecosystem</li>
                </ul>
            `
        },
        prerequisites: {
            content: `
                <h5>Requirements</h5>
                <ul>
                    <li>Basic programming knowledge</li>
                    <li>Familiarity with C# or any object-oriented language</li>
                </ul>
            `
        },
        examDetails: {
            content: `
                <h5>Exam Format</h5>
                <ul>
                    <li>Multiple choice questions</li>
                    <li>Performance-based tasks</li>
                    <li>Duration: 90-120 minutes</li>
                </ul>
            `
        },
        careerBenefits: {
            content: `
                <h5>Career Impact</h5>
                <ul>
                    <li>Roles: .NET Developer, Full-Stack Developer</li>
                    <li>Average salary: $70,000 - $120,000</li>
                </ul>
            `
        },
        studyResources: {
            content: `
                <h5>Resources</h5>
                <ul>
                    <li>Microsoft Learn</li>
                    <li>Official Microsoft documentation</li>
                    <li>Hands-on labs and practice projects</li>
                </ul>
            `
        }
    },

    react: {
        title: 'React Certification Details',
        name: 'React',
        description: 'Frontend development certification focusing on React.js framework.',
        duration: '2-4 months',
        cost: '$150-$300',
        validity: '2 years',
        icon: 'fab fa-react',
        overview: {
            content: `
                <h5>What is React Certification?</h5>
                <p>Validates your skills in building dynamic, responsive web applications using the React framework.</p>
                <h5>Why Choose React Certification?</h5>
                <ul>
                    <li>React is the most popular frontend library for web development</li>
                    <li>High demand for React developers in startups and enterprises</li>
                    <li>Improves your frontend development skills</li>
                    <li>Enables career growth in web and mobile development</li>
                </ul>
            `
        },
        prerequisites: {
            content: `
                <h5>Requirements</h5>
                <ul>
                    <li>Basic knowledge of HTML, CSS, JavaScript</li>
                    <li>Understanding of component-based architecture</li>
                </ul>
            `
        },
        examDetails: {
            content: `
                <h5>Exam Format</h5>
                <ul>
                    <li>Multiple choice questions</li>
                    <li>Hands-on coding tasks</li>
                    <li>Duration: 90-120 minutes</li>
                </ul>
            `
        },
        careerBenefits: {
            content: `
                <h5>Career Impact</h5>
                <ul>
                    <li>Roles: Frontend Developer, UI Engineer</li>
                    <li>Average salary: $65,000 - $110,000</li>
                </ul>
            `
        },
        studyResources: {
            content: `
                <h5>Resources</h5>
                <ul>
                    <li>Official React documentation</li>
                    <li>Online tutorials and coding challenges</li>
                    <li>React practice projects</li>
                </ul>
            `
        }
    },

    nodejs: {
        title: 'Node.js Certification Details',
        name: 'Node.js',
        description: 'Backend development certification focusing on Node.js runtime.',
        duration: '2-4 months',
        cost: '$150-$250',
        validity: '2 years',
        icon: 'fab fa-node-js',
        overview: {
            content: `
                <h5>What is Node.js Certification?</h5>
                <p>Validates your skills in building scalable backend applications using Node.js and associated technologies.</p>
                <h5>Why Choose Node.js Certification?</h5>
                <ul>
                    <li>Node.js is widely used for backend and full-stack development</li>
                    <li>High demand for scalable server-side solutions</li>
                    <li>Enhances career prospects in backend and full-stack roles</li>
                    <li>Supports modern development with JavaScript across front and back-end</li>
                </ul>
            `
        },
        prerequisites: {
            content: `
                <h5>Requirements</h5>
                <ul>
                    <li>Basic JavaScript knowledge</li>
                    <li>Understanding of server-side concepts</li>
                </ul>
            `
        },
        examDetails: {
            content: `
                <h5>Exam Format</h5>
                <ul>
                    <li>Multiple choice and coding exercises</li>
                    <li>Duration: 90-120 minutes</li>
                </ul>
            `
        },
        careerBenefits: {
            content: `
                <h5>Career Impact</h5>
                <ul>
                    <li>Roles: Backend Developer, Full-Stack Developer</li>
                    <li>Average salary: $70,000 - $120,000</li>
                </ul>
            `
        },
        studyResources: {
            content: `
                <h5>Resources</h5>
                <ul>
                    <li>Official Node.js documentation</li>
                    <li>Online tutorials and labs</li>
                    <li>Practice projects and coding challenges</li>
                </ul>
            `
        }
    },

    docker: {
        title: 'Docker Certification Details',
        name: 'Docker',
        description: 'Containerization and DevOps certification using Docker technology.',
        duration: '2-3 months',
        cost: '$195',
        validity: '2 years',
        icon: 'fab fa-docker',
        overview: {
            content: `
                <h5>What is Docker Certification?</h5>
                <p>Validates your ability to build, deploy, and manage containerized applications using Docker.</p>
                <h5>Why Choose Docker Certification?</h5>
                <ul>
                    <li>Docker is essential for modern DevOps and microservices development</li>
                    <li>High demand in cloud-native development roles</li>
                    <li>Improves deployment and CI/CD skills</li>
                    <li>Widely recognized by tech employers</li>
                </ul>
            `
        },

        prerequisites: {
            content: `
                <h5>Requirements</h5>
                <ul>
                    <li>Basic knowledge of Linux and command-line tools</li>
                    <li>Understanding of software development lifecycle</li>
                </ul>
            `
        },
        examDetails: {
            content: `
                <h5>Exam Format</h5>
                <ul>
                    <li>Multiple choice and practical tasks</li>
                    <li>Duration: 90 minutes</li>
                </ul>
            `
        },
        careerBenefits: {
            content: `
                <h5>Career Impact</h5>
                <ul>
                    <li>Roles: DevOps Engineer, Site Reliability Engineer, Backend Developer</li>
                    <li>Average salary: $80,000 - $130,000</li>
                </ul>
            `
        },
        studyResources: {
            content: `
                <h5>Resources</h5>
                <ul>
                    <li>Docker official documentation</li>
                    <li>Hands-on labs</li>
                    <li>Practice exams and courses</li>
                </ul>
            `
        }
    
},
    pmp: {
        title: 'PMP Certification Details',
        name: 'PMP',
        description: 'Project Management Professional certification for managing projects effectively.',
        duration: '3-6 months',
        cost: '$555-$615',
        validity: '3 years',
        icon: 'fas fa-project-diagram',
        overview: {
            content: `
                <h5>What is PMP?</h5>
                <p>PMP certification validates your skills in project management, including planning, execution, monitoring, and closure of projects across industries.</p>
                <h5>Why Choose PMP?</h5>
                <ul>
                    <li>Globally recognized project management certification</li>
                    <li>Enhances leadership and management skills</li>
                    <li>High demand for certified project managers</li>
                    <li>Increases salary potential and career growth</li>
                </ul>
            `
        },
        
        prerequisites: {
            content: `
                <h5>Requirements</h5>
                <ul>
                    <li>Secondary degree with 5 years project management experience OR</li>
                    <li>Bachelor’s degree with 3 years project management experience</li>
                    <li>35 hours of project management education</li>
                </ul>
            `
        },
        examDetails: {
            content: `
                <h5>Exam Format</h5>
                <ul>
                    <li>200 multiple-choice questions</li>
                    <li>Duration: 4 hours</li>
                    <li>Passing score: Varies by exam form</li>
                </ul>
            `
        },
        careerBenefits: {
            content: `
                <h5>Career Impact</h5>
                <ul>
                    <li>Roles: Project Manager, Program Manager</li>
                    <li>Average salary: $90,000 - $140,000</li>
                </ul>
            `
        },
        studyResources: {
            content: `
                <h5>Resources</h5>
                <ul>
                    <li>PMI Official Guide</li>
                    <li>PMP Prep Courses and Bootcamps</li>
                    <li>Practice Exams and Simulations</li>
                </ul>
            `
        }
    },

    itil: {
        title: 'ITIL Foundation Certification Details',
        name: 'ITIL',
        description: 'IT service management certification for optimizing IT services.',
        duration: '1-3 months',
        cost: '$200-$400',
        validity: '3 years',
        icon: 'fas fa-users-cog',
        overview: {
            content: `
                <h5>What is ITIL?</h5>
                <p>ITIL certification provides a framework for IT service management, helping organizations deliver high-quality IT services efficiently.</p>
                <h5>Why Choose ITIL?</h5>
                <ul>
                    <li>Standardized IT service management framework</li>
                    <li>Improves process efficiency and service delivery</li>
                    <li>Recognized globally in IT industry</li>
                    <li>Enhances IT career prospects</li>
                </ul>
            `
        },
        prerequisites: {
            content: `
                <h5>Requirements</h5>
                <ul>
                    <li>No prior experience required for Foundation level</li>
                    <li>Intermediate levels require professional experience in ITSM</li>
                </ul>
            `
        },
        examDetails: {
            content: `
                <h5>Exam Format</h5>
                <ul>
                    <li>Multiple choice questions</li>
                    <li>Duration: 60 minutes</li>
                    <li>Passing score: 65%</li>
                </ul>
            `
        },
        careerBenefits: {
            content: `
                <h5>Career Impact</h5>
                <ul>
                    <li>Roles: IT Service Manager, IT Consultant</li>
                    <li>Average salary: $60,000 - $110,000</li>
                </ul>
            `
        },
        studyResources: {
            content: `
                <h5>Resources</h5>
                <ul>
                    <li>AXELOS Official ITIL Guide</li>
                    <li>Online courses and practice exams</li>
                    <li>Workshops and labs</li>
                </ul>
            `
        }
    },

    'six-sigma': {
        title: 'Six Sigma Certification Details',
        name: 'Six Sigma',
        description: 'Process improvement methodology certification (Green Belt & Black Belt).',
        duration: '2-5 months',
        cost: '$400-$800',
        validity: '3 years',
        icon: 'fas fa-certificate',
        overview: {
            content: `
                <h5>What is Six Sigma?</h5>
                <p>Six Sigma certification teaches process improvement techniques to reduce defects, improve quality, and increase efficiency.</p>
                <h5>Why Choose Six Sigma?</h5>
                <ul>
                    <li>Recognized globally for quality and process management</li>
                    <li>Applicable across industries</li>
                    <li>Enhances analytical and problem-solving skills</li>
                    <li>Improves career prospects and salary</li>
                </ul>
            `
        },
        prerequisites: {
            content: `
                <h5>Requirements</h5>
                <ul>
                    <li>Basic understanding of business processes</li>
                    <li>Experience in process improvement recommended for Black Belt</li>
                </ul>
            `
        },
        examDetails: {
            content: `
                <h5>Exam Format</h5>
                <ul>
                    <li>Multiple choice questions</li>
                    <li>Duration: 2-4 hours</li>
                </ul>
            `
        },
        careerBenefits: {
            content: `
                <h5>Career Impact</h5>
                <ul>
                    <li>Roles: Process Improvement Specialist, Quality Manager</li>
                    <li>Average salary: $70,000 - $130,000</li>
                </ul>
            `
        },
        studyResources: {
            content: `
                <h5>Resources</h5>
                <ul>
                    <li>Official Six Sigma Guides</li>
                    <li>Online courses and simulations</li>
                    <li>Practice exams and workshops</li>
                </ul>
            `
        }
    },

    prince2: {
        title: 'PRINCE2 Certification Details',
        name: 'PRINCE2',
        description: 'Project management methodology certification (Foundation & Practitioner).',
        duration: '1-3 months',
        cost: '$400-$600',
        validity: '5 years',
        icon: 'fas fa-chart-bar',
        overview: {
            content: `
                <h5>What is PRINCE2?</h5>
                <p>PRINCE2 certification teaches a structured project management methodology recognized worldwide for effective project delivery.</p>
                <h5>Why Choose PRINCE2?</h5>
                <ul>
                    <li>Globally recognized project management framework</li>
                    <li>Applicable in government and private sector projects</li>
                    <li>Improves project planning, monitoring, and control skills</li>
                    <li>Boosts career growth in project management</li>
                </ul>
            `
        },
        prerequisites: {
            content: `
                <h5>Requirements</h5>
                <ul>
                    <li>No prior experience required for Foundation</li>
                    <li>Practitioner level requires Foundation certification</li>
                </ul>
            `
        },
        examDetails: {
            content: `
                <h5>Exam Format</h5>
                <ul>
                    <li>Foundation: 60 multiple choice questions, 60 mins</li>
                    <li>Practitioner: Scenario-based, 68 questions, 150 mins</li>
                </ul>
            `
        },
        careerBenefits: {
            content: `
                <h5>Career Impact</h5>
                <ul>
                    <li>Roles: Project Manager, Program Manager</li>
                    <li>Average salary: $80,000 - $130,000</li>
                </ul>
            `
        },
        studyResources: {
            content: `
                <h5>Resources</h5>
                <ul>
                    <li>AXELOS PRINCE2 Manual</li>
                    <li>Practice exams and mock projects</li>
                    <li>Online courses and bootcamps</li>
                </ul>
            `
        }
    },

    'agile-scrum': {
        title: 'Agile & Scrum Certification Details',
        name: 'Agile & Scrum',
        description: 'Agile project management certification covering Scrum methodology.',
        duration: '1-3 months',
        cost: '$200-$500',
        validity: '2 years',
        icon: 'fas fa-balance-scale',
        overview: {
            content: `
                <h5>What is Agile & Scrum Certification?</h5>
                <p>Validates your knowledge of Agile principles and Scrum framework for iterative and flexible project delivery.</p>
                <h5>Why Choose Agile & Scrum?</h5>
                <ul>
                    <li>Agile is widely used in software and business projects</li>
                    <li>Improves team collaboration and productivity</li>
                    <li>High demand for certified Scrum Masters and Agile practitioners</li>
                    <li>Enhances adaptability in dynamic project environments</li>
                </ul>
            `
        },
        prerequisites: {
            content: `
                <h5>Requirements</h5>
                <ul>
                    <li>No prior experience required for Foundation</li>
                    <li>Advanced levels require Agile project experience</li>
                </ul>
            `
        },
        examDetails: {
            content: `
                <h5>Exam Format</h5>
                <ul>
                    <li>Multiple choice or scenario-based questions</li>
                    <li>Duration: 60-120 mins depending on level</li>
                </ul>
            `
        },
        careerBenefits: {
            content: `
                <h5>Career Impact</h5>
                <ul>
                    <li>Roles: Scrum Master, Agile Coach, Project Manager</li>
                    <li>Average salary: $70,000 - $120,000</li>
                </ul>
            `
        },
        studyResources: {
            content: `
                <h5>Resources</h5>
                <ul>
                    <li>Scrum Guide Official Documentation</li>
                    <li>Online courses and practice exams</li>
                    <li>Workshops and hands-on simulations</li>
                </ul>
            `
        }
    },

    mba: {
        title: 'MBA Specializations Certification Details',
        name: 'MBA',
        description: 'Business administration degrees with various specializations.',
        duration: '1-2 years',
        cost: '$20,000-$80,000',
        validity: 'Degree-based',
        icon: 'fas fa-graduation-cap',
        overview: {
            content: `
                <h5>What is an MBA?</h5>
                <p>MBA programs provide advanced business knowledge and management skills across various specializations like Finance, Marketing, HR, and Operations.</p>
                <h5>Why Choose an MBA?</h5>
                <ul>
                    <li>Widely recognized business qualification globally</li>
                    <li>Enhances leadership and managerial skills</li>
                    <li>Opens career opportunities in multiple industries</li>
                    <li>Significant increase in earning potential</li>
                </ul>
            `
        },
        
        prerequisites: {
            content: `
                <h5>Requirements</h5>
                <ul>
                    <li>Bachelor’s degree in any discipline</li>
                    <li>Work experience preferred for executive programs</li>
                </ul>
            `
        },
        examDetails: {
            content: `
                <h5>Exam Format</h5>
                <ul>
                    <li>Program-based assessments, case studies, and exams</li>
                    <li>Varies by university and specialization</li>
                </ul>
            `
        },
        careerBenefits: {
            content: `
                <h5>Career Impact</h5>
                <ul>
                    <li>Roles: Manager, Executive, Entrepreneur</li>
                    <li>Average salary: $80,000 - $150,000 depending on specialization</li>
                </ul>
            `
        },
        studyResources: {
            content: `
                <h5>Resources</h5>
                <ul>
                    <li>University MBA curriculum</li>
                    <li>Case studies and business simulations</li>
                    <li>Workshops, seminars, and online resources</li>
                </ul>
            `
        }
    },
    'data-science': {
        title: 'Data Science Certification Details',
        name: 'Data Science',
        description: 'Certification covering machine learning, analytics, and AI applications.',
        duration: '3-6 months',
        cost: '$200-$500',
        validity: '2 years',
        icon: 'fas fa-brain',
        overview: {
            content: `
                <h5>What is Data Science Certification?</h5>
                <p>Validates your ability to analyze, interpret, and apply data using statistical and machine learning techniques.</p>
                <h5>Why Choose Data Science?</h5>
                <ul>
                    <li>High demand for data scientists across industries</li>
                    <li>Develops analytical, programming, and visualization skills</li>
                    <li>Applicable in AI, ML, and business analytics</li>
                    <li>Boosts career opportunities and salary potential</li>
                </ul>
            `
        },
        prerequisites: {
            content: `
                <h5>Requirements</h5>
                <ul>
                    <li>Basic programming and statistics knowledge</li>
                    <li>Familiarity with Python/R recommended</li>
                </ul>
            `
        },
        examDetails: {
            content: `
                <h5>Exam Format</h5>
                <ul>
                    <li>Multiple choice and practical coding exercises</li>
                    <li>Duration: 2-3 hours</li>
                </ul>
            `
        },
        careerBenefits: {
            content: `
                <h5>Career Impact</h5>
                <ul>
                    <li>Roles: Data Scientist, Machine Learning Engineer, Analyst</li>
                    <li>Average salary: $70,000 - $140,000</li>
                </ul>
            `
        },
        studyResources: {
            content: `
                <h5>Resources</h5>
                <ul>
                    <li>Online courses (Coursera, edX)</li>
                    <li>Books and practice datasets</li>
                    <li>Hands-on projects and Kaggle competitions</li>
                </ul>
            `
        }
    },

    tableau: {
        title: 'Tableau Certification Details',
        name: 'Tableau',
        description: 'Data visualization and business intelligence certification.',
        duration: '1-3 months',
        cost: '$100-$250',
        validity: '2 years',
        icon: 'fas fa-chart-pie',
        overview: {
            content: `
                <h5>What is Tableau Certification?</h5>
                <p>Validates your ability to design interactive dashboards, visualizations, and business intelligence reports using Tableau.</p>
                <h5>Why Choose Tableau?</h5>
                <ul>
                    <li>Tableau is a leading BI tool in industry</li>
                    <li>Enhances data visualization and storytelling skills</li>
                    <li>High demand for Tableau professionals</li>
                    <li>Applicable in analytics, marketing, and management roles</li>
                </ul>
            `
        },
        prerequisites: {
            content: `
                <h5>Requirements</h5>
                <ul>
                    <li>Basic understanding of data and Excel</li>
                    <li>Familiarity with BI concepts recommended</li>
                </ul>
            `
        },
        examDetails: {
            content: `
                <h5>Exam Format</h5>
                <ul>
                    <li>Multiple choice and hands-on practical tasks</li>
                    <li>Duration: 1-2 hours</li>
                </ul>
            `
        },
        careerBenefits: {
            content: `
                <h5>Career Impact</h5>
                <ul>
                    <li>Roles: Tableau Developer, BI Analyst</li>
                    <li>Average salary: $60,000 - $110,000</li>
                </ul>
            `
        },
        studyResources: {
            content: `
                <h5>Resources</h5>
                <ul>
                    <li>Tableau official training</li>
                    <li>Online courses and tutorials</li>
                    <li>Hands-on dashboards and sample projects</li>
                </ul>
            `
        }
    },

    'power-bi': {
        title: 'Power BI Certification Details',
        name: 'Power BI',
        description: 'Microsoft business intelligence certification for data analysis and visualization.',
        duration: '1-3 months',
        cost: '$100-$250',
        validity: '2 years',
        icon: 'fas fa-chart-line',
        overview: {
            content: `
                <h5>What is Power BI Certification?</h5>
                <p>Validates your skills in data modeling, visualization, and creating reports using Microsoft Power BI.</p>
                <h5>Why Choose Power BI?</h5>
                <ul>
                    <li>Microsoft Power BI is widely used in business analytics</li>
                    <li>Improves reporting and data-driven decision-making skills</li>
                    <li>High demand for BI professionals in multiple industries</li>
                    <li>Integrates with Microsoft ecosystem for enterprise solutions</li>
                </ul>
            `
        },
        prerequisites: {
            content: `
                <h5>Requirements</h5>
                <ul>
                    <li>Basic Excel and data analysis knowledge</li>
                    <li>Familiarity with databases recommended</li>
                </ul>
            `
        },
        examDetails: {
            content: `
                <h5>Exam Format</h5>
                <ul>
                    <li>Multiple choice questions and practical tasks</li>
                    <li>Duration: 1-2 hours</li>
                </ul>
            `
        },
        careerBenefits: {
            content: `
                <h5>Career Impact</h5>
                <ul>
                    <li>Roles: Power BI Developer, BI Analyst</li>
                    <li>Average salary: $60,000 - $115,000</li>
                </ul>
            `
        },
        studyResources: {
            content: `
                <h5>Resources</h5>
                <ul>
                    <li>Microsoft Learn and official documentation</li>
                    <li>Online courses and tutorials</li>
                    <li>Hands-on datasets and practice reports</li>
                </ul>
            `
        }
    },

    sql: {
        title: 'SQL Certification Details',
        name: 'SQL',
        description: 'Database management and querying certification.',
        duration: '1-3 months',
        cost: '$100-$250',
        validity: '2 years',
        icon: 'fas fa-database',
        overview: {
            content: `
                <h5>What is SQL Certification?</h5>
                <p>Validates your ability to manage, query, and manipulate databases using SQL.</p>
                 <h5>Why Choose SQL Certification?</h5>
                <ul>
                    <li>SQL is essential for database management and analytics</li>
                    <li>Applicable across all industries handling data</li>
                    <li>High demand for database professionals</li>
                    <li>Improves analytical and data management skills</li>
                </ul>
            `
        },
        prerequisites: {
            content: `
                <h5>Requirements</h5>
                <ul>
                    <li>Basic understanding of databases and data concepts</li>
                </ul>
            `
        },
        examDetails: {
            content: `
                <h5>Exam Format</h5>
                <ul>
                    <li>Multiple choice questions and practical SQL tasks</li>
                    <li>Duration: 1-2 hours</li>
                </ul>
            `
        },
        careerBenefits: {
            content: `
                <h5>Career Impact</h5>
                <ul>
                    <li>Roles: Database Developer, Data Analyst, SQL Developer</li>
                    <li>Average salary: $60,000 - $110,000</li>
                </ul>
            `
        },
        studyResources: {
            content: `
                <h5>Resources</h5>
                <ul>
                    <li>Official SQL documentation</li>
                    <li>Online courses and tutorials</li>
                    <li>Practice queries and projects</li>
                </ul>
            `
        }
    },

    snowflake: {
        title: 'Snowflake Certification Details',
        name: 'Snowflake',
        description: 'Cloud data platform certification for analytics and data warehousing.',
        duration: '2-4 months',
        cost: '$200-$400',
        validity: '2 years',
        icon: 'fas fa-cloud',
        overview: {
            content: `
                <h5>What is Snowflake Certification?</h5>
                <p>Validates your skills in using Snowflake for cloud data storage, analytics, and management.</p>
                <h5>Why Choose Snowflake?</h5>
                <ul>
                    <li>Snowflake is a leading cloud data platform</li>
                    <li>Enables scalable and secure data analytics</li>
                    <li>High demand in cloud-based data management roles</li>
                    <li>Supports integration with multiple BI tools</li>
                </ul>

            `
        },
        prerequisites: {
            content: `
                <h5>Requirements</h5>
                <ul>
                    <li>Basic SQL and database knowledge</li>
                    <li>Familiarity with cloud concepts recommended</li>
                </ul>
            `
        },
        examDetails: {
            content: `
                <h5>Exam Format</h5>
                <ul>
                    <li>Multiple choice and practical lab exercises</li>
                    <li>Duration: 2 hours</li>
                </ul>
            `
        },
        careerBenefits: {
            content: `
                <h5>Career Impact</h5>
                <ul>
                    <li>Roles: Snowflake Developer, Data Engineer</li>
                    <li>Average salary: $80,000 - $130,000</li>
                </ul>
            `
        },
        studyResources: {
            content: `
                <h5>Resources</h5>
                <ul>
                    <li>Snowflake official documentation</li>
                    <li>Practice labs and tutorials</li>
                    <li>Online courses and certifications</li>
                </ul>
            `
        }
    },

    spark: {
        title: 'Apache Spark Certification Details',
        name: 'Apache Spark',
        description: 'Big data processing and analytics certification.',
        duration: '2-4 months',
        cost: '$200-$400',
        validity: '2 years',
        icon: 'fas fa-chart-area',
        overview: {
            content: `
                <h5>What is Apache Spark Certification?</h5>
                <p>Validates your skills in big data processing, analytics, and distributed computing using Apache Spark.</p>
                <h5>Why Choose Apache Spark?</h5>
                <ul>
                    <li>Apache Spark is widely used in big data processing</li>
                    <li>Enables fast analytics on large datasets</li>
                    <li>High demand for Spark developers and data engineers</li>
                    <li>Supports integration with multiple data sources and analytics tools</li>
                </ul>
            `
        },
        prerequisites: {
            content: `
                <h5>Requirements</h5>
                <ul>
                    <li>Basic knowledge of programming and databases</li>
                    <li>Familiarity with distributed computing concepts recommended</li>
                </ul>
            `
        },
        examDetails: {
            content: `
                <h5>Exam Format</h5>
                <ul>
                    <li>Multiple choice and practical exercises</li>
                    <li>Duration: 2-3 hours</li>
                </ul>
            `
        },
        careerBenefits: {
            content: `
                <h5>Career Impact</h5>
                <ul>
                    <li>Roles: Data Engineer, Big Data Developer</li>
                    <li>Average salary: $80,000 - $140,000</li>
                </ul>
            `
        },
        studyResources: {
            content: `
                <h5>Resources</h5>
                <ul>
                    <li>Apache Spark official documentation</li>
                    <li>Online courses and labs</li>
                    <li>Hands-on big data projects</li>
                </ul>
            `
        }
    }
    };
    return certifications[certType];
}



function loadTabContent(certData) {
    // Load overview content
    document.getElementById('overviewContent').innerHTML = certData.overview.content;
    
    // Load prerequisites content
    document.getElementById('prerequisitesContent').innerHTML = certData.prerequisites.content;
    
    // Load exam details content
    document.getElementById('examDetailsContent').innerHTML = certData.examDetails.content;
    
    // Load career benefits content
    document.getElementById('careerBenefitsContent').innerHTML = certData.careerBenefits.content;
    
    // Load study resources content
    document.getElementById('studyResourcesContent').innerHTML = certData.studyResources.content;
}

// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
});

// Certification action functions
function enrollCertification() {
    alert('Enrollment functionality will be implemented soon!');
}

function downloadSyllabus() {
    alert('Syllabus download functionality will be implemented soon!');
}

function scheduleConsultation() {
    alert('Consultation scheduling functionality will be implemented soon!');
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('certDetailModal');
    if (event.target === modal) {
        closeCertDetail();
    }
});