document.addEventListener('DOMContentLoaded', () => {



    // Variables para manejar secciones
    const btnEvento = document.getElementById('fomr-evento');
    const btnParticipantes = document.getElementById('form-registro-participantes');
    const btnLista = document.getElementById('form-lista-participantes');
    const btnPremios = document.getElementById('form-pemios-sponsor');
    const btnReiniciar = document.getElementById('reinicar-pagina-completa');

    const seccionNombre = document.getElementById('seccion-nombre');
    const seccionParticipantes = document.getElementById('seccion-participantes');
    const listaParticipantes = document.getElementById('lista');
    const seccionPremios = document.getElementById('premios');
    const qrDiv = document.getElementById('qr');

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

    // Agregar evento al botón "Guardar Datos"
    document.getElementById('guardar-datos-premios-sponsor').addEventListener('click', guardarDatos);

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
    
        const nombreEvento = localStorage.getItem('nombreEvento');
        if (nombreEvento) {
            document.getElementById('evento-display').textContent = `EVENTO: "${nombreEvento}"`;
            document.getElementById('nombre-evento').value = nombreEvento;
        }
    
        const participantes = JSON.parse(localStorage.getItem('participantes')) || [];
        participantes.forEach(({ nombre, dni }) => agregarAParticipantes(nombre, dni));
    
        const premios = JSON.parse(localStorage.getItem('premiosYSponsors')) || [];
        // Generar campos de premios basados en los datos guardados
        premioCount = premios.length; // Establece el contador a la cantidad de premios guardados
        generarCamposPremios(premioCount); // Genera los campos necesarios
    
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
            participantes.push({ nombre, dni: dni.trim() });
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
    

    // AGREGAR PARTICIPANTE MANUAL
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
        documentosAgregados.push(dni);

        // Limpiar los campos de entrada
        document.getElementById('nombre-participante').value = '';
        document.getElementById('dni').value = '';
        guardarDatos(); // Guardar datos al agregar participante
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

    // REINICIAR SORTEO
    btnReiniciar.addEventListener('click', () => {
        localStorage.removeItem('nombreEvento');
        localStorage.removeItem('participantes');
        localStorage.removeItem('premiosYSponsors');
        location.reload(); // Recargar la página para reiniciar
    });


    // Cargar datos al inicio
    cargarDatos();

});
