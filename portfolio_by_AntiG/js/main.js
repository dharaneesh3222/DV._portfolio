// Minimal Premium Preloader Controller
document.addEventListener("DOMContentLoaded", () => {
    const progressEl = document.querySelector(".preloader-progress-line");
    const preloader = document.querySelector(".preloader-premium");
    
    // Initialize Canvas Background
    initNetworkBackground();
    
    let count = 0;
    const duration = 4000; // ~4 seconds progression
    const intervalTime = 30;
    const totalSteps = duration / intervalTime;
    
    const updatePreloader = setInterval(() => {
        count += (100 / totalSteps);
        if (count >= 100) {
            count = 100;
            clearInterval(updatePreloader);
            
            // First step: add loading-complete to fade logo out and make neon seam line glow brighter
            if (preloader) preloader.classList.add("loading-complete");
            
            // Second step: after 800ms, swing the 3D doors open
            setTimeout(() => {
                if (preloader) preloader.classList.add("fade-out");
                
                // Third step: start hero animations once doors are fully open
                setTimeout(() => {
                    if (window.startHeroAnimations) {
                        window.startHeroAnimations();
                    }
                }, 1100);
            }, 800);
        }
        
        if (progressEl) progressEl.style.width = count + "%";
    }, intervalTime);
});

// Futuristic Interactive Particle Network Background
function initNetworkBackground() {
    const canvas = document.getElementById('bg-network-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const particles = [];
    const maxParticles = window.innerWidth < 768 ? 35 : 85;
    const connectionDist = 125;
    const mouse = { x: null, y: null, radius: 160 };
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.45;
            this.vy = (Math.random() - 0.5) * 0.45;
            this.radius = Math.random() * 2 + 0.8;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
            
            // Mouse gravity/repulsion
            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x += (dx / dist) * force * 1.5;
                    this.y += (dy / dist) * force * 1.5;
                }
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 210, 122, 0.45)';
            ctx.fill();
        }
    }
    
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.hypot(dx, dy);
                
                if (dist < connectionDist) {
                    const alpha = (1 - dist / connectionDist) * 0.16;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 210, 122, ${alpha})`;
                    ctx.lineWidth = 0.85;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Add a slight delay to the outline for a smooth effect
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Magnetic Buttons
const magneticElements = document.querySelectorAll('.magnetic');

magneticElements.forEach(elem => {
    elem.addEventListener('mousemove', (e) => {
        const rect = elem.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(elem, {
            x: x * 0.4,
            y: y * 0.4,
            duration: 0.5,
            ease: "power2.out"
        });
        
        cursorOutline.classList.add('hover-state');
    });

    elem.addEventListener('mouseleave', () => {
        gsap.to(elem, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
        });
        
        cursorOutline.classList.remove('hover-state');
    });
});

// Interactive Elements Hover State
const interactiveElements = document.querySelectorAll('a, button, input, textarea');
interactiveElements.forEach(elem => {
    if(!elem.classList.contains('magnetic')) {
        elem.addEventListener('mouseenter', () => cursorOutline.classList.add('hover-state'));
        elem.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover-state'));
    }
});

// Typed.js Initialization
const typingElement = document.querySelector('.typing-text');
if (typingElement) {
    const typed = new Typed('.typing-text', {
        strings: [
            'Full Stack Developer',
            'AI Enthusiast',
            'Prompt Engineer',
            'Problem Solver'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true
    });
}

// Initial Hero Animations (called after preloader slide-up)
window.startHeroAnimations = function() {
    const tl = gsap.timeline();
    tl.to('.glint-hero-subtitle', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
      .to('.glint-hero-name', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, "-=0.6")
      .to('.glint-hero-desc', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, "-=0.6")
      .to('.hero-cta', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, "-=0.6")
      .to('.hero-socials', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, "-=0.6")
      .to('.hero-profile-img', { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out' }, "-=1");
};

// Scroll Animations
const revealUpElements = document.querySelectorAll('.reveal-up');
revealUpElements.forEach((elem, index) => {
    gsap.fromTo(elem, 
        { opacity: 0, y: 50, scale: 0.8 },
        {
            opacity: 1, y: 0, scale: 1,
            duration: 1.2,
            ease: 'back.out(1.7)',
            delay: (index % 4) * 0.15, // Orchestrated cascade stagger
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        }
    );
});

const isMobile = window.innerWidth <= 992;

const revealLeftElements = document.querySelectorAll('.reveal-left');
revealLeftElements.forEach(elem => {
    gsap.fromTo(elem, 
        { opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? 30 : 0 },
        {
            opacity: 1, x: 0, y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        }
    );
});

const revealRightElements = document.querySelectorAll('.reveal-right');
revealRightElements.forEach(elem => {
    gsap.fromTo(elem, 
        { opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 30 : 0 },
        {
            opacity: 1, x: 0, y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        }
    );
});

// Animated Counters
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    
    ScrollTrigger.create({
        trigger: counter,
        start: "top 90%",
        onEnter: () => {
            gsap.to(counter, {
                innerHTML: target,
                duration: 2,
                snap: { innerHTML: 1 },
                ease: "power2.out",
                onUpdate: function() {
                    counter.innerHTML = Math.round(counter.innerHTML) + "+";
                }
            });
        },
        once: true
    });
});

// Fetch GitHub Stats
async function fetchGithubStats() {
    try {
        const username = 'dharaneesh3222';
        const response = await fetch(`https://api.github.com/users/${username}`);
        const data = await response.json();

        if (data.public_repos !== undefined) {
            animateValue('gh-repos', 0, data.public_repos, 2000);
            animateValue('gh-followers', 0, data.followers, 2000);
            
            // Note: GitHub user API doesn't provide total stars easily without fetching all repos.
            // Using a placeholder or calculated value for stars.
            animateValue('gh-stars', 0, 42, 2000); // Placeholder 42
        }
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
    }
}

function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if(!obj) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Trigger GitHub stats fetch when section comes into view
ScrollTrigger.create({
    trigger: "#github",
    start: "top 80%",
    onEnter: fetchGithubStats,
    once: true
});

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Animate hamburger lines
    hamburger.classList.toggle('toggle');
});

// Hide nav on scroll down, show on scroll up
let lastScrollY = window.scrollY;
const nav = document.querySelector('.glass-nav');

window.addEventListener('scroll', () => {
    if (lastScrollY < window.scrollY && window.scrollY > 100) {
        nav.classList.add('nav-hidden');
    } else {
        nav.classList.remove('nav-hidden');
    }
    lastScrollY = window.scrollY;
});

// AI Assistant click handler
const aiAssistant = document.getElementById('ai-assistant');
aiAssistant.addEventListener('click', () => {
    // Simple pulse animation to show interaction
    gsap.to('.ai-core', {
        scale: 1.5,
        duration: 0.2,
        yoyo: true,
        repeat: 1
    });
    
    // Here you could integrate a real chat widget popup
    alert("Jarvis AI Online: Hello! I'm Dharaneeshwar's AI Assistant. How can I help you today?");
});

// Parallax Animation for Profile Image
gsap.to('#profile-container', {
    y: -50,
    ease: "none",
    scrollTrigger: {
        trigger: '#hero',
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

// Vertical Dot Navigation Logic Removed for Glint Theme
