document.addEventListener('DOMContentLoaded', () => {

    const mensajeContenedor = document.getElementById('contenedor-mensajes');

    const btnAgregarParticipante = document.getElementById('agregar-participante');
    
    btnAgregarParticipante.addEventListener('click', () => {
        const nombre = document.getElementById('participante-nombre').value.trim();
        const dni = document.getElementById('documento-participante').value.trim();

        if (!nombre || !dni) {
            mostrarMensajeValidacion('Por favor, complete ambos campos (Nombre y Documento).', mensajeContenedor);
            return;
        }

        if(dni.length != 8){
            mostrarMensajeValidacion('El DNI debe tener 8 dígitos.', mensajeContenedor);
            return;
        }

        // Cargar los participantes previamente guardados en localStorage
        let participantes = JSON.parse(localStorage.getItem('participantes')) || [];


        const existeDni = participantes.some(participante => participante.dni === dni);
        if (existeDni) {
            mostrarMensajeValidacion('El documento ya ha sido registrado. Por favor, utiliza un documento diferente.', mensajeContenedor);
            return;
        }

        // Si el DNI no está repetido, agrega el participante
        const participante = { nombre, dni };
        participantes.push(participante);

        localStorage.setItem('participantes', JSON.stringify(participantes));

        document.getElementById('participante-nombre').value = '';
        document.getElementById('documento-participante').value = '';
        // Notificamos a index.html que debe actualizar la lista
        window.dispatchEvent(new Event('storage'));
  
        // Almacenamos en localStorage que un participante fue agregado y luego en index.js los cargamos
        const eventoNombre = localStorage.getItem('nombreEvento');
        localStorage.setItem('nuevoParticipante', JSON.stringify({ nombre, dni, evento: eventoNombre }));

        mostrarOverlay("Participante agregado correctamente")
    });

    function mostrarMensajeValidacion(mensaje, contenedor){
        //Limpiar mensajes previos
        contenedor.innerHTML='';

        const mensajeValidacion = document.createElement('p');

        mensajeValidacion.textContent = mensaje;
        mensajeValidacion.style.color= 'red';

        contenedor.appendChild(mensajeValidacion);

        // Cerrar el mensaje automáticamente después de 3 segundos
        setTimeout(() => {
            contenedor.removeChild(mensajeValidacion);
        }   , 3000); // 3000 milisegundos = 3 segundos

    }

    function mostrarOverlay(mensaje) {
        const overlay = document.getElementById('overlay-global');
        const mensajeElemento = document.getElementById('mensaje-overlay');

        mensajeElemento.textContent = mensaje;  // Asignar el mensaje al overlay
        overlay.style.display = 'flex';  // Mostrar el overlay
    }

    // Función para ocultar el overlay
    function ocultarOverlay() {
        const overlay = document.getElementById('overlay-global');
        overlay.style.display = 'none';  // Ocultar el overlay
    }

    // Botón de cerrar el overlay
    document.getElementById('btn-cerrar-overlay-global').addEventListener('click', ocultarOverlay);
});
