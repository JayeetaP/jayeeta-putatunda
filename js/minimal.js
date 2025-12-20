// ===== MINIMAL JAVASCRIPT FOR ESSENTIAL FUNCTIONALITY =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize only essential components
    initNavigation();
    initContactForm();
    initYearFiltering();
    initYearCollapsible();
    initYouTubeThumbnails();
    initTestimonialsTicker();
});

// ===== NAVIGATION FUNCTIONALITY =====
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');
    
    // Scroll effect for navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle (if hamburger exists)
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close mobile menu when clicking on links
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navbar.contains(event.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
    
    // Active nav link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinksItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
    
    // Smooth scrolling for navigation links
    navLinksItems.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== CONTACT FORM FUNCTIONALITY =====
function initContactForm() {
    const contactForm = document.querySelector('form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            // Basic validation
            if (validateForm(data)) {
                // Show success message
                showNotification('Thank you! Your message has been received.', 'success');
                contactForm.reset();
            }
        });
    }
}

// ===== FORM VALIDATION =====
function validateForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.subject) {
        errors.push('Please select a subject');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('\n'), 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== SIMPLE NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; font-size: 1rem;">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        white-space: pre-line;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// ===== YEAR FILTERING FUNCTIONALITY =====
function initYearFiltering() {
    const yearButtons = document.querySelectorAll('.year-nav-btn');
    const yearSections = document.querySelectorAll('.year-section');
    
    if (yearButtons.length === 0 || yearSections.length === 0) return;
    
    // Initialize default view - show only 2025
    const defaultYear = '2025';
    yearSections.forEach(section => {
        const sectionYear = section.getAttribute('data-year');
        const isCollapsible = section.classList.contains('year-section-collapsible');
        
        if (sectionYear === defaultYear) {
            // Show 2025 section
            section.style.display = 'block';
        } else {
            // Hide all other sections
            section.style.display = 'none';
            if (isCollapsible) {
                section.classList.remove('expanded');
            }
        }
    });
    
    // Set 2025 button as active if no button is already active
    const activeButton = document.querySelector('.year-nav-btn.active');
    if (!activeButton || activeButton.getAttribute('data-year') === 'all') {
        yearButtons.forEach(btn => btn.classList.remove('active'));
        const defaultButton = document.querySelector(`.year-nav-btn[data-year="${defaultYear}"]`);
        if (defaultButton) {
            defaultButton.classList.add('active');
        }
    }
    
    yearButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetYear = this.getAttribute('data-year');
            
            // Update active button
            yearButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide year sections
            yearSections.forEach(section => {
                const isCollapsible = section.classList.contains('year-section-collapsible');
                
                if (targetYear === 'all') {
                    // Show all sections
                    if (isCollapsible) {
                        // For collapsible sections, show them expanded
                        section.style.display = 'block';
                        section.classList.add('expanded');
                    } else {
                        // 2025 section - always show
                        section.style.display = 'block';
                    }
                } else {
                    const sectionYear = section.getAttribute('data-year');
                    if (sectionYear === targetYear) {
                        // Show the selected year
                        section.style.display = 'block';
                        if (isCollapsible) {
                            section.classList.add('expanded');
                        }
                    } else {
                        // Hide other years
                        section.style.display = 'none';
                        if (isCollapsible) {
                            section.classList.remove('expanded');
                        }
                    }
                }
            });
        });
    });
}

// ===== COLLAPSIBLE YEAR SECTIONS =====
function initYearCollapsible() {
    const collapsibleHeaders = document.querySelectorAll('.year-header-clickable');
    
    collapsibleHeaders.forEach(header => {
        header.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const section = this.closest('.year-section-collapsible');
            if (!section) return;
            
            // Check current state - look at both class and computed style
            const isCurrentlyVisible = section.style.display === 'block' || 
                                      window.getComputedStyle(section).display !== 'none';
            const hasExpandedClass = section.classList.contains('expanded');
            
            if (isCurrentlyVisible && hasExpandedClass) {
                // Collapse - hide the section
                section.classList.remove('expanded');
                section.style.display = 'none';
            } else {
                // Expand - show the section
                section.classList.add('expanded');
                section.style.display = 'block';
            }
        });
    });
}

// ===== YOUTUBE THUMBNAIL INITIALIZATION =====
// Automatically swap logo images for YouTube thumbnails when a data-youtube-id is provided
function initYouTubeThumbnails() {
    const youtubeItems = document.querySelectorAll('[data-youtube-id]');
    
    if (!youtubeItems.length) return;
    
    youtubeItems.forEach(item => {
        const videoId = item.getAttribute('data-youtube-id');
        if (!videoId) return;
        
        const img = item.querySelector('img');
        if (!img) return;
        
        const maxRes = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        const highRes = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        
        // Try max resolution first, fall back to high quality if not available
        img.src = maxRes;
        img.onerror = function() {
            img.onerror = null;
            img.src = highRes;
        };
    });
}

// ===== TESTIMONIALS TICKER =====
// Auto-rotate testimonials every 5 seconds with dot navigation
function initTestimonialsTicker() {
    const carousel = document.querySelector('.testimonials-carousel');
    const dotsContainer = document.querySelector('.testimonial-dots');
    if (!carousel || !dotsContainer) return;
    
    const cards = carousel.querySelectorAll('.testimonial-card');
    if (cards.length <= 1) return;
    
    let currentIndex = 0;
    let autoRotateInterval;
    
    // Create dots
    cards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'testimonial-dot' + (index === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
        dot.addEventListener('click', () => goToCard(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = dotsContainer.querySelectorAll('.testimonial-dot');
    
    function goToCard(index) {
        // Hide current card
        cards[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');
        
        // Update index
        currentIndex = index;
        
        // Show new card
        cards[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
        
        // Reset timer
        resetAutoRotate();
    }
    
    function nextCard() {
        const nextIndex = (currentIndex + 1) % cards.length;
        goToCard(nextIndex);
    }
    
    function startAutoRotate() {
        autoRotateInterval = setInterval(nextCard, 5000);
    }
    
    function stopAutoRotate() {
        clearInterval(autoRotateInterval);
    }
    
    function resetAutoRotate() {
        stopAutoRotate();
        startAutoRotate();
    }
    
    // Start auto-rotation
    startAutoRotate();
    
    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoRotate);
    carousel.addEventListener('mouseleave', startAutoRotate);
}
