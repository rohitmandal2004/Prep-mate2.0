// Home Page JavaScript for Authentication and Navigation

// Global variables
let currentModal = null;
let isAuthenticating = false;

// Backend API base URL (adjust if deployed)
const API_BASE_URL = (function() {
    // 1) If meta[name="api-base"] is set, prefer it (for production deployment)
    const meta = document.querySelector('meta[name="api-base"]');
    const metaUrl = meta && meta.getAttribute('content') ? meta.getAttribute('content').trim() : '';
    if (metaUrl) return metaUrl.replace(/\/$/, '');

    // 2) Local dev, file://, and LAN IPs → default to current host:5000
    const isFile = location.protocol === 'file:';
    const host = location.hostname || 'localhost';
    const isLocalLike = host === 'localhost' || host === '127.0.0.1' || /^(::1)$/.test(host) || isFile;
    const isPrivateIp = /^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(host);
    if (isLocalLike || isPrivateIp) return `http://${host}:5000`;

    // 3) Same-origin in production if backend is reverse-proxied under the same domain
    return '';
})();

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    checkExistingAuth();
    enhanceCustomCheckboxes();
});

// Initialize all event listeners
function initializeEventListeners() {
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Signup form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Password strength checker
    const signupPassword = document.getElementById('signupPassword');
    if (signupPassword) {
        signupPassword.addEventListener('input', checkPasswordStrength);
    }

    // Confirm password validation
    const confirmPassword = document.getElementById('signupConfirmPassword');
    if (confirmPassword) {
        confirmPassword.addEventListener('input', validatePasswordMatch);
    }

    // Modal close on outside click
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('auth-modal')) {
            closeAuthModal(currentModal);
        }
    });

    // Close modals on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && currentModal) {
            closeAuthModal(currentModal);
        }
    });
}

// Make custom checkboxes fully clickable and keyboard accessible
function enhanceCustomCheckboxes() {
    const labels = document.querySelectorAll('.checkbox-label');
    labels.forEach(label => {
        // Make label focusable for keyboard users
        if (!label.hasAttribute('tabindex')) label.setAttribute('tabindex', '0');

        const input = label.querySelector('input[type="checkbox"]');
        if (!input) return;

        // Toggle when clicking anywhere on the label except links
        label.addEventListener('click', function(e) {
            if (e.target.closest('a')) return; // let links work normally
            if (e.target === input) return; // native click
            input.checked = !input.checked;
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });

        // Space/Enter toggles checkbox when label is focused
        label.addEventListener('keydown', function(e) {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                input.checked = !input.checked;
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    });
}

// Check if user is already authenticated
function checkExistingAuth() {
    // Support persistent login across sessions/devices via localStorage
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    
    if (token && userData) {
        // User is already logged in, redirect to main app
        showNotification('Welcome back! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// Show login modal
function showLoginModal() {
    currentModal = 'loginModal';
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus on email input
        setTimeout(() => {
            const emailInput = document.getElementById('loginEmail');
            if (emailInput) emailInput.focus();
        }, 100);
    }
}

// Show signup modal
function showSignupModal() {
    currentModal = 'signupModal';
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus on first name input
        setTimeout(() => {
            const firstNameInput = document.getElementById('signupFirstName');
            if (firstNameInput) firstNameInput.focus();
        }, 100);
    }
}

// Close authentication modal
function closeAuthModal(modalId) {
    if (!modalId) return;
    
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        currentModal = null;
        
        // Clear form data
        clearForm(modalId);
    }
}

// Switch between login and signup modals
function switchToSignup() {
    closeAuthModal('loginModal');
    setTimeout(() => {
        showSignupModal();
    }, 300);
}

function switchToLogin() {
    closeAuthModal('signupModal');
    setTimeout(() => {
        showLoginModal();
    }, 300);
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    if (isAuthenticating) return;
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Basic validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    try {
        isAuthenticating = true;
        showLoadingOverlay(true);
        
        // Real API call
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (res.ok && data.token && data.user) {
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('authToken', data.token);
            storage.setItem('userData', JSON.stringify(data.user));
            
            // Close modal first
            closeAuthModal('loginModal');
            
            // Show notification
            showNotification('Login successful! Redirecting...', 'success');
            
            // Simple redirect after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
        } else {
            showNotification(data.message || 'Login failed. Please try again.', 'error');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showNotification('An error occurred. Please try again.', 'error');
    } finally {
        isAuthenticating = false;
        showLoadingOverlay(false);
    }
}

// Handle signup form submission
async function handleSignup(e) {
    e.preventDefault();
    
    if (isAuthenticating) return;
    
    const firstName = document.getElementById('signupFirstName').value.trim();
    const lastName = document.getElementById('signupLastName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    const newsletterSignup = document.getElementById('newsletterSignup').checked;
    
    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (password.length < 8) {
        showNotification('Password must be at least 8 characters long', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showNotification('Please agree to the Terms of Service and Privacy Policy', 'error');
        return;
    }
    
    try {
        isAuthenticating = true;
        showLoadingOverlay(true);
        
        // Real API call
        const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email, password, phone: undefined })
        });
        const data = await res.json().catch(() => ({ message: 'Unexpected response from server' }));
        
        if (res.ok && data.token && data.user) {
            // Persist signup session; use localStorage by default after signup
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));
            
            // Close modal first
            closeAuthModal('signupModal');
            
            // Show notification
            showNotification('Account created successfully! Redirecting...', 'success');
            
            // Simple redirect after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
        } else {
            // Handle duplicate email case from backend validation
            const duplicateEmail = (data.message && data.message.toLowerCase().includes('exists')) ||
                (Array.isArray(data.errors) && data.errors.some(err => String(err.msg || err.message || '').toLowerCase().includes('exists')));

            // Show first validation error if present
            if (Array.isArray(data.errors) && data.errors.length > 0) {
                const firstError = data.errors[0];
                showNotification(firstError.msg || firstError.message || data.message || 'Signup failed. Please check your inputs.', 'error');
            } else if (data.message) {
                showNotification(data.message, 'error');
            } else {
                showNotification('Signup failed. Please try again.', 'error');
            }

            // If email already exists, switch to login and prefill
            if (duplicateEmail) {
                setTimeout(() => {
                    switchToLogin();
                    const loginEmail = document.getElementById('loginEmail');
                    if (loginEmail) loginEmail.value = email;
                }, 600);
            }
        }
        
    } catch (error) {
        console.error('Signup error:', error);
        showNotification('Unable to reach the server. Ensure the backend is running on http://localhost:5000', 'error');
    } finally {
        isAuthenticating = false;
        showLoadingOverlay(false);
    }
}

// Check password strength
function checkPasswordStrength() {
    const password = document.getElementById('signupPassword').value;
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!strengthFill || !strengthText) return;
    
    let strength = 0;
    let strengthLabel = '';
    
    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Character variety checks
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    // Update UI
    strengthFill.className = 'strength-fill';
    
    if (strength <= 2) {
        strengthFill.classList.add('weak');
        strengthLabel = 'Weak';
    } else if (strength <= 4) {
        strengthFill.classList.add('fair');
        strengthLabel = 'Fair';
    } else if (strength <= 5) {
        strengthFill.classList.add('good');
        strengthLabel = 'Good';
    } else {
        strengthFill.classList.add('strong');
        strengthLabel = 'Strong';
    }
    
    strengthText.textContent = `Password strength: ${strengthLabel}`;
}

// Validate password match
function validatePasswordMatch() {
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (confirmPassword && password !== confirmPassword) {
        document.getElementById('signupConfirmPassword').setCustomValidity('Passwords do not match');
    } else {
        document.getElementById('signupConfirmPassword').setCustomValidity('');
    }
}

// Show/hide loading overlay
function showLoadingOverlay(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        if (show) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById(type === 'error' ? 'errorNotification' : 'successNotification');
    const messageElement = document.getElementById(type === 'error' ? 'errorMessage' : 'successMessage');
    
    if (notification && messageElement) {
        messageElement.textContent = message;
        notification.style.display = 'block';
        
        
        // Auto-hide after 8 seconds (longer for success with redirect)
        setTimeout(() => {
            notification.style.display = 'none';
        }, type === 'success' ? 8000 : 5000);
    }
}

// Clear form data
function clearForm(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            
            // Reset password strength indicator
            const strengthFill = document.getElementById('strengthFill');
            const strengthText = document.getElementById('strengthText');
            if (strengthFill && strengthText) {
                strengthFill.className = 'strength-fill';
                strengthText.textContent = 'Password strength';
            }
        }
    }
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Removed simulated auth; using real backend API

// Social authentication handlers (placeholder)
function handleGoogleAuth() {
    showNotification('Google authentication coming soon!', 'success');
}

function handleLinkedInAuth() {
    showNotification('LinkedIn authentication coming soon!', 'success');
}

// Add event listeners for social auth buttons
document.addEventListener('DOMContentLoaded', function() {
    const googleButtons = document.querySelectorAll('.btn-google');
    const linkedinButtons = document.querySelectorAll('.btn-linkedin');
    
    googleButtons.forEach(button => {
        button.addEventListener('click', handleGoogleAuth);
    });
    
    linkedinButtons.forEach(button => {
        button.addEventListener('click', handleLinkedInAuth);
    });
});

// Handle forgot password
function handleForgotPassword() {
    showNotification('Password reset functionality coming soon!', 'success');
}

// Add event listener for forgot password link
document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordLinks = document.querySelectorAll('.forgot-password');
    forgotPasswordLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            handleForgotPassword();
        });
    });
});

// Utility function to clear registered emails (for testing)
function clearRegisteredEmails() {
    localStorage.removeItem('registeredEmails');
    localStorage.removeItem('userDatabase');
    registeredEmails = [];
    userDatabase = {};
    console.log('Registered emails and user data cleared');
}


// Export functions for global access
window.showLoginModal = showLoginModal;
window.showSignupModal = showSignupModal;
window.closeAuthModal = closeAuthModal;
window.switchToSignup = switchToSignup;
window.switchToLogin = switchToLogin;
window.togglePassword = togglePassword;
window.clearRegisteredEmails = clearRegisteredEmails;
