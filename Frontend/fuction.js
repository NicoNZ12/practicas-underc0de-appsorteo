document.addEventListener('DOMContentLoaded', () => {

    // VARIABLES PARA MANEJAR LAS SECCIONES

    const btnEvento = document.getElementById('fomr-evento');
    const btnParticipantes = document.getElementById('form-registro-participantes');
    const btnLista = document.getElementById('form-lista-participantes');
    const btnPremios = document.getElementById('form-pemios-sponsor');
    const btnGuardar = document.getElementById('guardar-datos-premios-sponsor');
    const btnReiniciar = document.getElementById('reinicar-pagina-completa');
    const btnSorteo = document.getElementById("btn-sorteo");
    const btnSeccionHistorial = document.getElementById("form-historial");
    const overlay = document.getElementById("overlay");
    const btnConfirmar = document.getElementById("btn-confirmar");
    const btnCancelar = document.getElementById("btn-cancelar");

    const seccionNombre = document.getElementById('seccion-nombre');
    const seccionParticipantes = document.getElementById('seccion-participantes');
    const listaParticipantes = document.getElementById('lista');
    const seccionPremios = document.getElementById('premios');
    const mensajeContenedor = document.getElementById('mensaje-contenedor');
    const seccionSorteo = document.getElementById("realizar-sorteo");
    const seccionHistorial = document.getElementById("historial");

    let premioCount = 1; // Contador para los premios

    // Define la función toggleSection aquí
    function toggleSection(section) {
        const allSections = [seccionNombre, seccionParticipantes, listaParticipantes, seccionPremios, seccionSorteo, seccionHistorial];
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



    //Boton realizar Sorteo
    btnSorteo.addEventListener('click', async () => {
        try {
            const response = await fetch("http://localhost:8080/evento/sorteo", {
                method: 'POST',
            });
            const datos = await response.json(); // Ganadores
            console.log(datos)

            // Mostrar los ganadores en el modal
            const ganadoresList = document.getElementById('ganadores-list');
            ganadoresList.innerHTML = ''; // Limpiar la lista de ganadores
            datos.forEach(ganador => {
                const li = document.createElement('li');
                li.textContent = ganador;
                ganadoresList.appendChild(li);
            });

            // Mostrar el modal
            const overlay = document.getElementById('overlay-ganadores');
            overlay.style.display = 'flex'; // Hacer visible el modal

        } catch (error) {
            console.error("Error al generar el sorteo");
        }
    });

    // Cerrar el modal cuando se hace clic en el reiniciar sorteo


    // REINICIAR SORTEO Y PÁGINA ENTERA
    btnReiniciar.addEventListener('click', () => {
        localStorage.removeItem('nombreEvento');
        localStorage.removeItem('participantes');
        localStorage.removeItem('premiosYSponsors');
        localStorage.removeItem("nuevoParticipante")

        // Guardar en localStorage que debe desplazarse a la sección de "Nombre del Evento"
        localStorage.setItem('redirigirNombreEvento', 'true');

        const overlay = document.getElementById('overlay-ganadores');
        overlay.style.display = 'none';

        location.reload(); // Recargar la página para reiniciar
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
            mostrarMensajeValidacion('Por favor, primero ingresa el nombre del evento.', contenedorMensaje);
            return;
        }

        premioCount++; // Incrementa el contador
        generarCamposPremios(premioCount); // Genera un nuevo premio
        btnGuardar.style.display = "inline-block"
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
            labelPremio.textContent = `${premioCount}° Premio`;
            const inputPremio = document.createElement('input');
            inputPremio.type = 'text';
            inputPremio.placeholder = `Descripción del ${premioCount}° premio`;

            columnaPremios.appendChild(labelPremio);
            columnaPremios.appendChild(inputPremio);

            // Columna de patrocinadores (sponsors)
            const columnaPatrocinadores = document.createElement('div');
            columnaPatrocinadores.classList.add('columna-patrocinadores');
            const labelSponsor = document.createElement('label');
            labelSponsor.textContent = `Sponsor ${premioCount}°`;
            const inputSponsor = document.createElement('input');
            inputSponsor.type = 'text';
            inputSponsor.placeholder = `Nombre del sponsor ${premioCount}`;

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
                --premioCount; // Disminuye el contador
                guardarDatos();
                actualizarNumsDePremios()

                if (premiosContainer.querySelectorAll('.premios-row').length === 0) {
                    btnGuardar.style.display = "none";
                }

            };

            // Agregar las columnas y el botón de eliminación a la fila
            premiosRow.appendChild(columnaPremios);
            premiosRow.appendChild(columnaPatrocinadores);
            premiosRow.appendChild(btnEliminar);

            // Agregar la fila al contenedor de premios
            premiosContainer.appendChild(premiosRow);
        }

    }

    // Función para actualizar los premios en Local Storage
    function actualizarPremiosEnLocalStorage() {
        const premios = [];
        const premiosRows = document.querySelectorAll('.premios-row');
        premiosRows.forEach(row => {
            const premio = row.querySelector('.columna-premios input').value.trim();
            const sponsor = row.querySelector('.columna-patrocinadores input').value.trim();
            premios.push({ premio, sponsor });
        });
        localStorage.setItem('premiosYSponsors', JSON.stringify(premios));
    }

    // Evento para guardar cambios al modificar un premio o patrocinador
    document.getElementById('premios-container').addEventListener('change', (event) => {
        if (event.target.matches('.columna-premios input, .columna-patrocinadores input')) {
            actualizarPremiosEnLocalStorage();
        }
    });

    // Función para actualizar los números de los premios
    function actualizarNumsDePremios() {
        const premiosRows = document.querySelectorAll('.premios-row');
        premiosRows.forEach((row, index) => {
            row.querySelector('.columna-premios label').textContent = `${index + 1}° Premio`;
            row.querySelector('.columna-patrocinadores label').textContent = `Sponsor ${index + 1}°`;
            row.querySelector('.columna-premios input').placeholder = `Descripción del ${index + 1}° premio`;
            row.querySelector('.columna-patrocinadores input').placeholder = `Nombre del sponsor ${index + 1}`;
        });
    }


    //FUNCION PARA GUARDAR LOS PREMIOS EN LA BBDD
    async function guardarPremios() {
        const premios = localStorage.getItem("premiosYSponsors");

        let premiosDatos = [];

        if (premios) {
            const listaPremios = JSON.parse(premios);

            premiosDatos = listaPremios.map(p => ({
                descripcion: p.premio,
                sponsor: p.sponsor
            }));


        } else {
            console.log("No hay premios en el sorteo");
            return;
        }

        try {
            const respuesta = await fetch("http://localhost:8080/premio/agregar-premios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(premiosDatos)

            })
            if (respuesta.ok) {
                const data = await respuesta.json();
                // alert(data.message);
            } else {
                console.error("Error al cargar los premios:", respuesta.status);
            }
        } catch (error) {
            console.error("Hubo un error al realizar la solicitud:", error);
        }
    }

    //Overlay para confirmacón de guardar premios
    btnGuardar.addEventListener("click", () => {
        const msj = document.getElementById("msj-confirmacion")
        msj.innerHTML = "¿Estás seguro de querer guardar los datos? Una vez que se guarden no se podrán modificar";
        overlay.style.display = "flex";
    });


    btnConfirmar.addEventListener("click", () => {
        guardarParticipantes()
        guardarPremios();//Llama a la función para guardar

        guardarDatos(); //LLamo a la función de guardar los datos

        btnGuardar.style.display = 'none';
        overlay.style.display = "none"


        //Mostrar el mensaje
        const mensaje = document.createElement('p');
        mensaje.textContent = `Datos guardados del sorteo "${localStorage.getItem('nombreEvento')}"`;

        //Evitar duplicados si el mensaje está en pantalla
        if (!document.body.contains(document.getElementById('mensaje-guardado'))) {
            mensaje.id = 'mensaje-guardado';
            mensajeContenedor.appendChild(mensaje);
        }

        // Mostrar la sección de "Realizar Sorteo"
        seccionSorteo.style.display = 'block';

    });

    btnCancelar.addEventListener('click', () => {
        overlay.style.display = "none"
    });




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
    btnSeccionHistorial.addEventListener('click', () => {
        toggleSection(seccionHistorial);
        localStorage.setItem('activeSection', 'historial'); // Guardar sección activa
    });



    // AGREGAR PARTICIPANTE DE FORMA MANUAL

    const documentosAgregados = [];
    function agregarParticipanteManual() {
        const nombre = document.getElementById('nombre-participante').value.trim();
        const dni = document.getElementById('dni').value.trim();
        const nombreEvento = localStorage.getItem('nombreEvento');

        if (!nombreEvento) {
            mostrarMensajeValidacion('Por favor, primero ingresa el nombre del evento.', contenedorMensaje);
            return;
        }

        if (!nombre || !dni) {
            mostrarMensajeValidacion('Por favor, complete ambos campos (Nombre y Documento).', contenedorMensaje);
            return;
        }

        if (documentosAgregados.includes(dni)) {
            mostrarMensajeValidacion('El documento ya ha sido registrado. Por favor, utiliza un documento diferente.', contenedorMensaje);
            return;
        }

        if (dni.length != 8) {
            mostrarMensajeValidacion('El DNI debe tener 8 dígitos.', contenedorMensaje);
            return;
        }


        agregarAParticipantes(nombre, dni);
        documentosAgregados.push(dni);

        // Limpiar los campos de entrada
        document.getElementById('nombre-participante').value = '';
        document.getElementById('dni').value = '';
        guardarDatos(); // Guardar datos al agregar participante

        mostrarOverlay("Participante agregado exitosamente");

    }


    function agregarAParticipantes(nombre, dni) {
        const lista = document.getElementById('lista-participantes');

        // Crear un nuevo elemento de lista
        const li = document.createElement('li');
        li.textContent = `${nombre} - ${dni}`; // Añadir solo el nombre y DNI

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = '❌';
        btnEliminar.onclick = function () {
            eliminarParticipante(li, dni);
        };

        li.appendChild(btnEliminar); // Agregar el botón de eliminación
        lista.appendChild(li);
    }

    document.getElementById('btn-agregar').addEventListener('click', agregarParticipanteManual);


    // Función para mostrar el overlay
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



    //FUNCIONES DE VALIDACIÓN

    const contenedorMensaje = document.getElementById("contenedor-mensajes");

    function mostrarMensajeValidacion(mensaje, contenedor) {
        //Limpiar mensajes previos
        contenedor.innerHTML = '';

        const mensajeValidacion = document.createElement('p');

        mensajeValidacion.textContent = mensaje;
        mensajeValidacion.style.color = 'red';

        contenedor.appendChild(mensajeValidacion);

        // Cerrar el mensaje automáticamente después de 3 segundos
        setTimeout(() => {
            contenedor.removeChild(mensajeValidacion);
        }, 3000); // 3000 milisegundos = 3 segundos

    }






    //GUARDAR LA LISTA DE PARTICIPANTES EN LA BBDD.
    async function guardarParticipantes() {
        const participantes = localStorage.getItem("participantes")

        let participantesDatos = [];

        if (participantes) {
            const listaParticipantes = JSON.parse(participantes);

            participantesDatos = listaParticipantes.map(p => ({
                nombre: p.nombre,
                dni: p.dni
            }));

        } else {
            console.log("No hay participantes en el sorteo");
            return;
        }

        try {
            const respuesta = await fetch("http://localhost:8080/participante/agregar-participantes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(participantesDatos)

            })
            if (respuesta.ok) {
                const data = await respuesta.json();
                // alert(data.message);
            } else {
                console.error("Error al cargar los participantes:", respuesta.status);
            }
        } catch (error) {
            console.error("Hubo un error al realizar la solicitud:", error);
        }

    }













    //GUARDAR EL NOMBRE DEL EVENTO 
    document.getElementById('btn-ingresar').addEventListener('click', async () => {
        const nombreEvento = document.getElementById('nombre-evento').value.trim();
        if (!nombreEvento) {
            mostrarMensajeValidacion('Por favor, ingrese el nombre del evento.', contenedorMensaje);
            return;
        }
        try {
            const response = await fetch("http://localhost:8080/evento", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({ nombre: nombreEvento })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                mostrarOverlay(`Evento ${data.nombre} creado exitosamente`);
            } else {
                console.log("error: " + response.statusText)
                mostrarOverlay('Error al crear el evento');
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











    // Cargar datos al inicio
    cargarDatos();






    // Escuchar el evento 'storage' para actualizar la lista de participantes
    window.addEventListener('storage', cargarDatos);




    //----------------------- Funcionalidad Historial-----

    // Integración del código de cargar eventos desde la API
    // Elementos del DOM
    const eventosLista = document.getElementById("eventos-lista");
    const paginaActualElemento = document.getElementById("pagina-actual");
    const yearInput = document.getElementById("year");
    const monthInput = document.getElementById("month");
    const botonFiltrar = document.getElementById("btn-aplicar-filtros");
    const botonHistorial = document.getElementById("btn-ver-historial");
    /*  const botonSiguiente = document.getElementById("boton-siguiente");
     const botonAnterior = document.getElementById("boton-anterior"); */

    let paginaActual = 0;  // Página actual inicial
    const tamanoPagina = 6;  // Número de eventos por página

    // Función para cargar todos los eventos (sin filtros)
    async function cargarEventosSinFiltro() {
        const url = `http://localhost:8080/evento/historial`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Error al obtener los eventos");

            const data = await response.json();

            // Verificar la estructura de los datos
            if (Array.isArray(data)) {
                renderizarEventos(data);
            } else {
                throw new Error("Formato de datos inesperado.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al obtener el historial de eventos.");
        }
    }

    // Función para cargar eventos con filtro de año y mes
    async function cargarEventosConFiltro() {
        const year = yearInput.value;
        const month = monthInput.value;

        const url = `http://localhost:8080/evento/filtrar?page=${paginaActual >= 0 ? paginaActual : 0}&size=${tamanoPagina}&year=${year}&month=${month}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error en la respuesta de la API: ${response.statusText}`);

            const data = await response.json();
            if (data.content && Array.isArray(data.content)) {
                renderizarEventos(data.content);
                /* actualizarPaginacion(data); */
            } else {
                throw new Error("Formato de datos inesperado.");
            }
        } catch (error) {
            console.error("Error al obtener los eventos filtrados:", error);
            alert("Error al obtener los eventos filtrados.");
        }
    }

    // Función para renderizar los eventos en el DOM
    function renderizarEventos(eventos) {
        eventosLista.innerHTML = "";  // Limpiar la lista

        if (eventos.length === 0) {
            eventosLista.innerHTML = "<p>No se encontraron eventos.</p>";
            return;
        }

        // Ordenar eventos por fecha (más recientes primero) si es necesario
        eventos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));  // Orden descendente por fecha


        eventos.forEach(evento => {
            const eventoItem = document.createElement("li");
            eventoItem.classList.add("evento");
            eventoItem.innerHTML = `
            <strong>${evento.nombre}</strong> - ${new Date(evento.fecha).toLocaleDateString()}
            <div class="premios-h">
                ${evento.premios ? evento.premios.map(premio => `
                    <div class="premio-h">
                        <p><strong>Premio:</strong> ${premio.descripcion}</p>
                        <p><strong>Patrocinador:</strong> ${premio.sponsor}</p>
                        <p><strong>Ganador:</strong> ${premio.nombreGanador}</p>
                        <p><strong>DNI:</strong> ${premio.dniGanador}</p>
                    </div>
                `).join("") : "<p>No hay premios.</p>"}
            </div>
        `;
            eventoItem.addEventListener("click", () => {
                const premiosDiv = eventoItem.querySelector(".premios-h");
                premiosDiv.classList.toggle("mostrar");
            });

            eventosLista.appendChild(eventoItem);
        });
    }

    // Función para manejar la paginación y habilitar/deshabilitar los botones
    /* function actualizarPaginacion(eventos) {
        const totalPages = eventos.totalPages;
        const currentPage = eventos.number;

        // Deshabilitar el botón "Anterior" si estamos en la primera página
        botonAnterior.disabled = currentPage <= 0;

        // Deshabilitar el botón "Siguiente" si estamos en la última página
        botonSiguiente.disabled = currentPage >= totalPages - 1;

        // Actualizar la página actual
        paginaActualElemento.innerText = currentPage + 1;
    } */

    // Función para cambiar la página (anterior o siguiente)
    function cambiarPagina(direccion) {
        paginaActual += direccion;
        if (yearInput.value || monthInput.value) {
            cargarEventosConFiltro(); // Si hay filtros, cargar con filtro
        } else {
            cargarEventosSinFiltro(); // Si no hay filtros, cargar sin filtro
        }
    }

    // Event listeners
    if (botonFiltrar) {
        botonFiltrar.addEventListener("click", cargarEventosConFiltro);
    }

    if (botonHistorial) {
        botonHistorial.addEventListener("click", () => {
            // Resetear los filtros y mostrar el historial sin filtros
            yearInput.value = '';
            monthInput.value = '';
            cargarEventosSinFiltro(); // Cargar todos los eventos sin filtros
        });
    }

    /* if (botonSiguiente && botonAnterior) {
        botonSiguiente.addEventListener("click", () => cambiarPagina(1));
        botonAnterior.addEventListener("click", () => cambiarPagina(-1));
    } */

    // Inicializar el historial de eventos sin filtros al cargar la página
    window.addEventListener("load", cargarEventosSinFiltro);


});

