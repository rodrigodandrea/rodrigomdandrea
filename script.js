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