// 1. Seleccionamos todos los elementos que queremos animar
const elementos = document.querySelectorAll('.timeline-element');

// 2. Definimos las opciones (cuando el 10% del elemento se vea, dispara la acción)
const opciones = {
    threshold: 0.1
};

// 3. El Observador
const observador = new IntersectionObserver((entradas, observador) => {
    entradas.forEach(entrada => {
        if (!entrada.isIntersecting) {
            return; // Si no está en pantalla, no hacemos nada
        }
        // Si está en pantalla, le agregamos la clase "visible"
        entrada.target.classList.add('visible');
        
        // Opcional: Dejar de observar una vez que ya apareció (para que no parpadee si subes y bajas)
        observador.unobserve(entrada.target); 
    });
}, opciones);

// 4. Le decimos al observador que vigile a cada tarjeta
elementos.forEach(elemento => {
    observador.observe(elemento);
});


// --- LÓGICA DE FILTROS ---

// 1. Seleccionamos botones y tarjetas
const filterBtns = document.querySelectorAll('.filter-btn');
const timelineItems = document.querySelectorAll('.timeline-element');

// 2. Agregamos el evento "click" a cada botón
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        
        // A. Cambiar estilo visual del botón (quitar active al anterior, poner al nuevo)
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // B. Leer qué categoría queremos ver
        const filterValue = btn.getAttribute('data-filter');

        // C. Variable "Bandera" para encontrar al primero
        let isFirstVisible = true;

        // D. Recorrer las tarjetas y mostrar/ocultar
        timelineItems.forEach(item => {
            // Limpiamos la clase especial antes de empezar
            item.classList.remove('first-visible');

            // Si el filtro es "all" O la tarjeta coincide con la categoría...
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                
                item.classList.remove('hide');
                
                // Pequeño truco: Reactivar la animación de entrada para que se vea bonito al aparecer
                item.classList.add('visible'); 

                // Si es el primero que encontramos en este ciclo...
                if (isFirstVisible) {
                    item.classList.add('first-visible'); // ¡Le ponemos la corrección de margen!
                    isFirstVisible = false; // Bajamos la bandera, los siguientes ya no son el primero
                }
                
            } else {
                // Si no coincide, ocultar
                item.classList.add('hide');
                item.classList.remove('visible'); // Quitamos visible para que si vuelves a "Todo", se anime de nuevo
            }
        });
    });
});

// Configuración de Particles.js
particlesJS("particles-js", {
  "particles": {
    "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
    "color": { "value": "#bdc3c7" }, /* Color de los puntos (Gris) */
    "shape": { "type": "circle" },
    "opacity": { "value": 0.5, "random": false },
    "size": { "value": 3, "random": true },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#bdc3c7", /* Color de las líneas */
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 2, /* Velocidad lenta y relajante */
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": { "enable": true, "mode": "grab" }, /* Efecto al pasar el mouse */
      "onclick": { "enable": true, "mode": "push" },
      "resize": true
    },
    "modes": {
      "grab": { "distance": 140, "line_linked": { "opacity": 1 } }
    }
  },
  "retina_detect": true
});

// --- LÓGICA PARA OCULTAR/MOSTRAR NAVBAR ---

// 1. Guardamos la posición inicial del scroll
let ubicacionPrincipal = window.pageYOffset;

// 2. Seleccionamos la barra de navegación (asegúrate que el selector coincida con tu CSS)
const navbar = document.querySelector("body > header > nav");

// 3. Escuchamos el evento de scroll
window.addEventListener('scroll', function() {
    // A. Detectamos dónde estamos ahora
    let desplazamientoActual = window.pageYOffset;

    // B. Comparamos: ¿Estamos más arriba o más abajo que antes?
    if (ubicacionPrincipal >= desplazamientoActual) {
        // SI SUBIMOS: Quitamos la clase para mostrar la barra
        navbar.classList.remove("nav-hidden");
    } else {
        // SI BAJAMOS: Agregamos la clase para esconder la barra
        navbar.classList.add("nav-hidden");
    }

    // C. Actualizamos la ubicación principal para la próxima comparación
    ubicacionPrincipal = desplazamientoActual;
});

// --- SCROLL INTELIGENTE: DINÁMICO SEGÚN LA BARRA ---

// CONFIGURACIÓN DE OFFSETS (ESPACIOS)
const offsetBajar = 20;   // Al bajar, la barra se va, así que no dejamos espacio extra.
const offsetSubir = 70;  // Al subir, la barra vuelve, dejamos espacio para que no tape el título.

// OTRAS CONFIGURACIONES
const snapZone = 150;    // Zona de "imán" cuando vienes desde abajo

// ESTADO
let isAutoScrolling = false;
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    if (isAutoScrolling) return;

    const currentScroll = window.scrollY;
    
    // SELECCIÓN DE ELEMENTOS
    const heroSection = document.querySelector('.hero');
    const timelineSection = document.querySelector('.timeline-filters') || document.querySelector('.timeline'); 

    if (!heroSection || !timelineSection) return;

    // Posición "cruda" del timeline (sin restar nada todavía)
    const rawTimelineTop = timelineSection.offsetTop;

    // --- LÓGICA DE DIRECCIÓN ---
    
    // 1. EL USUARIO ESTÁ BAJANDO (SCROLL DOWN) ▼
    if (currentScroll > lastScrollTop) {
        
        // Si estamos en el Hero y bajamos un poco...
        if (currentScroll > 100 && currentScroll < rawTimelineTop - 50) {
            
            // Usamos offsetBajar (0) porque la barra se esconderá
            performSmoothScroll(rawTimelineTop - offsetBajar);
        }
    } 
    
    // 2. EL USUARIO ESTÁ SUBIENDO (SCROLL UP) ▲
    else if (currentScroll < lastScrollTop) {
        
        // Calculamos el objetivo CON espacio para la barra
        const targetConBarra = rawTimelineTop - offsetSubir;

        // CASO A: Venimos del contenido y llegamos a los Filtros
        // Si estamos en la zona de snap (entre el objetivo y 200px más abajo)
        if (currentScroll > targetConBarra && currentScroll < (targetConBarra + snapZone)) {
            performSmoothScroll(targetConBarra);
        }

        // CASO B: Queremos volver al Hero
        // Si subimos más allá de la línea de los filtros
        if (currentScroll < (targetConBarra - 50)) { 
            performSmoothScroll(0);
        }
    }

    lastScrollTop = currentScroll;
});

// FUNCIÓN DE MOVIMIENTO SUAVE
function performSmoothScroll(targetY) {
    isAutoScrolling = true;
    
    window.scrollTo({
        top: targetY,
        behavior: 'smooth'
    });

    setTimeout(() => {
        isAutoScrolling = false;
        lastScrollTop = window.scrollY; 
    }, 600);
}