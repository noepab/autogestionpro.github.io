// Configuración de partículas
const config = {
    particleCount: 100,
    connectionDistance: 180,
    maxLineOpacity: 0.5,
    particleSize: 2,
    particleSizeVariation: 1.5,
    particleBaseSpeed: 0.2,
    particleSpeedVariation: 0.8,
    colors: {
        particles: [
            'rgba(91, 143, 249, 0.8)',  // Azul brillante
            'rgba(255, 107, 107, 0.8)', // Rojo coral
            'rgba(255, 230, 109, 0.8)', // Amarillo
            'rgba(120, 224, 143, 0.8)', // Verde menta
            'rgba(197, 139, 242, 0.8)', // Púrpura
            'rgba(255, 159, 67, 0.8)'   // Naranja
        ],
        shootingStar: [
            '255, 255, 255',  // Blanco
            '100, 210, 255', // Azul claro
            '255, 100, 200', // Rosa
            '100, 255, 218'  // Cian
        ]
    },
    effects: {
        sparkle: true,
        glow: true,
        connect: true,
        mouseAttraction: true
    }
};

// Clase de partícula mejorada
class Particle {
    constructor(x, y, radius, color, vx, vy) {
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.radius = radius * (1 + Math.random() * config.particleSizeVariation);
        this.baseRadius = this.radius;
        this.color = color;
        this.originalColor = color;
        this.vx = vx * (config.particleBaseSpeed + Math.random() * config.particleSpeedVariation);
        this.vy = vy * (config.particleBaseSpeed + Math.random() * config.particleSpeedVariation);
        this.isSparking = false;
        this.sparkIntensity = 0;
        this.pulseSpeed = 0.01 + Math.random() * 0.02;
        this.pulseSize = 0.5 + Math.random() * 0.5;
        this.angle = Math.random() * Math.PI * 2;
        this.opacity = 0.7 + Math.random() * 0.3;
    }

    update(canvasWidth, canvasHeight) {
        // Movimiento base
        this.x += this.vx;
        this.y += this.vy;
        
        // Rebotar en los bordes con amortiguación
        const bounceDamping = 0.8;
        if (this.x < 0) { this.x = 0; this.vx = Math.abs(this.vx) * bounceDamping; }
        if (this.x > canvasWidth) { this.x = canvasWidth; this.vx = -Math.abs(this.vx) * bounceDamping; }
        if (this.y < 0) { this.y = 0; this.vy = Math.abs(this.vy) * bounceDamping; }
        if (this.y > canvasHeight) { this.y = canvasHeight; this.vy = -Math.abs(this.vy) * bounceDamping; }
        
        // Efecto de pulso
        this.angle += this.pulseSpeed;
        this.radius = this.baseRadius * (1 + Math.sin(this.angle) * this.pulseSize * 0.1);
        
        // Actualizar efecto de chispa
        if (this.isSparking) {
            this.sparkIntensity = Math.max(0, this.sparkIntensity - 0.008);
            if (this.sparkIntensity <= 0) {
                this.isSparking = false;
            }
        }
        
        // Interacción con el ratón
        if (mouse.x && mouse.y && config.effects.mouseAttraction) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 200;
            
            if (distance < maxDistance) {
                const force = (1 - distance / maxDistance) * 0.06;
                const angle = Math.atan2(dy, dx);
                this.vx += Math.cos(angle) * force;
                this.vy += Math.sin(angle) * force;
                this.radius = this.baseRadius * (1 + force * 3);
                
                if (!this.isSparking && Math.random() > 0.97) {
                    this.isSparking = true;
                    this.sparkIntensity = 1;
                }
            }
        }
        
        // Limitar velocidad
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const maxSpeed = 0.7;
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }
    }

    draw() {
        // Dibujar resplandor exterior cuando hay chispa
        if (this.isSparking && config.effects.glow) {
            const glowGradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.radius * 4
            );
            glowGradient.addColorStop(0, `rgba(255, 255, 255, ${this.sparkIntensity * 0.6})`);
            glowGradient.addColorStop(0.5, `rgba(200, 230, 255, ${this.sparkIntensity * 0.3})`);
            glowGradient.addColorStop(1, 'rgba(100, 180, 255, 0)');
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 4, 0, Math.PI * 2);
            ctx.fillStyle = glowGradient;
            ctx.fill();
            
            // Añadir destellos aleatorios
            if (Math.random() > 0.7) {
                const angle = Math.random() * Math.PI * 2;
                const dist = this.radius * (1 + Math.random() * 3);
                const x2 = this.x + Math.cos(angle) * dist;
                const y2 = this.y + Math.sin(angle) * dist;
                
                const lineGradient = ctx.createLinearGradient(this.x, this.y, x2, y2);
                lineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
                lineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = lineGradient;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
        
        // Dibujar núcleo de la partícula
        const particleGradient = ctx.createRadialGradient(
            this.x - this.radius/3, 
            this.y - this.radius/3, 
            0,
            this.x, 
            this.y, 
            this.radius * 1.5
        );
        
        if (this.isSparking) {
            particleGradient.addColorStop(0, '#ffffff');
            particleGradient.addColorStop(0.7, this.originalColor);
            particleGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        } else {
            particleGradient.addColorStop(0, this.originalColor);
            particleGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleGradient;
        ctx.fill();
        
        // Añadir punto brillante en el centro si está habilitado
        if (config.effects.sparkle) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fill();
        }
    }
}

// Clase de estrella fugaz
class ShootingStar {
    constructor(x, y, vx, vy, length, color, opacity) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.length = length;
        this.color = color;
        this.opacity = opacity;
        this.life = 1;
    }

    update(canvasWidth, canvasHeight) {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.005;
        return this.life > 0 && 
               this.x > -50 && this.x < canvasWidth + 50 && 
               this.y > -50 && this.y < canvasHeight + 50;
    }

    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x - this.vx * this.length,
            this.y - this.vy * this.length
        );
        
        const gradient = ctx.createLinearGradient(
            this.x, this.y,
            this.x - this.vx * this.length,
            this.y - this.vy * this.length
        );
        
        gradient.addColorStop(0, `rgba(${this.color}, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(${this.color}, 0)`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        // Añadir un punto brillante en la cabeza
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
        
        ctx.restore();
    }
}

// Variables globales
let canvas, ctx, animationId;
const particles = [];
const shootingStars = [];
const mouse = { x: null, y: null };

// Inicializar partículas
function initParticles() {
    // Limpiar partículas existentes
    particles.length = 0;
    
    // Crear nuevas partículas
    for (let i = 0; i < config.particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = config.particleSize;
        const color = config.colors.particles[
            Math.floor(Math.random() * config.colors.particles.length)
        ];
        const speed = 0.1 + Math.random() * 0.3;
        const angle = Math.random() * Math.PI * 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        particles.push(new Particle(x, y, radius, color, vx, vy));
    }
}

// Crear una nueva estrella fugaz
function createShootingStar() {
    const startX = Math.random() < 0.5 ? -10 : canvas.width + 10;
    const startY = Math.random() * canvas.height;
    const speed = Math.random() * 2 + 1;
    const angle = Math.atan2(
        Math.random() * canvas.height - startY,
        Math.random() * canvas.width - startX
    );
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const length = Math.random() * 30 + 20;
    const color = config.colors.shootingStar[
        Math.floor(Math.random() * config.colors.shootingStar.length)
    ];
    
    shootingStars.push(new ShootingStar(startX, startY, vx, vy, length, color, 0.8));
}

// Dibujar conexiones entre partículas
function drawConnections() {
    // Ordenar partículas por posición Y para mejor rendimiento
    particles.sort((a, b) => a.y - b.y);
    
    for (let i = 0; i < particles.length; i++) {
        // Solo verificar partículas cercanas (optimización de rendimiento)
        for (let j = i + 1; j < Math.min(i + 30, particles.length); j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < config.connectionDistance) {
                // Calcular opacidad basada en la distancia
                const opacity = (1 - distance / config.connectionDistance) * config.maxLineOpacity;
                
                // Crear gradiente para la línea
                const gradient = ctx.createLinearGradient(
                    particles[i].x, particles[i].y,
                    particles[j].x, particles[j].y
                );
                
                // Usar colores de las partículas conectadas
                gradient.addColorStop(0, particles[i].originalColor.replace('0.8', opacity));
                gradient.addColorStop(1, particles[j].originalColor.replace('0.8', opacity));
                
                // Dibujar línea de conexión
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 0.8 + opacity * 0.5; // Línea más gruesa para conexiones cercanas
                
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                
                // Añadir un punto en el medio para un efecto más orgánico
                if (distance < config.connectionDistance * 0.5) {
                    const midX = (particles[i].x + particles[j].x) / 2;
                    const midY = (particles[i].y + particles[j].y) / 2;
                    
                    ctx.beginPath();
                    ctx.arc(midX, midY, 0.5, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.7})`;
                    ctx.fill();
                }
            }
        }
    }
}

// Función de animación principal
function animate() {
    // Limpiar el canvas con un fondo semi-transparente para efecto de estela
    ctx.fillStyle = 'rgba(10, 10, 20, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Actualizar y dibujar partículas
    particles.forEach(particle => {
        particle.update(canvas.width, canvas.height);
        particle.draw();
    });
    
    // Dibujar conexiones entre partículas si está habilitado
    if (config.effects.connect) {
        drawConnections();
    }
    
    // Actualizar y dibujar estrellas fugaces
    for (let i = shootingStars.length - 1; i >= 0; i--) {
        if (!shootingStars[i].update(canvas.width, canvas.height)) {
            shootingStars.splice(i, 1);
        } else {
            shootingStars[i].draw();
        }
    }
    
    // Añadir nuevas estrellas fugaces aleatoriamente
    if (Math.random() < 0.003) {
        createShootingStar();
    }
    
    // Continuar la animación
    animationId = requestAnimationFrame(animate);
}

// Manejar el redimensionamiento de la ventana
function handleResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
}

// Inicializar el canvas y los eventos
function init() {
    canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    
    // Configurar tamaño inicial
    handleResize();
    
    // Configurar eventos
    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationId);
        handleResize();
        animate();
    });
    
    // Seguimiento del ratón
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    // Iniciar animación
    animate();
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);
