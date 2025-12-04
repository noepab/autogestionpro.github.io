// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando reproductor de video...');
    
    // Elementos del reproductor
    const video = document.getElementById('main-video');
    const playPauseBtn = document.getElementById('play-pause');
    const muteUnmuteBtn = document.getElementById('mute-unmute');
    const volumeControl = document.getElementById('volume-control');
    const videoContainer = document.querySelector('.video-container');
    
    // Verificar que los elementos existan
    if (!video) {
        console.error('No se encontró el elemento de video');
        return;
    }
    
    if (!playPauseBtn || !muteUnmuteBtn || !volumeControl || !videoContainer) {
        console.warn('Algunos controles del reproductor no se encontraron, pero continuando...');
    }
    
    // Agregar manejadores de eventos para depuración
    video.addEventListener('error', function(e) {
        console.error('Error en el video:', e);
        console.error('Código de error:', video.error ? video.error.code : 'Desconocido');
        console.error('Mensaje de error:', video.error ? video.error.message : 'Ninguno');
    });
    
    video.addEventListener('loadeddata', function() {
        console.log('Datos del video cargados');
        console.log('Duración del video:', video.duration);
        console.log('Dimensiones del video:', video.videoWidth + 'x' + video.videoHeight);
    });
    
    video.addEventListener('canplay', function() {
        console.log('El video puede comenzar a reproducirse');
    });
    
    video.addEventListener('play', function() {
        console.log('Reproducción iniciada');
    });
    
    console.log('Fuentes de video disponibles:');
    Array.from(video.getElementsByTagName('source')).forEach((source, index) => {
        console.log(`  Fuente ${index + 1}:`, source.src, 'tipo:', source.type);
    });
    
    // Mostrar controles personalizados
    video.controls = false;
    
    // Estado del reproductor
    let isUserInteracted = false;
    let playbackStarted = false;
    
    // Inicializar el reproductor
    function initPlayer() {
        // Configuración inicial
        video.volume = 0.5;
        video.muted = false;
        video.loop = false;
        
        // Actualizar controles iniciales
        updatePlayPauseIcon();
        updateMuteIcon();
        
        // Agregar overlay de reproducción
        addPlayOverlay();
    }
    
    // Agregar overlay de reproducción
    function addPlayOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'video-play-overlay';
        overlay.innerHTML = `
            <button class="play-button">
                <i class="fas fa-play"></i>
            </button>
            <p>Haz clic para reproducir</p>
        `;
        
        overlay.addEventListener('click', function() {
            startPlayback();
            overlay.remove();
        });
        
        videoContainer.appendChild(overlay);
    }
    
    // Iniciar reproducción
    function startPlayback() {
        isUserInteracted = true;
        playbackStarted = true;
        
        // Asegurarse de que el video esté silenciado para la reproducción automática
        video.muted = true;
        
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    // Si la reproducción automática con mute es exitosa, restaurar el estado de mute
                    video.muted = false;
                })
                .catch(error => {
                    console.error('Error al reproducir:', error);
                    // Mostrar controles nativos si falla la reproducción
                    video.controls = true;
                    // Mostrar un mensaje para el usuario
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'video-error-msg';
                    errorMsg.textContent = 'Haz clic para reproducir el video';
                    video.parentNode.insertBefore(errorMsg, video.nextSibling);
                });
        }
    }
    
    // Actualizar ícono de reproducción/pausa
    function updatePlayPauseIcon() {
        if (video.paused) {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            playPauseBtn.setAttribute('aria-label', 'Reproducir');
        } else {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playPauseBtn.setAttribute('aria-label', 'Pausar');
        }
    }
    
    // Actualizar ícono de silencio
    function updateMuteIcon() {
        if (video.muted || video.volume === 0) {
            muteUnmuteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            muteUnmuteBtn.setAttribute('aria-label', 'Activar sonido');
            volumeControl.value = 0;
        } else {
            muteUnmuteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            muteUnmuteBtn.setAttribute('aria-label', 'Silenciar');
            volumeControl.value = video.volume;
        }
    }
    
    // Manejador de evento para el botón de reproducción/pausa
    playPauseBtn.addEventListener('click', function() {
        if (!playbackStarted) {
            startPlayback();
        } else if (video.paused) {
            video.play().catch(error => {
                console.error('Error al reanudar:', error);
            });
        } else {
            video.pause();
        }
    });
    
    // Manejador de evento para el botón de silencio
    muteUnmuteBtn.addEventListener('click', function() {
        video.muted = !video.muted;
        updateMuteIcon();
    });
    
    // Manejador de evento para el control de volumen
    volumeControl.addEventListener('input', function() {
        const newVolume = parseFloat(this.value);
        video.volume = newVolume;
        video.muted = (newVolume === 0);
        updateMuteIcon();
    });
    
    // Manejador para cuando el video termina
    video.addEventListener('ended', function() {
        // Mostrar botón de reproducción
        updatePlayPauseIcon();
        
        // Opcional: Volver a mostrar el overlay después de un tiempo
        setTimeout(() => {
            if (!videoContainer.querySelector('.video-play-overlay')) {
                addPlayOverlay();
            }
        }, 1000);
    });
    
    // Actualizar íconos cuando cambia el estado del video
    video.addEventListener('play', updatePlayPauseIcon);
    video.addEventListener('pause', updatePlayPauseIcon);
    video.addEventListener('volumechange', updateMuteIcon);
    
    // Inicializar el reproductor
    initPlayer();
});
