const { conectarDB } = require('../Base de datos/database.js'); // Base de datos

async function buscarUsuario(datos) 
{
    const database = await conectarDB();
    const coleccion = database.collection('usuarios'); // Indico en que coleccion busco

    // Busco usuario por nombre y contraseña
    return await coleccion.findOne({ nombre: datos.nombre, contrasenia: datos.contrasenia });
}


async function verificarExistenciaEmailNombre(datos) 
{
    const database = await conectarDB();
    const coleccion = database.collection('usuarios');

    // Verifico si existe el email o el nombre de usuario
    return await coleccion.findOne({ 
        $or: [
            { email: datos.email },
            { nombre: datos.nombre }
        ] 
    })
}


async function verificarExistenciaNombre(nombre) 
{
    const database = await conectarDB();
    const coleccion = database.collection('usuarios');

    // Verifico si existe el nombre de usuario
    return await coleccion.findOne({ nombre: nombre })
}


async function crearUsuario(datos, imagenPerfil) 
{
    const database = await conectarDB();
    const coleccion = database.collection('usuarios');
    
    // Creo un usuario nuevo con los datos y la imagen del formulario (por defecto, los usuarios nuevos no tienen dinero)
    await coleccion.insertOne({
        ...datos,
        imagenPerfil,
        fichas: 0
    });
}


async function cambiarImagen(nombre, imagenPerfil)
{
    const database = await conectarDB();
    const coleccion = database.collection('usuarios');

    // Actualiza el campo imagenPerfil del usuario con el nombre proporcionado
    await coleccion.updateOne(
        { nombre: nombre },
        { $set: { imagenPerfil: imagenPerfil } }
    );
}


async function cambiarNombre(viejoNombre, nuevoNombre)
{
    const database = await conectarDB();
    const coleccion = database.collection('usuarios');

    // Actualiza el campo nombre del usuario
    await coleccion.updateOne(
        { nombre: viejoNombre },
        { $set: { nombre: nuevoNombre } }
    );
}


async function cambiarContrasenia(nombre, nuevaContrasenia)
{
    const database = await conectarDB();
    const coleccion = database.collection('usuarios');

    // Actualiza el campo contraseña del usuario
    await coleccion.updateOne(
        { nombre: nombre },
        { $set: { contrasenia: nuevaContrasenia } }
    );
}


async function cargarFichas(nombre, fichasACargar)
{
    const database = await conectarDB();
    const coleccion = database.collection('usuarios');

    const usuario = await coleccion.findOne({ nombre: nombre })
    let fichasActuales = usuario.fichas;
    let fichasTotales = fichasActuales + fichasACargar;

    // Actualiza el campo fichas del usuario
    await coleccion.updateOne(
        { nombre: nombre },
        { $set: { fichas: fichasTotales } }
    );
}


async function restarFichas(nombre, fichasARestar)
{
    const database = await conectarDB();
    const coleccion = database.collection('usuarios');

    const usuario = await coleccion.findOne({ nombre: nombre })
    let fichasActuales = usuario.fichas;
    let fichasTotales = fichasActuales - fichasARestar;

    // Actualiza el campo fichas del usuario
    await coleccion.updateOne(
        { nombre: nombre },
        { $set: { fichas: fichasTotales } }
    );
}

module.exports = { 
    buscarUsuario, 
    verificarExistenciaEmailNombre,
    verificarExistenciaNombre,
    crearUsuario, 
    cambiarImagen, 
    cambiarNombre,
    cambiarContrasenia,
    cargarFichas,
    restarFichas,
};