// Calculadora ROI
function calcularROI() {
    const empleados = parseInt(document.getElementById('empleados').value) || 0;
    const horasManuales = parseInt(document.getElementById('horas-manuales').value) || 0;
    const salarioPromedio = parseInt(document.getElementById('salario-promedio').value) || 0;
    
    // Asumiendo 87% de automatización según stats
    const semanasAnio = 52;
    const porcentajeAutomatizacion = 0.87;
    
    const ahorroSemanal = empleados * horasManuales * salarioPromedio * porcentajeAutomatizacion;
    const ahorroAnual = ahorroSemanal * semanasAnio;
    
    // Formatear como moneda
    const formatter = new Intl.NumberFormat('es-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
    
    document.getElementById('ahorro-anual').textContent = formatter.format(ahorroAnual);
}

// Contador de empresas que han solicitado (simulado para urgencia)
function iniciarContadorUrgencia() {
    const empresasRestantes = document.createElement('span');
    empresasRestantes.id = 'empresas-restantes';
    empresasRestantes.style.color = '#fbbf24';
    empresasRestantes.style.fontWeight = 'bold';
    
    let restantes = Math.floor(Math.random() * 5) + 3; // Entre 3-7 espacios
    empresasRestantes.textContent = \Solo quedan \ espacios disponibles\;
    
    const banner = document.querySelector('.urgency-content span');
    if (banner) {
        banner.appendChild(document.createElement('br'));
        banner.appendChild(empresasRestantes);
    }
    
    // Decrementar cada 2-5 minutos (simulado)
    setInterval(() => {
        if (restantes > 1) {
            restantes--;
            empresasRestantes.textContent = \Solo quedan \ espacios disponibles\;
        }
    }, Math.random() * 180000 + 120000); // Entre 2-5 minutos
}

// Chat Widget Lead Magnet
function crearChatWidget() {
    const chatWidget = document.createElement('div');
    chatWidget.className = 'chat-widget';
    chatWidget.innerHTML = \
        <i class="fas fa-gift"></i> <strong>Guía Gratis:</strong> 10 Procesos Automatizables
    \;
    
    chatWidget.onclick = () => {
        // Scroll al formulario y pre-rellenar mensaje
        document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            const mensajeField = document.querySelector('#contacto textarea');
            if (mensajeField) {
                mensajeField.value = 'Quiero recibir la Guía Gratuita: 10 Procesos Automatizables en mi Empresa';
                mensajeField.focus();
            }
        }, 800);
    };
    
    document.body.appendChild(chatWidget);
}

// Animación de números (contador ascendente para stats)
function animarNumeros() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const finalValue = stat.textContent.trim();
        if (finalValue.includes('%')) {
            const valor = parseInt(finalValue);
            animarContador(stat, 0, valor, 2000, '%');
        } else if (finalValue.includes('K')) {
            const valor = parseInt(finalValue.replace('K', '').replace('$', ''));
            animarContador(stat, 0, valor, 2000, 'K', '$');
        } else if (finalValue.includes('h')) {
            const valor = parseInt(finalValue);
            animarContador(stat, 0, valor, 2000, 'h');
        } else {
            const valor = parseInt(finalValue.replace('+', ''));
            animarContador(stat, 0, valor, 2000, '+');
        }
    });
}

function animarContador(elemento, inicio, fin, duracion, sufijo = '', prefijo = '') {
    const incremento = (fin - inicio) / (duracion / 16);
    let actual = inicio;
    
    const timer = setInterval(() => {
        actual += incremento;
        if (actual >= fin) {
            actual = fin;
            clearInterval(timer);
        }
        elemento.textContent = prefijo + Math.floor(actual) + sufijo;
    }, 16);
}

// Tracking de interacciones (para analytics futuro)
function trackearInteracciones() {
    // Track clicks en CTAs
    document.querySelectorAll('.cta-button, .urgency-cta').forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('CTA Click:', btn.textContent.trim());
            // Aquí integrarías Google Analytics, Facebook Pixel, etc.
        });
    });
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent > maxScroll) {
            maxScroll = Math.floor(scrollPercent / 25) * 25; // Cada 25%
            console.log('Scroll depth:', maxScroll + '%');
        }
    });
}

// Inicializar todo cuando carga la página
document.addEventListener('DOMContentLoaded', () => {
    calcularROI();
    iniciarContadorUrgencia();
    crearChatWidget();
    
    // Animar números cuando aparecen en viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.classList.contains('stats-container')) {
                animarNumeros();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        observer.observe(statsContainer);
    }
    
    trackearInteracciones();
});
