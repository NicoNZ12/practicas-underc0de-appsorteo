document.addEventListener('DOMContentLoaded', () => {
    // AGREGAR INPUT A MEDIDA QUE AUMENTAMOS LA CANTIDAD DE GANADORES
    const cantidadGanadoresInput = document.querySelector('.cant-ganad');
    const premiosContainer = document.querySelector('.columna-premios');
    const patrocinadoresContainer = document.querySelector('.columna-patrocinadores');

    // Inicializa con 1 ganador
    cantidadGanadoresInput.value = 1;
    updateFields(1);

    cantidadGanadoresInput.addEventListener('input', (event) => {
        const cantidad = Math.max(1, event.target.value); // Asegúrate de que sea al menos 1
        updateFields(cantidad);
    });

    function updateFields(cantidad) {
        // Limpiar campos existentes
        premiosContainer.innerHTML = '<h3>Premios</h3>';
        patrocinadoresContainer.innerHTML = '<h3>Patrocinadores</h3>';
        
        for (let i = 1; i <= cantidad; i++) {
            premiosContainer.innerHTML += `<label>${i}° Premio</label><input type="text">`;
            patrocinadoresContainer.innerHTML += `<label>Patrocinador ${i}°</label><input type="text">`;
        }
    }

    // AGREGAR NOMBRE DEL EVENTO
    const btnIngresar = document.getElementById('btn-ingresar');
    const nombreEventoInput = document.getElementById('nombre-evento');
    const eventoDisplay = document.querySelector('#lista p');

    btnIngresar.addEventListener('click', async() => {
        const nombreEvento = nombreEventoInput.value.trim();
        if (nombreEvento) {
            eventoDisplay.textContent = `EVENTO: " ${nombreEvento} "`;
            const eventoData = {
                nombre: nombreEvento
            };
    
            try {
                const response = await fetch("http://localhost:8080/evento", { 
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(eventoData) 
                });
    
                if (response.ok) {
                    const data = await response.json();
                    alert('Evento creado exitosamente');
                } else {
                    console.log("error: " + response.statusText)
                    alert('Error al crear el evento');
                }

            } catch (error) {
                console.error("Error de conexión con la api:", error);
            } 
        } else {
            alert("Por favor, ingresa un nombre para el evento.");
        }
    });

    // ABRIR QR
    const abrirQrBtn = document.querySelector('.qr');
    const overlayQr = document.querySelector('.overlay');
    const cerrarQrBtn = document.querySelector('.cerrar-qr');
    const qrCodeContainer = overlayQr.querySelector('.qr-code-container');

    abrirQrBtn.addEventListener('click', () => {
        qrCodeContainer.innerHTML = ''; // Limpiar contenido anterior

        // Generar el QR con el texto "Placeholder"
        $(qrCodeContainer).qrcode({
            text: 'Placeholder',
            width: 256,
            height: 256
        });

        overlayQr.style.display = 'flex'; // Mostrar el overlay
    });

    cerrarQrBtn.addEventListener('click', () => {
        overlayQr.style.display = 'none'; // Ocultar el overlay
    });










    // Array para almacenar los documentos de participantes ya agregados
    const documentosAgregados = [];

    // AGREGAR PARTICIPANTE MANUAL
    async function agregarParticipanteManual() {
        const nombre = document.getElementById('nombre-participante').value.trim();
        const dni = document.getElementById('dni').value.trim();
        
        if (!nombre || !dni) {
            alert('Por favor, complete ambos campos (Nombre y Documento).');
            return;
        }

        // Verificar si el documento ya fue agregado
        if (documentosAgregados.includes(dni)) {
            alert('El documento ya ha sido registrado. Por favor, utiliza un documento diferente.');
            return;
        }

        const participanteData = {
            nombre: nombre,
            dni: dni
        };

        try{
            const response = await fetch("http://localhost:8080/participante/agregar-participante", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(participanteData)
            });

            if (response.ok) {
                const data = await response.json();
                alert('Participante agregado exitosamente');

                const lista = document.getElementById('lista-participantes');
        
                // Crear un nuevo elemento de lista
                const li = document.createElement('li');
                li.textContent = `${nombre} - ${dni}`;
                
                // Crear botón de eliminar
                const btnEliminar = document.createElement('button');
                btnEliminar.textContent = '❌';
                btnEliminar.onclick = function() {
                    eliminarParticipante(li, dni);
                };
                
                li.appendChild(btnEliminar);
                lista.appendChild(li);
                
                // Agregar el documento al array
                documentosAgregados.push(dni);
                
                // Limpiar los campos de entrada
                document.getElementById('nombre-participante').value = '';
                document.getElementById('dni').value = '';

            }else{
                console.error("Error al agregar el participante:" + response.statusText);
                alert("Error al agregar el participante");
            }    
        }catch(error){
            console.error("Error de conexión con la api:", error);
        }
    }

    function eliminarParticipante(participante, dni) {
        const lista = document.getElementById('lista-participantes');
        lista.removeChild(participante);
        
        // Eliminar el documento del array
        const index = documentosAgregados.indexOf(dni);
        if (index !== -1) {
            documentosAgregados.splice(index, 1);
        }
    }

    // Añadir el event listener para agregar participante
    document.getElementById('btn-agregar').addEventListener('click', agregarParticipanteManual);









});
