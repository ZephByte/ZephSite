// Main JavaScript file for ZephByte's website
// Enhanced with sophisticated interactions and effects

document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeParallax();
    initializeLinkEffects();
    initializeStatsCounter();
    initializeLoadingScreen();
    initializeProfileFloat();
});

function initializeProfileFloat() {
    const pfp = document.querySelector('.pfp');
    if (!pfp) return;
    
    let isHovered = false;
    let floatDirection = 1;
    let currentY = 0;
    let entranceAnimationComplete = false;
    
    pfp.style.opacity = '0';
    pfp.style.transform = 'translateY(-30px) scale(0.8) rotate(-10deg)';
    
    let startTime = Date.now();
    const entranceDuration = 1000;
    
    function animateEntrance() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / entranceDuration, 1);
        
        if (progress < 0.5) {
            const firstHalfProgress = progress * 2;
            const firstHalfEase = 1 - Math.pow(1 - firstHalfProgress, 2);
            
            pfp.style.opacity = (firstHalfEase * 0.8).toString();
            pfp.style.transform = `translateY(${-30 + (35 * firstHalfEase)}px) scale(${0.8 + (0.25 * firstHalfEase)}) rotate(${-10 + (12 * firstHalfEase)}deg)`;
        } else {
            const secondHalfProgress = (progress - 0.5) * 2;
            const secondHalfEase = 1 - Math.pow(1 - secondHalfProgress, 2);
            
            pfp.style.opacity = (0.8 + (0.2 * secondHalfEase)).toString();
            pfp.style.transform = `translateY(${5 - (5 * secondHalfEase)}px) scale(${1.05 - (0.05 * secondHalfEase)}) rotate(${2 - (2 * secondHalfEase)}deg)`;
        }
        
        if (progress < 1) {
            requestAnimationFrame(animateEntrance);
        } else {
            entranceAnimationComplete = true;
            pfp.style.opacity = '1';
            pfp.style.transform = 'translateY(0) scale(1) rotate(0deg)';
        }
    }
    
    setTimeout(() => {
        animateEntrance();
    }, 200);
    
    pfp.addEventListener('mouseenter', () => {
        isHovered = true;
    });
    
    pfp.addEventListener('mouseleave', () => {
        isHovered = false;
    });
    
    function animateFloat() {
        if (!isHovered && entranceAnimationComplete) {
            currentY += 0.1 * floatDirection;
            
            if (currentY >= 5) {
                floatDirection = -1;
            } else if (currentY <= -5) {
                floatDirection = 1;
            }
            
            pfp.style.transform = `translateY(${currentY}px)`;
        }
        
        requestAnimationFrame(animateFloat);
    }
    
    animateFloat();
}

function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 1000);
    });
}

function initializeAnimations() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    const images = document.querySelectorAll('img:not(.pfp)');
    images.forEach((img, index) => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });
        
        img.style.opacity = '0';
        img.style.transform = 'scale(0.95)';
        img.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.link-button, .bio').forEach(el => {
        observer.observe(el);
    });
}

function initializeParallax() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        const mainContainer = document.querySelector('.main-container');
        if (mainContainer) {
            mainContainer.style.transform = `translateY(${rate}px)`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

function initializeLinkEffects() {
    document.querySelectorAll('.link-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });

        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0)';
        });
    });
}

function initializeStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 30);
}

const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(224, 216, 245, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation: slideInUp 0.6s ease-out forwards;
    }
`;
document.head.appendChild(style);
