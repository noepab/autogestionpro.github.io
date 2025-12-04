// Objeto que contendrá los datos de los modales
const modalData = {
    'optimizacion-procesos': {
        title: 'Optimización de Procesos',
        description: 'Transforma tus operaciones con nuestra solución de optimización de procesos impulsada por IA. Analizamos tus flujos de trabajo para identificar cuellos de botella, automatizar tareas repetitivas y mejorar la eficiencia operativa. Nuestro sistema aprende de los patrones de tu negocio para ofrecer mejoras continuas y personalizadas.',
        videoId: 'xJdN8nHVq5A'
    },
    'automatizacion': {
        title: 'Automatización de Tareas',
        description: 'La automatización de tareas con inteligencia artificial no solo mejora la eficiencia, sino que también transforma el día a día en las empresas. Delegar tareas repetitivas permite que los equipos se enfoquen en lo que realmente importa: pensar, crear, resolver y conectar con propósito.',
        videoId: 'xJdN8nHVq5A'
    },
    'decisiones': {
        title: 'Decisiones Inteligentes',
        description: 'Toma decisiones más informadas con el poder de la inteligencia artificial. Nuestros sistemas analizan grandes volúmenes de datos en tiempo real para ofrecerte insights accionables que impulsan el crecimiento de tu negocio.',
        videoId: 'dQw4w9WgXcQ'
    },
    'ahorro': {
        title: 'Ahorro de Costes',
        description: 'Reduce significativamente tus gastos operativos mediante la optimización inteligente de recursos. Nuestras soluciones identifican áreas de mejora y automatizan procesos para maximizar la eficiencia y reducir costes.',
        videoId: 'dQw4w9WgXcQ'
    },
    'seguridad': {
        title: 'Seguridad Mejorada',
        description: 'Protege tus datos sensibles y sistemas críticos con nuestras soluciones de seguridad basadas en IA. Detecta amenazas en tiempo real y previene ataques antes de que ocurran.',
        videoId: 'dQw4w9WgXcQ'
    },
    'ia-avanzada': {
        title: 'IA Avanzada',
        description: 'Lleva tu negocio al siguiente nivel con nuestros modelos de IA de última generación. Desde aprendizaje automático hasta procesamiento de lenguaje natural, ofrecemos soluciones personalizadas que se adaptan a tus necesidades específicas.',
        videoId: 'dQw4w9WgXcQ'
    }
};

// Variable para rastrear el modal actualmente abierto
let currentModal = null;

// Función para abrir un modal
function openModal(modalId) {
    // Cerrar cualquier modal abierto previamente
    if (currentModal) {
        closeModal();
    }

    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalVideo = document.getElementById('modal-video');
    
    // Obtener datos del modal
    const data = modalData[modalId];
    
    if (!data) {
        console.error('Modal no encontrado:', modalId);
        return;
    }
    
    // Actualizar el contenido del modal
    modalTitle.textContent = data.title;
    modalDescription.textContent = data.description;
    
    // Configurar el video de YouTube con parámetros mejorados
    if (data.videoId) {
        const videoUrl = `https://www.youtube.com/embed/${data.videoId}?` + 
            'autoplay=1&' +
            'rel=0&' +
            'modestbranding=1&' +
            'enablejsapi=1&' +
            'origin=' + encodeURIComponent(window.location.origin) + '&' +
            'widgetid=1';
        
        // Usar setAttribute para asegurar la configuración correcta
        modalVideo.setAttribute('src', ''); // Limpiar primero
        modalVideo.setAttribute('src', videoUrl);
        modalVideo.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        modalVideo.setAttribute('allowfullscreen', '');
        modalVideo.style.display = 'block';
    } else {
        modalVideo.style.display = 'none';
    }
    
    // Mostrar el modal
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = window.innerWidth - document.documentElement.clientWidth + 'px';
    document.documentElement.classList.add('modal-open');
    
    // Mostrar el modal antes de agregar la clase active
    modal.style.display = 'flex';
    
    // Pequeño retraso para permitir que el navegador procese el cambio de display
    setTimeout(() => {
        modal.classList.add('active');
        currentModal = modal;
    }, 10);
    
    // Enfocar el modal para accesibilidad
    modal.setAttribute('aria-hidden', 'false');
    const closeButton = modal.querySelector('.modal-close');
    if (closeButton) {
        closeButton.focus();
    }
}

// Función para cerrar el modal
function closeModal() {
    if (!currentModal) return;
    
    const modalVideo = currentModal.querySelector('#modal-video');
    
    // Detener el video
    if (modalVideo) {
        modalVideo.src = '';
    }
    
    // Ocultar el modal con transición
    currentModal.classList.remove('active');
    
    // Esperar a que termine la transición para ocultar completamente
    setTimeout(() => {
        currentModal.style.display = 'none';
        
        // Restaurar estilos del body solo si no hay otros modales abiertos
        if (!document.querySelector('.modal-overlay[style*="display: flex"]:not([style*="display: none"])')) {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            document.documentElement.classList.remove('modal-open');
        }
        
        currentModal.setAttribute('aria-hidden', 'true');
        currentModal = null;
        
        // Enfocar el botón que abrió el modal
        const lastFocused = document.activeElement;
        if (lastFocused && lastFocused.hasAttribute('data-modal')) {
            lastFocused.focus();
        }
    }, 300); // Debe coincidir con la duración de la transición CSS
}

// Función para manejar el clic fuera del contenido del modal
function handleOutsideClick(e) {
    if (!currentModal) return;
    
    const modalContent = currentModal.querySelector('.modal-content');
    
    // Verificar si el clic fue fuera del contenido del modal
    if (e.target === currentModal) {
        closeModal();
    }
}

// Inicializar los event listeners cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Cerrar modal al hacer clic fuera del contenido
    document.addEventListener('click', handleOutsideClick);
    
    // Cerrar con la tecla ESC
    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('modal');
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
            e.preventDefault();
        }
    });
    
    // Inicializar botones de cierre
    document.querySelectorAll('.modal-close, [data-dismiss="modal"]').forEach(button => {
        button.addEventListener('click', closeModal);
    });
    
    // Inicializar botones de los modales
    document.querySelectorAll('[data-modal]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevenir la propagación del evento
            const modalId = this.getAttribute('data-modal');
            openModal(modalId);
        });
    });
    
    // Prevenir que el clic dentro del contenido cierre el modal
    document.querySelectorAll('.modal-content').forEach(content => {
        content.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
});
