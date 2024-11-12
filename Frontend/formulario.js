document.addEventListener('DOMContentLoaded', () => {

    // Capturamos el evento de clic en el botón de agregar participante
    const btnAgregarParticipante = document.getElementById('agregar-participante');
    
    btnAgregarParticipante.addEventListener('click', () => {
        const nombre = document.getElementById('participante-nombre').value.trim();
        const dni = document.getElementById('documento-participante').value.trim();

        if (!nombre || !dni) {
            alert('Por favor, complete ambos campos (Nombre y Documento).');
            return;
        }

        // Cargar los participantes previamente guardados en localStorage
        let participantes = JSON.parse(localStorage.getItem('participantes')) || [];

        // Comprobar si el DNI ya existe en los participantes
        const existeDni = participantes.some(participante => participante.dni === dni);
        if (existeDni) {
            alert('El documento ya ha sido registrado. Por favor, utiliza un documento diferente.');
            return;
        }

        // Si el DNI no está repetido, agregar el participante
        const participante = { nombre, dni };
        participantes.push(participante);

        // Guardar los participantes en localStorage
        localStorage.setItem('participantes', JSON.stringify(participantes));

        // Limpiar los campos del formulario
        document.getElementById('participante-nombre').value = '';
        document.getElementById('documento-participante').value = '';

        // Notificamos a index.html que debe actualizar la lista
        window.dispatchEvent(new Event('storage'));

        // Actualizar la lista en index.html (esto es opcional y depende de la lógica que implementes en el otro archivo)
        // Almacenamos en localStorage que un participante fue agregado y luego en index.js los cargamos
        const eventoNombre = localStorage.getItem('nombreEvento');  // Opcional si quieres asociarlo a un evento
        localStorage.setItem('nuevoParticipante', JSON.stringify({ nombre, dni, evento: eventoNombre }));
    });
});
