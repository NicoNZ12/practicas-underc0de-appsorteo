document.getElementById('btn-ingresar').addEventListener('click', function(){
    // Obtener el valor del campo del nombre del evento
    const nombreEvento = document.getElementById('nombre-evento').value;
    
    if(nombreEvento){
        //ocultar la sección del nombre del evento
        document.getElementById('seccion-nombre').style.display = 'none';

        //mostrar la seccion de participantes
        document.getElementById('seccion-participantes').style.display = 'block';
    }else {
        alert("Por favor, ingresá en nombre del evento");
    }
});

