document.getElementById('imagenPerfil').addEventListener('change', function(event) {

    const input = event.target; // Referencia al input html

    if (input.files && input.files[0]) 
    {
        var reader = new FileReader(); // Objeto que permite leer el contenido de los archivos

        reader.onload = function () { // Defino lo que se hara cuando se termine de leer el contenido del archivo
            document.getElementById('vistaPrevia').src = reader.result; // Cambio el atributo src del elemento html con dicho ID con el resultado del archivo leido
            document.getElementById('vistaPrevia').style.display = 'block';
        }

        reader.readAsDataURL(input.files[0]); // Leo el primer archivo
    }

});