/* ==========================================
   PORTFOLIO JAVASCRIPT - Abdullah Kapadia
   Premium Edition with Micro-Animations
   ========================================== */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTypewriter();
    initScrollAnimations();
    initContactForm();
    initCustomCursor();
    initMagneticButtons();
    initCardTilt();
    initTextReveal();
    initScrollProgress();
    initBackToTop();
    hideLoader();
});

// Hide loader after page loads
function hideLoader() {
    const loader = document.getElementById('loader');
    // Show loader for 6 seconds to display the video
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 6000);
}

// ==========================================
// CUSTOM CURSOR
// ==========================================
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('cursor-dot');

    if (!cursor || !cursorDot) return;

    // Check if it's a touch device
    if ('ontouchstart' in window) {
        cursor.style.display = 'none';
        cursorDot.style.display = 'none';
        return;
    }

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Instant dot follow
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    // Smooth cursor follow
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect on interactive elements
    const hoverElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-item, .social-link, input, textarea');

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // Click effect
    document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
    document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));
}

// ==========================================
// MAGNETIC BUTTONS
// ==========================================
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.classList.add('magnetic');

        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

// ==========================================
// 3D CARD TILT EFFECT
// ==========================================
function initCardTilt() {
    const cards = document.querySelectorAll('.project-card, .education-card, .stat-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.setProperty('--tilt-x', `${-rotateX}deg`);
            card.style.setProperty('--tilt-y', `${rotateY}deg`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--tilt-x', '0deg');
            card.style.setProperty('--tilt-y', '0deg');
        });
    });
}

// ==========================================
// TEXT REVEAL ANIMATIONS
// ==========================================
function initTextReveal() {
    const revealElements = document.querySelectorAll('.hero-greeting, .hero-name, .hero-title, .hero-description, .hero-buttons, .hero-socials');

    revealElements.forEach((el, index) => {
        el.classList.add('reveal-text', `delay-${index + 1}`);
        el.classList.add('revealed');
    });

    // Section titles reveal
    const sectionTitles = document.querySelectorAll('.section-title');

    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.5 });

    sectionTitles.forEach(title => {
        // Wrap each word in a span
        const text = title.textContent;
        title.innerHTML = text.split(' ').map((word, i) =>
            `<span style="transition-delay: ${i * 0.1}s">${word}</span>`
        ).join(' ');

        titleObserver.observe(title);
    });
}

// ==========================================
// SCROLL PROGRESS BAR
// ==========================================
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    });
}

// ==========================================
// BACK TO TOP BUTTON
// ==========================================
function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '✓' : '✕'}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" aria-label="Close">✕</button>
    `;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    });

    // Auto remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// ==========================================
// CONFETTI CELEBRATION
// ==========================================
function createConfetti() {
    const colors = ['#1a73e8', '#4285f4', '#34a853', '#fbbc04', '#ea4335', '#60a5fa', '#a855f7'];
    const confettiCount = 150;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';

        // Random properties
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const duration = 2 + Math.random() * 2;
        const size = 5 + Math.random() * 10;
        const rotation = Math.random() * 360;

        confetti.style.cssText = `
            position: fixed;
            top: -20px;
            left: ${left}%;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            opacity: ${0.7 + Math.random() * 0.3};
            transform: rotate(${rotation}deg);
            animation: confettiFall ${duration}s ease-out ${delay}s forwards;
            pointer-events: none;
            z-index: 10001;
        `;

        document.body.appendChild(confetti);

        // Remove after animation
        setTimeout(() => confetti.remove(), (duration + delay) * 1000 + 100);
    }
}

// Add confetti animation CSS
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg) scale(0.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// ==========================================
// NAVIGATION
// ==========================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    const navLinks = document.querySelectorAll('.nav-link');

    // Theme Logic
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    // Create theme transition overlay
    let overlay = document.querySelector('.theme-transition-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'theme-transition-overlay';
        document.body.appendChild(overlay);
    }

    themeToggle.addEventListener('click', (e) => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        // Get toggle button position for the circle origin
        const rect = themeToggle.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // Calculate the size needed to cover the entire screen
        const maxDistance = Math.max(
            Math.hypot(x, y),
            Math.hypot(window.innerWidth - x, y),
            Math.hypot(x, window.innerHeight - y),
            Math.hypot(window.innerWidth - x, window.innerHeight - y)
        );
        const circleSize = maxDistance * 2.2;

        // Create the expanding circle
        const circle = document.createElement('div');
        circle.className = `theme-circle ${newTheme}`;
        circle.style.left = x + 'px';
        circle.style.top = y + 'px';
        circle.style.width = circleSize + 'px';
        circle.style.height = circleSize + 'px';

        overlay.appendChild(circle);

        // Trigger the expansion animation
        requestAnimationFrame(() => {
            circle.classList.add('expanding');
        });

        // Apply the theme after the circle has expanded halfway
        setTimeout(() => {
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        }, 400);

        // Remove the circle after animation completes
        setTimeout(() => {
            circle.remove();
        }, 900);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }

    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    });
}

// ==========================================
// TYPEWRITER EFFECT
// ==========================================
function initTypewriter() {
    const typewriter = document.getElementById('typewriter');
    const roles = [
        'Python Developer',
        'Web Developer',
        'Django Developer',
        'Flutter Developer',
        'Tech Enthusiast'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typewriter.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typewriter.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll(
        '.stat-card, .skill-category, .timeline-item, .project-card, .education-card, .contact-card'
    );

    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });

    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// ==========================================
// CONTACT FORM
// ==========================================
function initContactForm() {
    const form = document.getElementById('contact-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Create mailto link
        const subject = `Portfolio Contact from ${name}`;
        const bodyContent = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
        const mailtoLink = `mailto:akapadia975@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyContent)}`;

        // Show toast notification
        showToast('Opening email client... Thanks for reaching out! 🚀', 'success');

        // 🎆 Trigger confetti celebration!
        createConfetti();

        // Show button feedback
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Opening Email Client...';
        btn.disabled = true;

        // Open mail client
        window.location.href = mailtoLink;

        // Reset button after a delay
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
            form.reset();
        }, 2000);
    });
}

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 70;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// PARALLAX EFFECT FOR HERO
// ==========================================
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        hero.style.backgroundPositionY = `${rate}px`;
    }
});

// ==========================================
// ROTATING FOOTER
// ==========================================
const footerText = document.getElementById('dynamic-footer');
if (footerText) {
    const footerMessages = [
        "© 2026 Abdullah Kapadia",
        "No bugs, just happy accidents 🐞",
        "Made with 💻, ☕, and a lot of key clacking",
        "System.out.println('Hire Me!'); 🚀",
        "Sent from my IDE 🤖"
    ];

    let footerIndex = 0;
    setInterval(() => {
        footerText.style.opacity = '0';
        setTimeout(() => {
            footerIndex = (footerIndex + 1) % footerMessages.length;
            footerText.innerHTML = footerMessages[footerIndex];
            footerText.style.opacity = '1';
        }, 500);
    }, 4000);
}

console.log('🚀 Portfolio loaded with premium features!');
