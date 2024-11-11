async function agregarParticipante(){
    const nombre = document.querySelector("#participante-nombre").value.trim();
    const dni = document.querySelector("#documento-participante").value.trim();

    if (!nombre || !dni) {
        alert('Por favor, complete ambos campos (Nombre y Documento).');
        return;
    }

    //TODO: comprobación de que la persona con el dni ya esté registrado.

    const participanteData = {
        nombre,
        dni
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
            document.querySelector("#participante-nombre").value = "";
            document.querySelector("#documento-participante").value = "";

        }else{
            console.error("Error al agregar el participante:" + response.statusText);
            alert("Error al agregar el participante");
        }    
    }catch(error){
        console.error("Error de conexión con la api:", error);
    }
}

const agregarBtn = document.querySelector("#agregar-participante");
agregarBtn.addEventListener('click', agregarParticipante);