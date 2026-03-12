// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Generate floating crypto symbols
    const cryptoAnimation = document.getElementById('cryptoAnimation');
    const cryptoSymbols = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'AVAX', 'MATIC', 'LINK', 'UNI', 'AAVE'];

    if (cryptoAnimation) {
        console.log('Creating crypto symbols...'); // Debug log
        
        // Define colors for different crypto symbols
        const cryptoColors = {
            'BTC': '#bce103ff', // Bitcoin orange
            'ETH': '#627EEA', // Ethereum blue
            'SOL': '#08f13eff', // Solana green
            'ADA': '#0033AD', // Cardano blue
            'DOT': '#E6007A', // Polkadot pink
            'AVAX': '#f30b0bff', // Avalanche red
            'MATIC': '#5c09ecff', // Polygon purple
            'LINK': '#e20df1ff', // Chainlink blue
            'UNI': '#FF007A', // Uniswap pink
            'AAVE': '#B6509E'  // Aave purple
        };
        
        // Array of gradient colors for variety
        const gradientColors = [
            'linear-gradient(45deg, #f41212ff, #14eadcff)',
            'linear-gradient(45deg, #0ef29eff, #eb640aff)',
            'linear-gradient(45deg, #f20f62ff, #ee1b57ff)',
            'linear-gradient(45deg, #2f16ebff, #2012e5ff)',
            'linear-gradient(45deg, #11f1c4ff, #00CEC9)',
            'linear-gradient(45deg, #FDCB6E, #E17055)',
            'linear-gradient(45deg, #0b7beaff, #0984E3)',
            'linear-gradient(45deg, #f81665ff, #efa00dff)',
            'linear-gradient(45deg, #0a74edff, #ed0d57ff)',
            'linear-gradient(45deg, #0fededff, #0968dbff)'
        ];
        
        for (let i = 0; i < 30; i++) {
            const symbol = document.createElement('div');
            symbol.className = 'crypto-symbol';
            const symbolText = cryptoSymbols[Math.floor(Math.random() * cryptoSymbols.length)];
            symbol.textContent = symbolText;
            
            // Set color based on symbol or use gradient
            if (Math.random() > 0.5 && cryptoColors[symbolText]) {
                symbol.style.color = cryptoColors[symbolText];
            } else {
                symbol.style.background = gradientColors[Math.floor(Math.random() * gradientColors.length)];
                symbol.style.webkitBackgroundClip = 'text';
                symbol.style.webkitTextFillColor = 'transparent';
                symbol.style.backgroundClip = 'text';
            }
            
            symbol.style.left = `${Math.random() * 100}%`;
            symbol.style.top = `${Math.random() * 100}%`;
            symbol.style.animationDelay = `${Math.random() * 15}s`;
            symbol.style.animationDuration = `${15 + Math.random() * 20}s`;
            symbol.style.animationName = 'float, bounce';
            symbol.style.animationIterationCount = 'infinite, infinite';
            symbol.style.animationTimingFunction = 'linear, ease-in-out';
            symbol.style.fontSize = `${1 + Math.random() * 0.5}rem`; // Random size variation
            
            cryptoAnimation.appendChild(symbol);
        }
        console.log('Crypto symbols created successfully!'); // Debug log
    } else {
        console.error('cryptoAnimation element not found!'); // Debug log
    }

    // Scroll animations
    const animateElements = document.querySelectorAll('.animate');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    animateElements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add hover effects for buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click effects for team member social links
    document.querySelectorAll('.social-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Add a simple click animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Add loading animation for images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = 1;
            this.style.transform = 'scale(1)';
        });
        
        img.style.opacity = 0;
        img.style.transform = 'scale(0.9)';
        img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // === HERO PARTICLE CANVAS ANIMATION ===
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null };
        const heroHeader = canvas.closest('.hero-header');

        function resizeCanvas() {
            if (heroHeader) {
                canvas.width = heroHeader.offsetWidth;
                canvas.height = heroHeader.offsetHeight;
            }
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        heroHeader && heroHeader.addEventListener('mousemove', function(e) {
            const rect = heroHeader.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        heroHeader && heroHeader.addEventListener('mouseleave', function() {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.6;
                this.speedY = (Math.random() - 0.5) * 0.6;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.color = Math.random() > 0.5
                    ? `rgba(255, 74, 28, ${this.opacity})`
                    : `rgba(0, 240, 255, ${this.opacity})`;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (mouse.x !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        this.x -= dx * 0.02;
                        this.y -= dy * 0.02;
                    }
                }
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        for (let i = 0; i < 80; i++) {
            particles.push(new Particle());
        }

        function connectParticles() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.strokeStyle = `rgba(255, 74, 28, ${0.08 * (1 - dist / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            connectParticles();
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }


});
