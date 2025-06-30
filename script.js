// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    html.classList.add('dark');
}

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    
    // Save theme preference
    const theme = html.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
});

// Mobile Menu Toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    
    // Toggle icon
    const icon = mobileMenuButton.querySelector('i');
    if (mobileMenu.classList.contains('hidden')) {
        icon.className = 'fas fa-bars';
    } else {
        icon.className = 'fas fa-times';
    }
});

// Close mobile menu when clicking on a link
const mobileMenuLinks = mobileMenu.querySelectorAll('a');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuButton.querySelector('i').className = 'fas fa-bars';
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active Navigation Highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightActiveNav() {
    let current = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('text-blue-600', 'dark:text-blue-400');
        link.classList.add('text-gray-700', 'dark:text-gray-300');
        
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.remove('text-gray-700', 'dark:text-gray-300');
            link.classList.add('text-blue-600', 'dark:text-blue-400');
        }
    });
}

// Navbar Background on Scroll
function handleNavbarScroll() {
    const navbar = document.querySelector('nav');
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-lg');
        navbar.classList.remove('bg-white/95', 'dark:bg-navy/95');
        navbar.classList.add('bg-white', 'dark:bg-navy');
    } else {
        navbar.classList.remove('shadow-lg');
        navbar.classList.remove('bg-white', 'dark:bg-navy');
        navbar.classList.add('bg-white/95', 'dark:bg-navy/95');
    }
}

// Scroll Event Listeners
window.addEventListener('scroll', () => {
    highlightActiveNav();
    handleNavbarScroll();
});

// Service Tile Click Handlers
function setupServiceTileHandlers() {
    const serviceTiles = document.querySelectorAll('.service-tile');
    
    serviceTiles.forEach(tile => {
        tile.addEventListener('click', function() {
            const serviceType = this.getAttribute('data-service');
            const serviceName = this.getAttribute('data-service-name');
            
            // Add visual feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Navigate to contact form and pre-fill
            navigateToContactWithService(serviceType, serviceName);
        });
        
        // Add keyboard accessibility
        tile.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Make focusable for accessibility
        tile.setAttribute('tabindex', '0');
        tile.setAttribute('role', 'button');
        tile.setAttribute('aria-label', `Request financing for ${tile.getAttribute('data-service-name')}`);
    });
}

// Navigate to contact form and pre-fill service type
function navigateToContactWithService(serviceType, serviceName) {
    // Scroll to contact section
    const contactSection = document.getElementById('contact');
    const headerOffset = 80;
    const elementPosition = contactSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });

    // Pre-fill the funding type dropdown after a short delay
    setTimeout(() => {
        const fundingTypeSelect = document.getElementById('funding-type');
        if (fundingTypeSelect) {
            fundingTypeSelect.value = serviceType;
            
            // Add visual highlight to show the form was pre-filled
            fundingTypeSelect.style.backgroundColor = '#dbeafe';
            fundingTypeSelect.style.borderColor = '#3b82f6';
            
            // Show notification
            showNotification(`Contact form pre-filled for ${serviceName}. Please complete the remaining fields.`, 'info');
            
            // Focus on the name field for better UX
            const nameField = document.getElementById('name');
            if (nameField) {
                nameField.focus();
            }
            
            // Remove highlight after 3 seconds
            setTimeout(() => {
                fundingTypeSelect.style.backgroundColor = '';
                fundingTypeSelect.style.borderColor = '';
            }, 3000);
        }
    }, 800); // Delay to allow scroll to complete
}

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        fundingType: formData.get('funding-type'),
        message: formData.get('message')
    };
    
    // Simulate form submission (replace with actual form handler)
    showNotification('Thank you for your inquiry! We will contact you within 24 hours.', 'success');
    
    // Reset form
    this.reset();
    
    // In a real implementation, you would send this data to your backend
    console.log('Form submitted:', data);
});

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Parallax Effect for Hero Section
function handleParallax() {
    const heroSection = document.getElementById('home');
    const scrolled = window.pageYOffset;
    const heroImg = heroSection.querySelector('img');
    
    if (heroImg && scrolled < heroSection.offsetHeight) {
        heroImg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
}

window.addEventListener('scroll', handleParallax);

// Loading Animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Intersection Observer for Counter Animation
const observerOptions = {
    threshold: 0.7,
    once: true
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
        }
    });
}, observerOptions);

// Observe all counter elements
document.querySelectorAll('[data-counter]').forEach(counter => {
    observer.observe(counter);
});

function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        const value = Math.floor(current);
        const originalText = element.textContent;
        element.textContent = originalText.replace(/\d+/, value);
    }, 16);
}

// Add counter data attributes to stats
document.addEventListener('DOMContentLoaded', () => {
    const statElements = document.querySelectorAll('.text-3xl.md\\:text-4xl.font-bold.text-blue-600');
    statElements.forEach(el => {
        el.setAttribute('data-counter', 'true');
    });
    
    // Setup service tile click handlers
    setupServiceTileHandlers();
});

// Smooth reveal animations for service cards
const serviceCards = document.querySelectorAll('.bg-gray-50.dark\\:bg-charcoal');
serviceCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

// Enhanced typing effect for hero tagline
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Apply typing effect to tagline when page loads
window.addEventListener('load', () => {
    const tagline = document.querySelector('[data-aos="fade-up"][data-aos-delay="200"]');
    if (tagline) {
        const originalText = tagline.textContent;
        setTimeout(() => {
            typeWriter(tagline, originalText, 50);
        }, 1000);
    }
});

// Add custom cursor effect for interactive elements
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// Enhanced form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        const value = input.value.trim();
        const errorElement = input.nextElementSibling;
        
        // Remove existing error styling
        input.classList.remove('border-red-500', 'focus:ring-red-500');
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.remove();
        }
        
        // Validate
        if (!value) {
            showFieldError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(value)) {
            showFieldError(input, 'Please enter a valid email address');
            isValid = false;
        }
    });
    
    return isValid;
}

function showFieldError(input, message) {
    input.classList.add('border-red-500', 'focus:ring-red-500');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message text-red-500 text-sm mt-1';
    errorElement.textContent = message;
    
    input.parentNode.insertBefore(errorElement, input.nextSibling);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Update form submission to include validation
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm(this)) {
        // Simulate loading state
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showNotification('Thank you for your inquiry! We will contact you within 24 hours.', 'success');
            this.reset();
            
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    }
});

// Add loading states and micro-interactions
document.querySelectorAll('button, .btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Performance optimization: throttle scroll events
function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

// Apply throttling to scroll events
window.removeEventListener('scroll', highlightActiveNav);
window.removeEventListener('scroll', handleNavbarScroll);
window.removeEventListener('scroll', handleParallax);

window.addEventListener('scroll', throttle(() => {
    highlightActiveNav();
    handleNavbarScroll();
    handleParallax();
}, 16));

console.log('US Commerce Credit website loaded successfully!'); 