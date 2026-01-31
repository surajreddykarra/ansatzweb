document.addEventListener('DOMContentLoaded', () => {
    // =============================================
    // MOBILE MENU TOGGLE
    // =============================================
    const menuToggle = document.getElementById('menu-toggle');
    const navItems = document.getElementById('nav-items');

    if (menuToggle && navItems) {
        menuToggle.addEventListener('click', () => {
            navItems.classList.toggle('active');
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !isExpanded);

            const icon = menuToggle.querySelector('i');
            if (navItems.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked
        document.querySelectorAll('#nav-items li a').forEach(link => {
            link.addEventListener('click', () => {
                if (navItems.classList.contains('active')) {
                    navItems.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // =============================================
    // SCROLL-TRIGGERED ANIMATIONS (Intersection Observer)
    // =============================================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.15
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class to trigger animation
                entry.target.classList.add('visible');
                // Optionally unobserve after animation (for performance)
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });

    // =============================================
    // NAVBAR SCROLL EFFECT
    // =============================================
    const nav = document.querySelector('nav');
    let lastScrollY = window.scrollY;

    const handleNavScroll = () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // =============================================
    // BACK TO TOP BUTTON
    // =============================================
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        const handleBackToTopVisibility = () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', handleBackToTopVisibility, { passive: true });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // =============================================
    // PARALLAX DOT MATRIX BACKGROUND
    // =============================================
    const dotMatrixBg = document.querySelector('.dot-matrix-bg');
    
    if (dotMatrixBg) {
        let ticking = false;

        const updateParallax = () => {
            const scrollY = window.scrollY;
            // Subtle parallax - move at 0.3x scroll speed
            const translateY = scrollY * 0.3;
            dotMatrixBg.style.transform = `translateY(${translateY}px)`;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    // =============================================
    // DYNAMIC DOT WAVE ANIMATION (SVG Enhancement)
    // =============================================
    const initDotWaveAnimation = () => {
        const svg = document.querySelector('.dot-matrix-bg svg');
        if (!svg) return;

        // Get viewport center for wave origin
        const updateDotAnimations = () => {
            const dots = svg.querySelectorAll('.dot');
            if (dots.length === 0) return;

            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            dots.forEach(dot => {
                const rect = dot.getBoundingClientRect();
                const dotX = rect.left + rect.width / 2;
                const dotY = rect.top + rect.height / 2;
                
                // Calculate distance from center
                const distance = Math.sqrt(
                    Math.pow(dotX - centerX, 2) + 
                    Math.pow(dotY - centerY, 2)
                );
                
                // Set animation delay based on distance (wave effect)
                const maxDistance = Math.sqrt(
                    Math.pow(window.innerWidth, 2) + 
                    Math.pow(window.innerHeight, 2)
                ) / 2;
                
                const delay = (distance / maxDistance) * 2; // 0-2 seconds
                dot.style.animationDelay = `${delay}s`;
            });
        };

        // Run once on load (pattern is static, so we just set initial delays)
        // For SVG pattern elements, we use CSS animation instead
    };

    // Initialize wave animation
    initDotWaveAnimation();

    // =============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // =============================================
    // FEATURE CARDS HOVER SOUND EFFECT (Optional)
    // =============================================
    // Subtle visual feedback already handled by CSS
    // Can add haptic feedback for mobile if needed

    // =============================================
    // PERFORMANCE: Reduce animations when tab is hidden
    // =============================================
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause expensive animations when tab is not visible
            if (dotMatrixBg) {
                dotMatrixBg.style.animationPlayState = 'paused';
            }
        } else {
            if (dotMatrixBg) {
                dotMatrixBg.style.animationPlayState = 'running';
            }
        }
    });
});