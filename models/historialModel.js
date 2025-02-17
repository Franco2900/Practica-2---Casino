// Una colección para tener un historial de la cantidad de dinero que los usuarios ganan y pierden

const { conectarDB } = require('../Base de datos/database.js'); // Base de datos

async function agregarHistoria(nombre, juegoJugado, cantidadApostada, resultadoJuego, cantidadGanada, fichas) {
    
    const database = await conectarDB();
    const coleccion = database.collection('historial'); // Indico en que coleccion busco

    const fechaActual = new Date();
    const fecha = fechaActual.toLocaleDateString(); // formato local
    const hora = fechaActual.toLocaleTimeString(); 

    // Creo un nuevo registro en la coleccion
    await coleccion.insertOne({ nombre, juegoJugado, cantidadApostada, resultadoJuego, cantidadGanada, fichas, fecha: fecha, hora: hora }); 
}


async function buscarHistorialDelUsuario(nombre) {
    
    const database = await conectarDB();
    const coleccion = database.collection('historial'); 

    // Busco todos los documentos que tengan el nombre del usuario en la colección 'historial'
    return await coleccion.find({ nombre: nombre }).toArray();
}


module.exports = { 
    agregarHistoria,
    buscarHistorialDelUsuario,
}