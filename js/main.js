let loaded = ( eventLoaded ) => {  
    let myform = document.getElementById("formulario");
    myform.addEventListener("submit", ( eventSubmit ) => {
        eventSubmit.preventDefault();
        let nombreValue = nombre.value;
        let emailValue = email.value;
        if(nombreValue.length == 0 || emailValue == 0){
            nombre.focus();
            alert("Ingrese un texto válido.");
            return;
        }
        let datos = {
            nombre: nombreValue,
            email: emailValue
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

window.addEventListener("DOMContentLoaded", loaded);
