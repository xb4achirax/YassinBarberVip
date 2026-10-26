// ===================================
// JANATI BARBER VIP — LINK IN BIO
// Mobile-First Scripts
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
});

// ===================================
// LOADING SCREEN
// ===================================
function initLoader() {
    const loader      = document.getElementById('loader');
    const pageContent = document.getElementById('page-content');
    const progressBar = document.getElementById('loader-progress-bar');

    let progress = 0;
    const interval  = 30;
    const increment = 100 / (3200 / interval); // ~3.2 s total

    const tick = setInterval(() => {
        progress += increment * (0.6 + Math.random() * 0.8);
        if (progress > 100) progress = 100;
        progressBar.style.width = progress + '%';

        if (progress >= 100) {
            clearInterval(tick);
            setTimeout(() => {
                loader.classList.add('loader-hidden');
                pageContent.classList.add('visible');

                // Defer heavy work until after fade
                setTimeout(() => {
                    initParticles();
                    initCardFeedback();
                }, 500);

                setTimeout(() => loader.remove(), 1000);
            }, 350);
        }
    }, interval);
}

// ===================================
// PARTICLE BACKGROUND
// ===================================
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Fewer particles on mobile to keep perf smooth
    const isMobile = window.innerWidth < 600;
    const COUNT    = isMobile ? 22 : 40;

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    class Particle {
        constructor() { this.reset(true); }
        reset(initial = false) {
            this.x       = Math.random() * canvas.width;
            this.y       = initial ? Math.random() * canvas.height : canvas.height + 5;
            this.size    = Math.random() * 1.4 + 0.4;
            this.speedY  = -(Math.random() * 0.28 + 0.08);
            this.speedX  = (Math.random() - 0.5) * 0.18;
            this.opacity = Math.random() * 0.35 + 0.08;
            this.golden  = Math.random() > 0.45;
        }
        update() {
            this.y       += this.speedY;
            this.x       += this.speedX;
            this.opacity -= 0.0004;
            if (this.y < 0 || this.opacity <= 0) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.golden
                ? `rgba(196,30,42,${this.opacity})`
                : `rgba(245,240,232,${this.opacity * 0.5})`;
            ctx.fill();
        }
    }

    const particles = Array.from({ length: COUNT }, () => new Particle());

    let rafId;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        rafId = requestAnimationFrame(animate);
    }
    animate();

    // Pause when tab is hidden (saves battery on mobile)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(rafId);
        else animate();
    });
}

// ===================================
// CARD TOUCH FEEDBACK (ripple)
// ===================================
function initCardFeedback() {
    // Inject ripple keyframe once
    const style = document.createElement('style');
    style.textContent = '@keyframes ripple{to{transform:scale(3);opacity:0}}';
    document.head.appendChild(style);

    document.querySelectorAll('.link-card').forEach(card => {
        // Use pointerdown for instant response on both touch and mouse
        card.addEventListener('pointerdown', function(e) {
            const rect   = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size   = Math.max(rect.width, rect.height);
            const x      = e.clientX - rect.left - size / 2;
            const y      = e.clientY - rect.top  - size / 2;

            ripple.style.cssText = `
                position:absolute;
                width:${size}px; height:${size}px;
                left:${x}px; top:${y}px;
                background: rgba(196,30,42,0.12);
                border-radius:50%;
                transform:scale(0);
                animation:ripple 0.55s ease-out forwards;
                pointer-events:none;
                z-index:0;
            `;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}
