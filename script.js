// ==========================================
// Theme Management (Dark / Light Mode)
// ==========================================
const themeToggle = document.getElementById('themeToggle');

function checkThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// Initialize theme on load
checkThemePreference();

themeToggle?.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});


// ==========================================
// Mobile Navigation Drawer
// ==========================================
const mobileMenuButton = document.getElementById('mobileMenuButton');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuButton?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('hidden');
});

// Close mobile menu when clicking any navigation link
document.querySelectorAll('.nav-link-mobile').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu?.classList.add('hidden');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenuButton?.contains(e.target) && !mobileMenu?.contains(e.target)) {
        mobileMenu?.classList.add('hidden');
    }
});


// ==========================================
// Smooth Scrolling with Offset
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            const navHeight = document.querySelector('nav')?.offsetHeight || 80;
            const targetPosition = targetElement.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});


// ==========================================
// Mouse Spotlight Tracking Effect
// ==========================================
function initSpotlightCards() {
    const spotlightCards = document.querySelectorAll('.card-spotlight');

    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

initSpotlightCards();


// ==========================================
// Contact Form Submission Handling
// ==========================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton?.innerHTML || 'Send Message';

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending Message...`;
    }

    try {
        // Simulate async submission (Ready to swap with Formspree endpoint)
        await new Promise(resolve => setTimeout(resolve, 1200));

        if (formStatus) {
            formStatus.innerHTML = `<div class="p-4 bg-green-50 dark:bg-green-950/80 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-sm">
                <i class="fas fa-check-circle"></i> Message sent successfully! I will get back to you soon.
            </div>`;
            formStatus.classList.remove('hidden');
        }

        contactForm.reset();

        setTimeout(() => {
            if (formStatus) formStatus.classList.add('hidden');
        }, 6000);

    } catch (error) {
        if (formStatus) {
            formStatus.innerHTML = `<div class="p-4 bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-sm">
                <i class="fas fa-exclamation-triangle"></i> Failed to send message. Please email me directly at anujaawchar@gmail.com.
            </div>`;
            formStatus.classList.remove('hidden');
        }
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    }
});


// ==========================================
// Scroll Observers & Animations
// ==========================================

// Skill Bars Width Animation
const skillSection = document.getElementById('skills');
const skillBars = document.querySelectorAll('.skill-bar');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            skillBars.forEach(bar => {
                const targetWidth = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 150);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.25 });

if (skillSection) {
    skillObserver.observe(skillSection);
}

// Scroll Fade-In Elements
const fadeElements = document.querySelectorAll('.skill-card, .project-card, .timeline-connector');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('animate-fade-in-up');
                fadeObserver.unobserve(entry.target);
            }, (index % 4) * 100);
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(el => fadeObserver.observe(el));

// Image Lazy Loading with Shimmer
const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || '';
            img.onload = () => {
                img.classList.remove('image-loading');
            };
            imageObserver.unobserve(img);
        }
    });
}, { rootMargin: '50px' });

images.forEach(img => imageObserver.observe(img));


// ==========================================
// Project Carousel & Filtering Logic
// ==========================================
const sliderTrack = document.getElementById('projectsSliderTrack');
const prevBtn = document.getElementById('prevProjectBtn');
const nextBtn = document.getElementById('nextProjectBtn');
const prevBtnMobile = document.getElementById('prevProjectBtnMobile');
const nextBtnMobile = document.getElementById('nextProjectBtnMobile');
const projectFilters = document.querySelectorAll('.project-filter');
const projectCards = document.querySelectorAll('#projectsSliderTrack .project-card');

let currentSlide = 0;
let cardsPerPage = 3;
let touchStartX = 0;
let touchEndX = 0;

function calculateCardsPerPage() {
    if (window.innerWidth < 768) {
        cardsPerPage = 1;
    } else if (window.innerWidth < 1024) {
        cardsPerPage = 2;
    } else {
        cardsPerPage = 3;
    }
}

function getVisibleCards() {
    return Array.from(projectCards).filter(card => !card.classList.contains('filter-hidden'));
}

function updateCarousel(animate = true) {
    if (!sliderTrack) return;

    const visibleCards = getVisibleCards();
    const maxSlide = Math.max(0, visibleCards.length - cardsPerPage);

    if (currentSlide > maxSlide) currentSlide = maxSlide;
    if (currentSlide < 0) currentSlide = 0;

    if (visibleCards.length === 0) {
        sliderTrack.style.transform = `translateX(0px)`;
        return;
    }

    const targetCard = visibleCards[currentSlide];
    if (targetCard) {
        if (!animate) sliderTrack.style.transition = 'none';
        else sliderTrack.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';

        const offset = targetCard.offsetLeft;
        sliderTrack.style.transform = `translateX(-${offset}px)`;
    }

    // Update button states
    const isAtStart = currentSlide === 0;
    const isAtEnd = currentSlide >= maxSlide || visibleCards.length <= cardsPerPage;

    if (prevBtn) prevBtn.style.opacity = isAtStart ? '0.35' : '1';
    if (nextBtn) nextBtn.style.opacity = isAtEnd ? '0.35' : '1';
    if (prevBtnMobile) prevBtnMobile.style.opacity = isAtStart ? '0.35' : '1';
    if (nextBtnMobile) nextBtnMobile.style.opacity = isAtEnd ? '0.35' : '1';
}

function navigatePrev() {
    const visibleCards = getVisibleCards();
    if (currentSlide > 0) {
        currentSlide--;
        updateCarousel();
    }
}

function navigateNext() {
    const visibleCards = getVisibleCards();
    const maxSlide = Math.max(0, visibleCards.length - cardsPerPage);
    if (currentSlide < maxSlide) {
        currentSlide++;
        updateCarousel();
    }
}

// Button click listeners
prevBtn?.addEventListener('click', navigatePrev);
nextBtn?.addEventListener('click', navigateNext);
prevBtnMobile?.addEventListener('click', navigatePrev);
nextBtnMobile?.addEventListener('click', navigateNext);

// Filter click logic with smooth transitions
projectFilters.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter') || 'all';

        projectFilters.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        projectCards.forEach(card => {
            const techAttr = card.getAttribute('data-tech') || '';
            const techs = techAttr.split(',').map(t => t.trim().toLowerCase());

            if (filter === 'all' || techs.includes(filter.toLowerCase())) {
                card.classList.remove('filter-hidden');
            } else {
                card.classList.add('filter-hidden');
            }
        });

        currentSlide = 0;
        setTimeout(() => {
            updateCarousel(true);
        }, 50);
    });
});

// Touch Swipe Gestures
const carouselContainer = document.getElementById('projectsCarouselContainer');

carouselContainer?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

carouselContainer?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 45;
    if (touchStartX - touchEndX > swipeThreshold) {
        navigateNext();
    } else if (touchEndX - touchStartX > swipeThreshold) {
        navigatePrev();
    }
}

// Keyboard Navigation for Carousel
document.addEventListener('keydown', (e) => {
    const projectsSection = document.getElementById('projects');
    if (!projectsSection) return;

    const rect = projectsSection.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;

    if (isInView) {
        if (e.key === 'ArrowLeft') {
            navigatePrev();
        } else if (e.key === 'ArrowRight') {
            navigateNext();
        }
    }
});

// Handle Window Resize
window.addEventListener('resize', debounce(() => {
    calculateCardsPerPage();
    updateCarousel(false);
}, 150));

// Initial calculation on load
calculateCardsPerPage();
setTimeout(() => updateCarousel(false), 200);


// ==========================================
// Back to Top Button
// ==========================================
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', debounce(() => {
    if (window.scrollY > 350) {
        backToTopBtn?.classList.add('show');
    } else {
        backToTopBtn?.classList.remove('show');
    }
}, 50));

backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});


// ==========================================
// Active Navigation Link Highlighter
// ==========================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const activeNavObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === `#${currentId}`) {
                    link.classList.add('text-primary');
                    link.classList.remove('text-gray-700', 'dark:text-gray-300');
                } else {
                    link.classList.remove('text-primary');
                }
            });
        }
    });
}, { threshold: 0.35 });

sections.forEach(section => activeNavObserver.observe(section));


// ==========================================
// Utility Functions
// ==========================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
