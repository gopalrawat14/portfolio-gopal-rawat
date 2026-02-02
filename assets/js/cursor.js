/**
 * Antigravity Cursor Particles
 * Creates a swarm of dots that follow the cursor and react to its movement.
 */

class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: -100, y: -100 };
        this.particleCount = 50;
        this.colors = ['#4285F4', '#34A853', '#FBBC05', '#EA4335']; // Google colors

        this.init();
    }

    init() {
        // Setup canvas
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999'; // On top but no pointer events
        document.body.appendChild(this.canvas);

        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Create initial particles
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 2 + 1,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            vx: Math.random() * 2 - 1,
            vy: Math.random() * 2 - 1,
            originX: 0,
            originY: 0,
            friction: 0.95,
            ease: 0.1
        };
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(p => {
            // "Gravitational" pull to mouse
            let dx = this.mouse.x - p.x;
            let dy = this.mouse.y - p.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            // Interaction radius
            if (dist < 150) {
                let force = (150 - dist) / 150;
                p.vx += dx * force * 0.05;
                p.vy += dy * force * 0.05;
            }

            // Normal movement / drift
            p.vx *= p.friction;
            p.vy *= p.friction;
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            // Draw
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = 0.6;
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
});
