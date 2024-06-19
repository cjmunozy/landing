let loaded = ( eventLoaded ) => {  
    let myform = document.getElementById("formulario");
    myform.addEventListener("submit", ( eventSubmit ) => {
        eventSubmit.preventDefault();

        let nombre = document.getElementById("nombre");
        let email = document.getElementById("email");
        let genero = document.getElementsByName("genero");
        let inicial = document.getElementById("inicial");

        let nombreValue = nombre.value;
        let emailValue = email.value;
        let generoValue;
        for (let i = 0; i < genero.length; i++) {
            if (genero[i].checked) {
                generoValue = genero[i].value;
                break;
            }
        }
        let inicialValue = inicial.value;

        if(nombreValue.length == 0){
            nombre.focus();
            alert("Ingrese un texto válido.");
            return;
        }
        if(emailValue.length == 0){
            email.focus();
            alert("Ingrese un texto válido.");
            return;
        }
        if (inicialValue === "0") {
            inicial.focus();
            alert("Seleccione una opción.");
            return;
        }

        let datos = {
            nombre: nombreValue,
            email: emailValue,
            genero: generoValue,
            inicial: inicialValue
        }
        fetch("https://coleccion-daw-default-rtdb.firebaseio.com/collection.json", {
            method: "POST",
            body: JSON.stringify(datos),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(respuesta => respuesta.json())
        .then(datos => {
            console.log(datos);
        })
        .catch(error => console.error(error));
        myform.reset();
    })
}

async function cargarEstadisticas(){
    const url = "https://coleccion-daw-default-rtdb.firebaseio.com/collection.json";
    let respuesta = await fetch(url);
    if (!respuesta.ok) {
        console.error("Error:", respuesta.status);
        return;
    }
    const datos = await respuesta.json();
    return datos;
}

async function leerRegistros(){
    let registros = await cargarEstadisticas();
    let listaVotos = new Map();
    for (let key in registros) {
        if (registros.hasOwnProperty(key)) {
            let registro = registros[key];
            let pokemon = registro.inicial;
            if (!listaVotos.has(pokemon)) {
                listaVotos.set(pokemon, 1);
            } else {
                let votos = listaVotos.get(pokemon);
                listaVotos.set(pokemon, votos + 1);
            }
        }
    }
    return listaVotos;
}

async function completarTabla(){
    let votos = await leerRegistros();
    let html = "";
    votos.forEach( (voto, pokemon, map) => {
        let plantilla = `
            <tr>
			    <td>${pokemon}</td>
			    <td>${voto}</td>
		    </tr>
            `;
        html += plantilla;
    })
    let tabla = document.getElementById("tablebody");
    tabla.innerHTML = html;
}

completarTabla();

window.addEventListener("DOMContentLoaded", loaded);
