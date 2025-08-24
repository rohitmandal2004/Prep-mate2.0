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
});

// Add loading animation for images and icons
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

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