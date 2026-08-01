// ===== MÚSICA =====
let isMusicPlaying = false;

function playAudio() {
    const audio = document.getElementById('bg-music');
    if (audio) {
        audio.volume = 1.0; // Volumen al máximo (100%)
        audio.play().then(() => {
            isMusicPlaying = true;
        }).catch(err => {
            console.error("Error al reproducir:", err);
        });
    }
}

function toggleMusic() {
    const audio = document.getElementById('bg-music');
    const btn = document.getElementById('music-btn');
    if (!audio) return;

    if (audio.paused) {
        audio.volume = 1.0;
        audio.play();
        if (btn) btn.classList.remove('paused');
    } else {
        audio.pause();
        if (btn) btn.classList.add('paused');
    }
}

/// ===== LLUVIA DE FOTOS =====

const misFotos = [
    'fotos/foto1.jpg',
    'fotos/foto2.jpg',
    'fotos/foto3.JPG',   
    'fotos/foto4 (2).jpg',
    'fotos/foto5.jpg',  
    'fotos/foto6.jpg',  
    'fotos/foto7 (2).jpg',
    'fotos/foto8.jpeg',
    'fotos/foto9.jpg',
    'fotos/foto10.jpeg',
    'fotos/foto11.jpg',
    'fotos/foto12.jpg',
    'fotos/foto13.jpg',
    'fotos/foto14.jpeg',
    'fotos/foto15 (2).jpeg',
    'fotos/foto16.jpeg',
    'fotos/foto17.jpeg',
    'fotos/foto18.jpeg',
    'fotos/foto19.jpeg',
    'fotos/foto20.jpeg',
    'fotos/foto21.jpeg'
];

let photoIndex = 0; // Llleva el control de cuál foto toca tirar
let photoInterval = null;

function crearFotoCayendo() {
    if (misFotos.length === 0) return;

    // Cambia 'page-love' por 'page-message' si prefieres que caigan en la carta
    const container = document.getElementById('page-message');
    if (!container) return;

    const img = document.createElement('img');
    
    // Selecciona la foto según el orden actual
    img.src = misFotos[photoIndex];
    
    // Avanza a la siguiente foto (al llegar a la última, vuelve a la primera)
    photoIndex = (photoIndex + 1) % misFotos.length;

    img.className = 'foto-cayendo';
    
    // Posición horizontal aleatoria
    img.style.left = (Math.random() * 75 + 5) + 'vw';
    
    // Caída suave de entre 6 y 8 segundos
    const duration = Math.random() * 3 + 6;
    img.style.animationDuration = duration + 's';

    container.appendChild(img);

    // Borra la foto del HTML cuando termina de caer
    setTimeout(() => {
        img.remove();
    }, duration * 1000);
}

function startPhotoRain() {
    if (photoInterval) return;
    crearFotoCayendo();
    photoInterval = setInterval(crearFotoCayendo, 1000); // Crea una foto nueva cada 1.8 segundos
}

function stopPhotoRain() {
    if (photoInterval) {
        clearInterval(photoInterval);
        photoInterval = null;
    }
    // Elimina las fotos que hayan quedado a la mitad si cambias de página
    document.querySelectorAll('.foto-cayendo').forEach(img => img.remove());
}

const fechaInicio = new Date(2024, 11, 9, 20, 3, 9); 

function actualizarContador() {
    const ahora = new Date();
    const diferencia = ahora - fechaInicio;

    if (diferencia < 0) return;

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diferencia / 1000 / 60) % 60);
    const segundos = Math.floor((diferencia / 1000) % 60);

    const timerElement = document.getElementById('time-counter');
    if (timerElement) {
        timerElement.innerHTML = `✨ Llevamos juntos: <b>${dias}</b> días, <b>${horas}</b>h <b>${minutos}</b>m <b>${segundos}</b>s ✨`;
    }
}

// Se mantiene calculando cada segundo
setInterval(actualizarContador, 1000);

// ===== NAVEGACIÓN Y ACCIÓN DE LA FLOR =====

function showMessage() {
    playAudio();

    const loading = document.getElementById('loading');
    const flower = document.querySelector('.flower');
    const instruction = document.querySelector('.instruction');
    
    if (loading && flower && instruction) {
        // Ocultamos el texto de instrucción
        instruction.style.opacity = '0';
        
        // Desactivamos clics en la flor
        flower.style.pointerEvents = 'none';
        
        // Añadimos la clase para animar la flor con el clic
        flower.classList.add('animar-flor');
        
        // Mostramos "Cargando..."
        loading.classList.add('show');
        
        // Espera 2.5s mientras sale la animación y "Cargando"
        setTimeout(() => {
            showPage('page-message'); // Cambia a la pantalla del mensaje
            
            setTimeout(() => {
                // Preparamos la pantalla y arrancamos texto + fotos a la vez
                i = 0;
                const textElement = document.getElementById("typing-text");
                const cursor = document.getElementById("cursor");
                if (textElement) textElement.innerHTML = '';
                if (cursor) cursor.style.opacity = '1';

                startContinuousSparkles();
                startPhotoRain(); 
                typeWriter();     
            }, 300);
        }, 2500);
    }
}

// ===== FUNCIONALIDAD GENERAL =====

// Variables para el control de páginas
let currentPage = 'page-flower';

// Función para cambiar de página
function showPage(pageId) {
    // Ocultar página actual
    const currentPageElement = document.getElementById(currentPage);
    if (currentPageElement) {
        currentPageElement.classList.remove('active');
    }
    
    // Mostrar nueva página
    const newPageElement = document.getElementById(pageId);
    if (newPageElement) {
        newPageElement.classList.add('active');
        currentPage = pageId;
    }
}

// Función para ir a la página "Te amo"
function showLovePage() {
    stopPhotoRain(); // Detenemos la lluvia al ir a la pantalla del corazón
    showPage('page-love');
    
    // Resetear el contador de typing para "Te amo"
    loveI = 0;
    const loveTypingText = document.getElementById('love-typing-text');
    const loveCursor = document.getElementById('love-cursor');
    const heartPath = document.getElementById('heart-path');
    
    if (loveTypingText) loveTypingText.innerHTML = '';
    if (loveCursor) loveCursor.style.opacity = '1';
    if (heartPath) heartPath.style.animation = 'none';
    
    // Iniciar el typing después de un pequeño delay
    setTimeout(() => {
        loveTypeWriter();
    }, 800);
}

// Función para ir de vuelta a la página principal (no se usa ahora, pero por si acaso)
function goBack() {
    stopPhotoRain();
    showPage('page-flower');
    
    // Resetear estados de la página principal
    setTimeout(() => {
        const loading = document.getElementById('loading');
        const instruction = document.querySelector('.instruction');
        const flower = document.querySelector('.flower');
        
        if (loading) loading.classList.remove('show');
        if (instruction) instruction.style.opacity = '1';
        if (flower) flower.style.pointerEvents = 'auto';
        
        // Resetear el typing text para la próxima vez
        const typingText = document.getElementById('typing-text');
        const cursor = document.getElementById('cursor');
        if (typingText) typingText.innerHTML = '';
        if (cursor) cursor.style.opacity = '1';
        i = 0; // Reset typing counter
    }, 100);
}

// ===== FUNCIONALIDAD DE LA PÁGINA DE MENSAJE =====

// Variables para el efecto de typing
const message = "Feliz mesiversario mi niña.\n\nComo no puedo estar el día de hoy contigo, queria hacerte este pequeño detallito.\n\n Te quiero mucho cariño y tengo muchas ganas de verte.";
const loveMessage = "Te amo Emma, de tu novio ingeniero favorito";
let i = 0;
let loveI = 0;
const typingSpeed = 60;
const loveTypingSpeed = 150;

// Función para crear brillitos profesionales
function createSparkles() {
    const sparklesContainer = document.getElementById('sparkles');
    if (!sparklesContainer) return;
    
    // Crear 15 brillitos
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            
            // Posición aleatoria
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.animationDelay = Math.random() * 4 + 's';
            
            sparklesContainer.appendChild(sparkle);
            
            // Remover el brillito después de la animación
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 4000);
        }, i * 300); // Crear un brillito cada 300ms
    }
}

// Función para el efecto de typing de "Te amo"
function loveTypeWriter() {
    const textElement = document.getElementById("love-typing-text");
    const cursor = document.getElementById("love-cursor");
    
    if (!textElement || !cursor) return;
    
    if (loveI < loveMessage.length) {
        textElement.innerHTML += loveMessage.charAt(loveI);
        loveI++;
        setTimeout(loveTypeWriter, loveTypingSpeed);
    } else {
        // Hide cursor when typing is complete
        setTimeout(() => {
            cursor.style.opacity = "0";
            // Iniciar animación del corazón después del typing
            setTimeout(() => {
                const heartPath = document.getElementById('heart-path');
                if (heartPath) {
                    heartPath.style.animation = 'drawHeart 3s ease-in-out forwards';
                }
            }, 500);
        }, 1000);
    }
}

// Función para el efecto de typing del mensaje principal
function typeWriter() {
    const textElement = document.getElementById("typing-text");
    const cursor = document.getElementById("cursor");
    
    if (!textElement || !cursor) return;
    
    if (i < message.length) {
        if (message.charAt(i) === '\n') {
            textElement.innerHTML += '<br>';
        } else {
            textElement.innerHTML += message.charAt(i);
        }
        i++;
        setTimeout(typeWriter, typingSpeed);
    } else {
        // Hide cursor when typing is complete
        cursor.style.opacity = "0";
        // Show back button
        setTimeout(() => {
            const backBtn = document.querySelector('.back-btn');
            if (backBtn) {
                backBtn.style.opacity = "1";
                backBtn.style.transform = "translateX(-50%) translateY(0)";
            }
        }, 500);
    }
}

// Función para inicializar los brillitos continuos
function startContinuousSparkles() {
    createSparkles();
    // Crear nuevos brillitos cada 5 segundos
    setInterval(createSparkles, 5000);
}

// ===== INICIALIZACIÓN =====

// Inicialización cuando se carga la página
window.addEventListener('load', () => {
    // Asegurar que la página de la flor esté activa al inicio
    showPage('page-flower');
});