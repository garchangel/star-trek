// ============================================
// STAR TREK: UNITY - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // Mobile Navigation Toggle
    // ============================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Update aria-expanded for accessibility
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav-container')) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close menu when clicking a link (for smooth scrolling on same page)
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
    
    // ============================================
    // Smooth Scrolling for Anchor Links
    // ============================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just '#' or if the target doesn't exist
            if (href === '#' || href.length === 1) return;
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                const navHeight = document.querySelector('.main-nav')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without triggering scroll
                history.pushState(null, null, href);
            }
        });
    });
    
    // ============================================
    // LCARS Tabs Functionality
    // ============================================
    const tabs = document.querySelectorAll('.lcars-tab');
    const tabContents = document.querySelectorAll('.lcars-tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetId = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    // ============================================
    // Active Navigation Highlighting
    // ============================================
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkPath = new URL(link.href).pathname;
            
            if (linkPath === currentPath || 
                (currentPath.includes(linkPath) && linkPath !== '/')) {
                link.classList.add('active');
            }
        });
    }
    
    setActiveNavLink();
    
    // ============================================
    // Scroll to Top Button (Optional)
    // ============================================
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ============================================
    // Character Sheet Calculator (for future use)
    // ============================================
    function calculateStatTotal(stats) {
        return Object.values(stats).reduce((sum, val) => sum + val, 0);
    }
    
    // ============================================
    // LCARS Animation Effects
    // ============================================
    const lcarsElements = document.querySelectorAll('.lcars-panel, .lcars-card');
    
    // Add intersection observer for fade-in effects
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
    
    lcarsElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ============================================
    // Print Functionality
    // ============================================
    const printButtons = document.querySelectorAll('.btn-print');
    
    printButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            window.print();
        });
    });
    
    // ============================================
    // Form Validation (for future character creator)
    // ============================================
    function validateForm(formElement) {
        const requiredFields = formElement.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        return isValid;
    }
    
    // ============================================
    // Cohesion/Pressure Tracker (for future interactive tools)
    // ============================================
    function updateCohesion(value, maxValue = 6) {
        const pips = document.querySelectorAll('.cohesion-pip');
        pips.forEach((pip, index) => {
            if (index < value) {
                pip.classList.add('active');
            } else {
                pip.classList.remove('active');
            }
        });
    }
    
    function updatePressure(value, maxValue = 9) {
        const segments = document.querySelectorAll('.pressure-segment');
        segments.forEach((segment, index) => {
            segment.classList.remove('active', 'alert');
            
            const segmentRange = segment.textContent.split('-').map(n => parseInt(n));
            if (segmentRange.length === 1) {
                // Single value segment (9)
                if (value >= parseInt(segmentRange[0])) {
                    segment.classList.add('alert');
                }
            } else {
                // Range segment (0-2, 3-5, 6-8)
                if (value >= segmentRange[0] && value <= segmentRange[1]) {
                    segment.classList.add('active');
                }
            }
        });
    }
    
    // ============================================
    // Expose useful functions globally for other scripts
    // ============================================
    window.StarTrekUnity = {
        calculateStatTotal,
        validateForm,
        updateCohesion,
        updatePressure
    };
    
    // ============================================
    // Console Easter Egg
    // ============================================
    console.log('%c⭐ STAR TREK: UNITY ⭐', 'color: #5C88DA; font-size: 24px; font-weight: bold;');
    console.log('%cA Powered by the Apocalypse RPG', 'color: #CC99CC; font-size: 14px;');
    console.log('%c"In the darkest times, we find what truly binds us together."', 'color: #FF9900; font-style: italic;');
    console.log('%cCreated by David | https://github.com/garchangel/star-trek', 'color: #666; font-size: 12px;');
});
