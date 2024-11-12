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
    const qrDiv = document.getElementById('qr');
    const mensajeContenedor = document.getElementById('mensaje-contenedor');
    const seccionSorteo = document.getElementById("realizar-sorteo");

    let premioCount = 0; // Contador para los premios

    function toggleSection(section) {
        const sections = [seccionNombre, seccionParticipantes, listaParticipantes, seccionPremios, qrDiv];
        sections.forEach(sec => {
            sec.style.display = (sec === section) ? 'block' : 'none';
        });
        if (section !== seccionParticipantes) {
            qrDiv.style.display = 'none'; // Ocultar QR si no está en la sección de participantes
        }
    }


    //GUARDAR LOS DATOS AL ACTUALIZAR

    // Agregar evento al botón "Guardar Datos"
    btnGuardar.addEventListener('click',() => {
        guardarDatos(); //LLamo a la función de guardar los datos

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
    btnSorteo.addEventListener('click', ()=>{
        //Lógica del sorteo
        alert("Realizando el sorteo...");

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

    function agregarParticipanteManual() {
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

        agregarAParticipantes(nombre, dni);
        documentosAgregados.push(dni); // Asegúrate de que se agregue solo si se añade un participante

        // Limpiar los campos de entrada
        document.getElementById('nombre-participante').value = '';
        document.getElementById('dni').value = '';
        guardarDatos(); // Guardar datos al agregar participante
    }

    function agregarAParticipantes(nombre, dni) {
        const lista = document.getElementById('lista-participantes');
        const nombreEvento = localStorage.getItem('nombreEvento'); // Obtener el nombre del evento

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
    document.getElementById('btn-ingresar').addEventListener('click', () => {
        const nombreEvento = document.getElementById('nombre-evento').value.trim();
        if (!nombreEvento) {
            alert('Por favor, ingrese el nombre del evento.');
            return;
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

        // Guardar en localStorage que debe desplazarse a la sección de "Nombre del Evento"
        localStorage.setItem('redirigirNombreEvento', 'true');

        location.reload(); // Recargar la página para reiniciar
    });

    // Cargar datos al inicio
    cargarDatos();

});
