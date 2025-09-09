# Prepmate Home Page

## Overview
The home page (`home.html`) serves as the entry point for the Prepmate application, featuring a beautiful landing page with authentication functionality.

## Features

### 🎨 Modern Design
- Gradient background with floating animations
- Responsive design that works on all devices
- Smooth animations and transitions
- Professional color scheme

### 🔐 Authentication System
- **Login Modal**: Email and password authentication
- **Signup Modal**: Complete registration form with validation
- **Password Strength Indicator**: Real-time password strength checking
- **Form Validation**: Client-side validation for all inputs
- **Remember Me**: Option to store login credentials
- **Social Auth Placeholders**: Ready for Google and LinkedIn integration

### 🚀 User Experience
- **Auto-redirect**: Automatically redirects to main app after successful authentication
- **Loading States**: Visual feedback during authentication
- **Notifications**: Success and error messages
- **Keyboard Navigation**: Full keyboard support
- **Accessibility**: Screen reader friendly

## File Structure

```
frontend/
├── home.html          # Main home page
├── home-styles.css    # Dedicated styling
├── home-script.js     # Authentication logic
├── index.html         # Main application (redirects here after login)
├── styles.css         # Main app styling
└── script.js          # Main app functionality
```

## How to Use

### 1. Access the Home Page
Open `home.html` in your browser to see the landing page.

### 2. Login Process
1. Click the "Login" button
2. Enter your email and password
3. Optionally check "Remember me"
4. Click "Login" to authenticate
5. You'll be redirected to `index.html` upon success

### 3. Signup Process
1. Click the "Sign Up" button
2. Fill in all required fields:
   - First Name
   - Last Name
   - Email
   - Password (with strength indicator)
   - Confirm Password
3. Agree to Terms of Service
4. Click "Create Account"
5. You'll be redirected to `index.html` upon success

## Authentication Flow

### Demo Mode
Currently, the authentication is in demo mode:
- Any valid email and password will work
- Authentication data is stored in localStorage/sessionStorage
- No actual API calls are made

### Production Integration
To integrate with a real backend:

1. **Update API Endpoints** in `home-script.js`:
   ```javascript
   // Replace simulateLoginAPI with actual API call
   const response = await fetch('/api/auth/login', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email, password })
   });
   ```

2. **Update Signup API**:
   ```javascript
   // Replace simulateSignupAPI with actual API call
   const response = await fetch('/api/auth/signup', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(userData)
   });
   ```

## Styling Customization

### Color Scheme
The color scheme is defined in CSS variables in `home-styles.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #3b82f6;
    --accent-color: #8b5cf6;
    /* ... more variables */
}
```

### Responsive Breakpoints
- Mobile: 480px and below
- Tablet: 768px and below
- Desktop: 769px and above

## Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Security Features
- Password strength validation
- Form input sanitization
- XSS protection through proper escaping
- Secure token storage
- CSRF protection ready

## Future Enhancements
- [ ] Real API integration
- [ ] Social authentication (Google, LinkedIn)
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Remember device functionality
- [ ] Analytics integration

## Troubleshooting

### Common Issues

1. **Modal not opening**: Check if JavaScript is enabled
2. **Form not submitting**: Verify all required fields are filled
3. **Redirect not working**: Check if `index.html` exists in the same directory
4. **Styling issues**: Ensure `home-styles.css` is properly linked

### Browser Console
Check the browser console for any JavaScript errors that might affect functionality.

## Support
For issues or questions, please check the browser console for error messages and ensure all files are properly linked.

