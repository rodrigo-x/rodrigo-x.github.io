window.addEventListener('load', function () {
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
    }, 1500);
});

// Create floating particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = window.innerWidth < 768 ? 30 : 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';

        // Random colors
        const colors = ['var(--neon-blue)', 'var(--neon-purple)', 'var(--neon-green)'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        particlesContainer.appendChild(particle);
    }
}

function initCard3D() {
    const card = document.getElementById('digitalCard');

    card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    translateZ(20px)
                `;
    });

    card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
}

document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const name = this.querySelector('input[placeholder="Nome"]').value;
    const email = this.querySelector('input[placeholder="Email"]').value;
    const subject = this.querySelector('input[placeholder="Assunto"]').value;
    const message = this.querySelector('textarea[placeholder="Mensagem"]').value;

    // Simulate form submission
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
    submitBtn.disabled = true;

    setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Enviado!';
        submitBtn.style.background = 'linear-gradient(45deg, var(--neon-green), #00aa00)';

        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = 'linear-gradient(45deg, var(--neon-blue), var(--neon-purple))';
            this.reset();
        }, 2000);
    }, 1500);
});

// Skill items click effect
document.querySelectorAll('.skill-item').forEach(skill => {
    skill.addEventListener('click', function () {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'translateY(-3px)';
        }, 100);
    });
});

// Initialize everything
document.addEventListener('DOMContentLoaded', function () {
    createParticles();
    initCard3D();

    // Add stagger animation to skills
    document.querySelectorAll('.skill-item').forEach((skill, index) => {
        skill.style.animationDelay = (index * 0.1) + 's';
        skill.classList.add('fade-in');
    });
});

// Responsive particles
window.addEventListener('resize', function () {
    const particlesContainer = document.getElementById('particles');
    particlesContainer.innerHTML = '';
    createParticles();
});

// Add touch support for mobile
if ('ontouchstart' in window) {
    document.querySelectorAll('.skill-item, .social-btn, .submit-btn').forEach(element => {
        element.addEventListener('touchstart', function () {
            this.style.transform = 'scale(0.95)';
        });

        element.addEventListener('touchend', function () {
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
    });
}