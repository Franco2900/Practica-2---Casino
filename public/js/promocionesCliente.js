function cargarFichas(cantidadFichas)
{
    // Petición al servidor usando fetch 
    fetch('http://localhost:777/promociones/cargarFichas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cantidadFichas: cantidadFichas }) })
    .then(response => response.json())
    .then(data => {
        console.log('Éxito:', data);
        window.location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ocurrió un error: ' + error.message);
    });
}