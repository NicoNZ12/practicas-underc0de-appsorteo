document.addEventListener('DOMContentLoaded', () => {

    const btnAgregarParticipante = document.getElementById('agregar-participante');
    
    btnAgregarParticipante.addEventListener('click', () => {
        const nombre = document.getElementById('participante-nombre').value.trim();
        const dni = document.getElementById('documento-participante').value.trim();

        if (!nombre || !dni) {
            alert('Por favor, complete ambos campos (Nombre y Documento).');
            return;
        }

        if(dni.length != 8){
            alert('El DNI debe tener 8 dígitos.');
            return;
        }

        // Cargar los participantes previamente guardados en localStorage
        let participantes = JSON.parse(localStorage.getItem('participantes')) || [];


        const existeDni = participantes.some(participante => participante.dni === dni);
        if (existeDni) {
            alert('El documento ya ha sido registrado. Por favor, utiliza un documento diferente.');
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

        alert("Participante agregado correctamente")
    });
});
