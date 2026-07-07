/* ========================================
   THULIR ORGANICS - MAIN JAVASCRIPT FILE
   Interactive Features & Functionality
   ======================================== */

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initializeAOS();
    initializeNavigation();
    initializeScrollButtons();
    initializeFormHandling();
    initializeCounterAnimation();
    initializeNewsletterSubscription();
    hideLoadingAnimation();
    
    // Set active nav link
    updateActiveNavLink();
});

/* ========================================
   1. LOADING ANIMATION
   ======================================== */

function hideLoadingAnimation() {
    const loading = document.getElementById('loading');
    if (loading) {
        setTimeout(() => {
            loading.classList.add('hidden');
        }, 500);
    }
}

/* ========================================
   2. AOS ANIMATION INITIALIZATION
   ======================================== */

function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            disable: false
        });
    }
}

/* ========================================
   3. NAVIGATION HANDLING
   ======================================== */

function initializeNavigation() {
    const navbar = document.querySelector('.navbar-custom');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    // Handle scroll to add shadow to navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Close mobile menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const element = document.querySelector(href);
                const offset = 80; // navbar height
                const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: top,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   4. UPDATE ACTIVE NAV LINK
   ======================================== */

function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/* ========================================
   5. SCROLL TO TOP BUTTON
   ======================================== */

function initializeScrollButtons() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    if (scrollTopBtn) {
        // Show/hide scroll to top button
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });

        // Scroll to top on button click
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/* ========================================
   6. FORM HANDLING
   ======================================== */

function initializeFormHandling() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Validate form
            if (!name || !phone || !subject || !message) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }

            // Validate phone
            if (!isValidPhone(phone)) {
                showFormMessage('Please enter a valid phone number.', 'error');
                return;
            }

            // Prepare WhatsApp message
            const whatsappMessage = encodeURIComponent(
                `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`
            );

            // Send via WhatsApp
            const whatsappUrl = `https://wa.me/919176069176?text=${whatsappMessage}`;
            window.open(whatsappUrl, '_blank');

            // Show success message
            showFormMessage('Your message has been sent! We will contact you shortly.', 'success');

            // Reset form
            contactForm.reset();

            // Reset message after 3 seconds
            setTimeout(() => {
                document.getElementById('formMessage').innerHTML = '';
            }, 3000);
        });
    }
}

/* ========================================
   7. FORM MESSAGE DISPLAY
   ======================================== */

function showFormMessage(message, type) {
    const messageDiv = document.getElementById('formMessage');
    if (messageDiv) {
        const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
        messageDiv.innerHTML = `<div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    }
}

/* ========================================
   8. PHONE VALIDATION
   ======================================== */

function isValidPhone(phone) {
    // Allow various phone formats
    const phoneRegex = /^[0-9\s\-\+\(\)]{7,}$/;
    return phoneRegex.test(phone);
}

/* ========================================
   9. COUNTER ANIMATION
   ======================================== */

function initializeCounterAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');

    if (statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const target = parseInt(element.getAttribute('data-target'));
                    animateCounter(element, target);
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }
}

function animateCounter(element, target) {
    let current = 0;
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/* ========================================
   10. NEWSLETTER SUBSCRIPTION
   ======================================== */

function initializeNewsletterSubscription() {
    const newsletterBtn = document.getElementById('newsletter-btn');
    const newsletterEmail = document.getElementById('newsletter-email');

    if (newsletterBtn && newsletterEmail) {
        newsletterBtn.addEventListener('click', function() {
            const email = newsletterEmail.value.trim();

            if (!email) {
                showAlert('Please enter your email address.', 'warning');
                return;
            }

            if (!isValidEmail(email)) {
                showAlert('Please enter a valid email address.', 'error');
                return;
            }

            // Show success message
            showAlert('Thank you for subscribing! Check your email for confirmation.', 'success');

            // Reset input
            newsletterEmail.value = '';

            // Reset message after 3 seconds
            setTimeout(() => {
                const alertDiv = document.querySelector('.newsletter-alert');
                if (alertDiv) {
                    alertDiv.remove();
                }
            }, 3000);
        });

        // Allow Enter key submission
        newsletterEmail.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                newsletterBtn.click();
            }
        });
    }
}

/* ========================================
   11. EMAIL VALIDATION
   ======================================== */

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/* ========================================
   12. ALERT DISPLAY (Newsletter)
   ======================================== */

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    const alertClass = type === 'success' ? 'alert-success' : type === 'error' ? 'alert-danger' : 'alert-warning';
    
    alertDiv.className = `alert ${alertClass} alert-dismissible fade show newsletter-alert`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    const container = document.querySelector('.footer-section');
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);
    }
}

/* ========================================
   13. IMAGE LAZY LOADING
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
});

/* ========================================
   14. PRODUCT FILTER (Future Enhancement)
   ======================================== */

function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        if (category === 'all' || product.getAttribute('data-category') === category) {
            product.style.display = 'block';
            product.classList.add('animate__animated', 'animate__fadeIn');
        } else {
            product.style.display = 'none';
        }
    });
}

/* ========================================
   15. ACCESSIBILITY ENHANCEMENTS
   ======================================== */

// Skip to main content link
function initializeSkipLink() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const mainContent = document.querySelector('main') || document.querySelector('.container');
            mainContent.focus();
        });
    }
}

/* ========================================
   16. FORM AUTO-CLEAR
   ======================================== */

function clearFormOnSuccess(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}

/* ========================================
   17. DYNAMIC YEAR IN FOOTER
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    const yearSpans = document.querySelectorAll('.year');
    const currentYear = new Date().getFullYear();
    
    yearSpans.forEach(span => {
        span.textContent = currentYear;
    });
});

/* ========================================
   18. DETECT ONLINE STATUS
   ======================================== */

window.addEventListener('online', function() {
    console.log('Connection restored!');
    // Show notification if needed
});

window.addEventListener('offline', function() {
    console.log('Connection lost!');
    // Show offline notification
});

/* ========================================
   19. SMOOTH SCROLL ANCHOR LINKS
   ======================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const element = document.querySelector(href);
        if (element) {
            e.preventDefault();
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ========================================
   20. PERFORMANCE MONITORING
   ======================================== */

// Log page load performance
window.addEventListener('load', function() {
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Page load time: ' + pageLoadTime + 'ms');
    }
});

/* ========================================
   21. ERROR HANDLING
   ======================================== */

window.addEventListener('error', function(event) {
    console.error('Error:', event.error);
    // Send error to logging service if available
});

/* ========================================
   22. DARK MODE TOGGLE (Optional)
   ======================================== */

function initializeDarkModeToggle() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.documentElement.style.colorScheme = 
                document.documentElement.style.colorScheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', document.documentElement.style.colorScheme);
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.style.colorScheme = savedTheme;
    }
}

/* ========================================
   23. PRINT PAGE FUNCTIONALITY
   ======================================== */

function printPage() {
    window.print();
}

/* ========================================
   24. SHARE PAGE FUNCTIONALITY
   ======================================== */

function shareOnSocial(platform) {
    const url = window.location.href;
    const title = document.title;
    let shareUrl = '';

    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

/* ========================================
   25. UTILITY FUNCTIONS
   ======================================== */

// Debounce function for performance
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ========================================
   26. RANDOM DATA GENERATOR (Testing)
   ======================================== */

function getRandomTestimonials() {
    const testimonials = [
        {
            name: "Rajesh Kumar",
            title: "Farmer, Tamil Nadu",
            text: "Thulir Organics has transformed my farm. Quality improved significantly!"
        },
        {
            name: "Priya Sharma",
            title: "Agriculture Consultant",
            text: "The best organic products I've worked with. Highly recommended!"
        },
        {
            name: "Vikram Patel",
            title: "Farm Manager",
            text: "Excellent service and quality. Delivery is always on time!"
        }
    ];
    return testimonials[Math.floor(Math.random() * testimonials.length)];
}

/* ========================================
   27. EXPORT FOR EXTERNAL USE
   ======================================== */

// Make functions available globally if needed
window.ThulirOrganics = {
    filterProducts,
    shareOnSocial,
    printPage,
    initializeDarkModeToggle,
    debounce,
    throttle
};

/* ========================================
   28. LOG INITIALIZATION
   ======================================== */

console.log('Thulir Organics Website Initialized Successfully');
console.log('Version: 1.0.0');
console.log('Premium Organic Farming Solutions');
