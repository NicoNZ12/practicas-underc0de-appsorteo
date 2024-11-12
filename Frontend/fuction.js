document.addEventListener('DOMContentLoaded', () => {



    // VARIABLES PARA MANEJAR LAS SECCIONES

    const btnEvento = document.getElementById('fomr-evento');
    const btnParticipantes = document.getElementById('form-registro-participantes');
    const btnLista = document.getElementById('form-lista-participantes');
    const btnPremios = document.getElementById('form-pemios-sponsor');
    const btnGuardar = document.getElementById('guardar-datos-premios-sponsor');
    const btnReiniciar = document.getElementById('reinicar-pagina-completa');
    const btnSorteo = document.getElementById("btn-sorteo");

    const seccionNombre = document.getElementById('seccion-nombre');
    const seccionParticipantes = document.getElementById('seccion-participantes');
    const listaParticipantes = document.getElementById('lista');
    const seccionPremios = document.getElementById('premios');
    const mensajeContenedor = document.getElementById('mensaje-contenedor');
    const seccionSorteo = document.getElementById("realizar-sorteo");

    let premioCount = 0; // Contador para los premios

    // Define la función toggleSection aquí
    function toggleSection(section) {
        const allSections = [seccionNombre, seccionParticipantes, listaParticipantes, seccionPremios, seccionSorteo];
        allSections.forEach(s => s.style.display = 'none'); // Ocultar todas las secciones
        section.style.display = 'block'; // Mostrar la sección seleccionada
    }



    
    // QR

    // ABRIR QR
    const abrirQrBtn = document.querySelector('.qr');
    const overlayQr = document.querySelector('.overlay');
    const cerrarQrBtn = document.querySelector('.cerrar-qr');
    const qrCodeContainer = overlayQr.querySelector('.qr-code-container');
    const qrUrl = 'formulario.html'; // URL relativa a formulario.html

    abrirQrBtn.addEventListener('click', () => {
        // Limpiar cualquier contenido previo en el contenedor del QR
        qrCodeContainer.innerHTML = ''; 

        // Crear un enlace para envolver la imagen del QR
        const linkElement = document.createElement('a');
        linkElement.href = qrUrl; // Enlace hacia el formulario.html
        linkElement.target = '_blank'; // Opcional: abrir en una nueva pestaña

        // Generar el código QR y agregar la imagen dentro del enlace
        $(qrCodeContainer).qrcode({
            text: qrUrl, // URL que debe almacenar el QR
            width: 256,  // Ancho del QR
            height: 256, // Alto del QR
            render: 'canvas', // Usamos canvas para asegurarnos de que la imagen se genere
            ecLevel: 'L',  // Nivel de corrección de errores (opcional)
            minVersion: 1, // Versión mínima del QR (opcional)
            background: '#ffffff',  // Fondo blanco para el QR
            foreground: '#000000',  // Color del código QR (negro)
            quietZone: 4 // Tamaño de la zona tranquila alrededor del QR (opcional)
        });

        // Esperar que se haya generado el QR (esto es una función síncrona, por lo que podemos hacer esto inmediatamente después)
        const qrImage = qrCodeContainer.querySelector('canvas'); // Obtenemos el elemento <canvas> generado por qrcode.js
        if (qrImage) {
            linkElement.appendChild(qrImage); // Añadimos el <canvas> al enlace
        }

        // Limpiar el contenedor y agregar el enlace con la imagen del QR
        qrCodeContainer.appendChild(linkElement);  // Insertar el enlace con la imagen QR

        // Mostrar el overlay con el QR
        overlayQr.style.display = 'flex'; // Mostrar el overlay
    });

    // Cerrar el QR
    cerrarQrBtn.addEventListener('click', () => {
        overlayQr.style.display = 'none'; // Ocultar el overlay
    });






    //GUARDAR LOS DATOS AL ACTUALIZAR

    // Agregar evento al botón "Guardar Datos"
    btnGuardar.addEventListener('click',() => {
        guardarDatos(); //LLamo a la función de guardar los datos

        guardarPremiosYSponsors()

        //Mostrar el mensaje
        const mensaje = document.createElement('p');
        mensaje.textContent = `Datos guardados del sorteo "${localStorage.getItem('nombreEvento')}"`;

        //Evitar duplicados si el mensaje está en pantalla
        if(!document.body.contains(document.getElementById('mensaje-guardado'))){
            mensaje.id = 'mensaje-guardado';
            mensajeContenedor.appendChild(mensaje);
        }
        // Mostrar la sección de "Realizar Sorteo" solo si está oculta
        if (seccionSorteo.style.display === 'none') {
            seccionSorteo.style.display = 'block';
        }
    });

    //Boton realizar Sorteo
    btnSorteo.addEventListener('click', async ()=>{
        try{
            const response = await fetch("http://localhost:8080/evento/sorteo", {
                method: 'POST',
            });
            const datos = await response.json();
            console.log(datos); //ganadores
        }catch(error){
            console.error("Error al generar el sorteo");
        }
    });







   // CARGAR DATOS AL ACTUALIZAR
    function cargarDatos() {
        const activeSection = localStorage.getItem('activeSection') || 'nombre'; // Cargar sección activa o 'nombre' por defecto
        switch (activeSection) {
            case 'participantes':
                toggleSection(seccionParticipantes);
                break;
            case 'lista':
                toggleSection(listaParticipantes);
                break;
            case 'premios':
                toggleSection(seccionPremios);
                break;
            default:
                toggleSection(seccionNombre);
        }

        const nombreEvento = localStorage.getItem('nombreEvento'); // Obtener el nombre del evento
        if (nombreEvento) {
            document.getElementById('evento-display').textContent = `EVENTO: "${nombreEvento}"`;
            document.getElementById('nombre-evento').value = nombreEvento;
        }

        const participantes = JSON.parse(localStorage.getItem('participantes')) || [];
        const lista = document.getElementById('lista-participantes');
        lista.innerHTML = ''; // Limpiar la lista antes de agregar
        participantes.forEach(({ nombre, dni }) => {
            const nombreEvento = localStorage.getItem('nombreEvento'); // Obtener el nombre del evento
            agregarAParticipantes(nombre, dni, nombreEvento); // Pasar el nombre del evento
        });
        const premios = JSON.parse(localStorage.getItem('premiosYSponsors')) || [];
        premioCount = premios.length; 
        generarCamposPremios(premioCount); 

        // Rellenar los campos con datos guardados
        premios.forEach((premio, index) => {
            const premiosRows = document.querySelectorAll('.premios-row');
            const premioInput = premiosRows[index].querySelector('.columna-premios input');
            const sponsorInput = premiosRows[index].querySelector('.columna-patrocinadores input');
            if (premioInput && sponsorInput) {
                premioInput.value = premio.premio;
                sponsorInput.value = premio.sponsor;
            }
        });
    }
    




    // Cambiar la función de agregar premio
    document.getElementById('agregar-premio').addEventListener('click', () => {
        const nombreEvento = localStorage.getItem('nombreEvento');
        if (!nombreEvento) {
            alert('Por favor, primero ingresa el nombre del evento.');
            return;
        }
        
        premioCount++; // Incrementa el contador
        generarCamposPremios(premioCount); // Genera un nuevo premio
    });
    










    // GUARDAR DATOS AL HACER CLIC EN EL BOTÓN
    function guardarDatos() {
        const nombreEvento = document.getElementById('nombre-evento').value.trim();
        localStorage.setItem('nombreEvento', nombreEvento);
    
        const participantes = [];
        const lista = document.getElementById('lista-participantes').children;
        for (let li of lista) {
            const text = li.firstChild.nodeValue;
            const [nombre, dni] = text.split(' - ');
            participantes.push({ nombre, dni: dni.trim(), evento: nombreEvento }); // Agregar el evento
        }
        localStorage.setItem('participantes', JSON.stringify(participantes));
    
        const premios = [];
        const premiosRows = document.querySelectorAll('.premios-row');
        premiosRows.forEach(row => {
            const premio = row.querySelector('.columna-premios input').value.trim();
            const sponsor = row.querySelector('.columna-patrocinadores input').value.trim();
            premios.push({ premio, sponsor });
        });

        localStorage.setItem('premiosYSponsors', JSON.stringify(premios));
    }
    










    // PREMIOS Y SPONSOR


    // Función para generar campos de premios y patrocinadores
    function generarCamposPremios(cantidad) {
        const premiosContainer = document.getElementById('premios-container');

        // Solo agrega un nuevo campo si ya hay campos existentes
        const currentRows = premiosContainer.querySelectorAll('.premios-row').length;

        for (let i = currentRows; i < cantidad; i++) {
            const premiosRow = document.createElement('div');
            premiosRow.classList.add('premios-row');

            // Columna de premios
            const columnaPremios = document.createElement('div');
            columnaPremios.classList.add('columna-premios');
            const labelPremio = document.createElement('label');
            labelPremio.textContent = `${i + 1}° Premio`;
            const inputPremio = document.createElement('input');
            inputPremio.type = 'text';
            inputPremio.placeholder = `Descripción del ${i + 1}° premio`;

            columnaPremios.appendChild(labelPremio);
            columnaPremios.appendChild(inputPremio);

            // Columna de patrocinadores (sponsors)
            const columnaPatrocinadores = document.createElement('div');
            columnaPatrocinadores.classList.add('columna-patrocinadores');
            const labelSponsor = document.createElement('label');
            labelSponsor.textContent = `Sponsor ${i + 1}°`;
            const inputSponsor = document.createElement('input');
            inputSponsor.type = 'text';
            inputSponsor.placeholder = `Nombre del sponsor ${i + 1}`;

            columnaPatrocinadores.appendChild(labelSponsor);
            columnaPatrocinadores.appendChild(inputSponsor);

            // Botón de eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = '❌';
            btnEliminar.style.border = "none";
            btnEliminar.style.cursor = "pointer";
            btnEliminar.style.background = "none";
            btnEliminar.onclick = () => {
                premiosContainer.removeChild(premiosRow);
                premioCount--; // Disminuye el contador
            };

            // Agregar las columnas y el botón de eliminación a la fila
            premiosRow.appendChild(columnaPremios);
            premiosRow.appendChild(columnaPatrocinadores);
            premiosRow.appendChild(btnEliminar);

            // Agregar la fila al contenedor de premios
            premiosContainer.appendChild(premiosRow);
        }

    }

    async function guardarPremiosYSponsors() {
        const premiosContainer = document.getElementById('premios-container');
        const premios = [];
        

        premiosContainer.querySelectorAll('.premios-row').forEach(row => {
            const descripcion = row.querySelector('.columna-premios input').value.trim();
            const sponsor = row.querySelector('.columna-patrocinadores input').value.trim();
        

            if (descripcion && sponsor) {
                premios.push({ descripcion, sponsor });
            }
        });
        
        // Verifica si hay premios para enviar
        if (premios.length === 0) {
            alert('Por favor, complete al menos un premio y patrocinador.');
            return;
        }
        
        let todosGuardadosCorrectamente = true; 
        
        // Enviar cada premio de manera individual
        for (const premio of premios) {
            try {
                const response = await fetch("http://localhost:8080/premio", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(premio)
                });
        
                if (!response.ok) {
                    todosGuardadosCorrectamente = false; 
                    const errorData = await response.text(); 
                    alert(errorData.message || "Error al guardar un premio.");
                    console.error("Error al guardar premio:", errorData.message);
                }
            } catch (error) {
                todosGuardadosCorrectamente = false;
                console.error("Error de conexión con la API:", error);
                alert('Hubo un problema al conectar con el servidor.');
            }
        }
    
        // Si todos los premios se guardaron correctamente, muestra la alerta una sola vez
        if (todosGuardadosCorrectamente) {
            alert("Premios y sponsors guardados exitosamente.");
        }
    }
    
    










    // MOSTRAR LA SECCION AL HACER CLICK EN EL MENU DE BOTONES


    // Event listeners para mostrar/ocultar secciones
    btnEvento.addEventListener('click', () => {
        toggleSection(seccionNombre);
        localStorage.setItem('activeSection', 'nombre'); // Guardar sección activa
        cargarDatos();
    });
    btnParticipantes.addEventListener('click', () => {
        toggleSection(seccionParticipantes);
        localStorage.setItem('activeSection', 'participantes'); // Guardar sección activa
        cargarDatos();
    });
    btnLista.addEventListener('click', () => {
        toggleSection(listaParticipantes);
        localStorage.setItem('activeSection', 'lista'); // Guardar sección activa
    });
    btnPremios.addEventListener('click', () => {
        toggleSection(seccionPremios);
        localStorage.setItem('activeSection', 'premios'); // Guardar sección activa
    });


    // AGREGAR PARTICIPANTE DE FORMA MANUAL

    const documentosAgregados = [];

    async function agregarParticipanteManual() {
        const nombre = document.getElementById('nombre-participante').value.trim();
        const dni = document.getElementById('dni').value.trim();


    
        if (!nombre || !dni) {
            alert('Por favor, complete ambos campos (Nombre y Documento).');
            return;
        }

        if (documentosAgregados.includes(dni)) {
            alert('El documento ya ha sido registrado. Por favor, utiliza un documento diferente.');
            return;
        }

        if(dni.length != 8){
            alert("El DNI debe tener 8 digitos");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/participante/agregar-participante", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nombre, dni })
            });
    
            if (response.ok) {
                const data = await response.json();
                agregarAParticipantes(nombre, dni);
                documentosAgregados.push(dni);
                alert(data.message || `Participante agregado: ${data.nombre} (${data.dni})`);
                
                // Limpiar campos
                document.getElementById('nombre-participante').value = '';
                document.getElementById('dni').value = '';
                guardarDatos();
            } else {
                const errorMessage = await response.json();
                alert(errorMessage.message);
                console.error("Error al agregar el participante:", errorMessage);
            }
        } catch (error) {
            console.error("Error de conexión con la API:", error);
            alert('Hubo un problema al conectar con el servidor.');
        }
    }


    function agregarAParticipantes(nombre, dni) {
        const lista = document.getElementById('lista-participantes');

        // Crear un nuevo elemento de lista
        const li = document.createElement('li');
        li.textContent = `${nombre} - ${dni}`; // Añadir solo el nombre y DNI

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = '❌';
        btnEliminar.onclick = function() {
        eliminarParticipante(li, dni);
        };

        li.appendChild(btnEliminar); // Agregar el botón de eliminación
        lista.appendChild(li);
    }

    document.getElementById('btn-agregar').addEventListener('click', agregarParticipanteManual);














    //GUARDAR EL NOMBRE DEL EVENTO 
    document.getElementById('btn-ingresar').addEventListener('click', async () => {
        const nombreEvento = document.getElementById('nombre-evento').value.trim();
        if (!nombreEvento) {
            alert('Por favor, ingrese el nombre del evento.');
            return;
        }
        try {
            const response = await fetch("http://localhost:8080/evento", { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({nombre: nombreEvento}) 
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

        localStorage.setItem('nombreEvento', nombreEvento);
        cargarDatos(); // Cargar datos para mostrar el nombre del evento
        toggleSection(seccionParticipantes); // Cambiar a la sección de participantes
    });














    // ELIMINAR PARTICIPANTES
    function eliminarParticipante(participante, dni) {
        const lista = document.getElementById('lista-participantes');
        lista.removeChild(participante);

        // Eliminar el documento del array
        const index = documentosAgregados.indexOf(dni);
        if (index !== -1) {
            documentosAgregados.splice(index, 1);
        }
        guardarDatos(); // Guardar datos al eliminar participante
    }











    // REINICIAR SORTEO Y PÁGINA ENTERA
    btnReiniciar.addEventListener('click', () => {
        localStorage.removeItem('nombreEvento');
        localStorage.removeItem('participantes');
        localStorage.removeItem('premiosYSponsors');
        localStorage.removeItem("nuevoParticipante")

        // Guardar en localStorage que debe desplazarse a la sección de "Nombre del Evento"
        localStorage.setItem('redirigirNombreEvento', 'true');

        location.reload(); // Recargar la página para reiniciar
    });

    // Cargar datos al inicio
    cargarDatos();






    // Escuchar el evento 'storage' para actualizar la lista de participantes
window.addEventListener('storage', cargarDatos);



});
