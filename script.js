// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');

// Set initial theme
if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
}

themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
});

// Mobile Menu
const mobileMenuButton = document.getElementById('mobileMenuButton');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
    }
});

// Close mobile menu when clicking on a link
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Smooth scrolling for navigation links
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

// Contact form handling
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Simulate form submission (replace with real integration)
    formStatus.textContent = 'Sending message...';
    formStatus.className = 'mt-4 text-center text-blue-600';
    formStatus.classList.remove('hidden');

    setTimeout(() => {
        formStatus.textContent = 'Message sent successfully! I\'ll get back to you soon.';
        formStatus.className = 'mt-4 text-center text-green-600';
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            formStatus.classList.add('hidden');
        }, 5000);
    }, 2000);
});

// Animate skill bars on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBars = entry.target.querySelectorAll('.skill-bar');
            skillBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
        }
    });
}, observerOptions);

// Observe skills section
const skillsSection = document.getElementById('skills');
if (skillsSection) {
    observer.observe(skillsSection);
}

// Add scroll animations
const scrollElements = document.querySelectorAll('.animate-fade-in-up, .skill-card, .project-card');
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            scrollObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Set initial state for animated elements
scrollElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    scrollObserver.observe(el);
});

// Project Filtering
const projectFilters = document.querySelectorAll('.project-filter');
const projectCards = document.querySelectorAll('.project-card');

projectFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        const filterValue = filter.getAttribute('data-filter');
        
        // Update active filter button
        projectFilters.forEach(btn => {
            btn.classList.remove('bg-gradient-to-r', 'from-primary', 'to-purple-600', 'text-white');
            btn.classList.add('bg-gray-100', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300');
        });
        filter.classList.add('bg-gradient-to-r', 'from-primary', 'to-purple-600', 'text-white');
        filter.classList.remove('bg-gray-100', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300');
        
        // Filter projects with animation
        projectCards.forEach(card => {
            const tech = card.getAttribute('data-tech');
            if (filterValue === 'all' || tech.includes(filterValue)) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Back to Top Button
const backToTopButton = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.remove('opacity-0', 'invisible');
        backToTopButton.classList.add('opacity-100', 'visible');
    } else {
        backToTopButton.classList.remove('opacity-100', 'visible');
        backToTopButton.classList.add('opacity-0', 'invisible');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Lazy loading for images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('image-loading');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => {
    imageObserver.observe(img);
});

// Navbar background on scroll
const navbar = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-md');
        navbar.classList.remove('shadow-sm');
    } else {
        navbar.classList.remove('shadow-md');
        navbar.classList.add('shadow-sm');
    }
});

// Add parallax effect to hero elements
const heroSection = document.getElementById('home');
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    const heroElements = heroSection.querySelectorAll('.animate-float, .absolute');
    heroElements.forEach(el => {
        if (!el.closest('.relative')) {
            el.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
    });
});

// Intersection Observer for sections
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('text-primary');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('text-primary');
                }
            });
        }
    });
}, { threshold: 0.3 });

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Smooth reveal on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class to body
    document.body.classList.add('loaded');
    
    // Animate hero section
    const heroContent = document.querySelector('#home > div');
    if (heroContent) {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }
});

// Console welcome message
console.log('%c👋 Welcome to Anuja\'s Portfolio!', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cFeel free to explore the code.', 'font-size: 14px; color: #666;');

// Performance: Debounce scroll events
function debounce(func, wait = 15) {
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

// Optimize scroll performance
window.addEventListener('scroll', debounce(() => {
    // Scroll-based animations here
}), 10);

// Add typing effect to hero subtitle (optional)
function typeWriter(element, text, speed = 50) {
    if (!element) return;
    
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

// Initialize typing effect after page load
setTimeout(() => {
    // Uncomment if you want the typing effect
    // const subtitle = document.querySelector('.typing-effect');
    // if (subtitle) {
    //     typeWriter(subtitle, 'Building scalable web applications...', 30);
    // }
}, 1000);

