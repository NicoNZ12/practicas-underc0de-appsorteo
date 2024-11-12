document.addEventListener('DOMContentLoaded', () => {

    // Capturamos el evento de clic en el botón de agregar participante
    const btnAgregarParticipante = document.getElementById('agregar-participante');
    
    btnAgregarParticipante.addEventListener('click', async () => {
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

        if(dni.length != 8){
            alert("El DNI debe tener 8 digitos");
            return;
        }

        const participante = { nombre, dni };
        
        try {
            const response = await fetch("http://localhost:8080/participante/agregar-participante", { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(participante)
            });

            if (response.ok) {
                const data = await response.json();
                alert('Participante agregado exitosamente');
                console.log('Participante agregado:', data);

                // Solo actualizar localStorage si la respuesta fue exitosa
                participantes.push(participante);
                localStorage.setItem('participantes', JSON.stringify(participantes));

                document.getElementById('participante-nombre').value = '';
                document.getElementById('documento-participante').value = '';

                window.dispatchEvent(new Event('storage'));

                const eventoNombre = localStorage.getItem('nombreEvento');
                localStorage.setItem('nuevoParticipante', JSON.stringify({ nombre, dni, evento: eventoNombre }));
            } else {
                console.log("Error al agregar participante:", response.statusText);
                alert('Error al agregar el participante');
            }
        } catch (error) {
            console.error("Error de conexión con la API:", error);
            alert('Hubo un problema al conectar con el servidor.');
        }
    });
});
