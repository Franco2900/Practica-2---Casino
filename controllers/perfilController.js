const { buscarHistorialDelUsuario } = require('../models/historialModel.js');

async function getPerfil(req, res) 
{
    console.log('***********************************************************');
    console.log('Ruta: GET /perfil \n');

    const usuario = req.session;
    const body = 'perfilView';

    // Calculo cuantas fichas gano y perdio el usuario
    const auxHistorial = await buscarHistorialDelUsuario(req.session.nombre);
    
    let historial = {};
    historial.cantidadApostada = 0;
    historial.cantidadGanada = 0;

    for( let i = 0; i < auxHistorial.length; i++ )
    {
        historial.cantidadApostada += auxHistorial[i].cantidadApostada;
        historial.cantidadGanada   += auxHistorial[i].cantidadGanada;
    }
    historial.balance = historial.cantidadGanada - historial.cantidadApostada;

    res.render('layout', { usuario, body, historial });
}


// Modulos
const path = require('path'); 
const fs = require('fs');

const { obtenerNombreDeArchivo } = require('../util.js');
const { cambiarImagen } = require('../models/usuarioModel');


async function postCambiarImagen(req, res) 
{
    console.log('***********************************************************');
    console.log('Ruta: POST /perfil/cambiarImagen \n');
    
    if (req.file) console.log('Archivo recibido:', req.file);
    else          return res.status(400).send('No se recibió ningún archivo.');

    const nombreViejaImagen = req.session.imagenPerfil;
    const lugarGuardadoFisicoViejaImagen = path.join(__dirname, '../public/images/Perfil', nombreViejaImagen);
    
    const nombreNuevaImagen = obtenerNombreDeArchivo(req.file.originalnames);
    const lugarGuardadoFisicoNuevaImagen = path.join(__dirname, '../public/images/Perfil', nombreNuevaImagen);
    
    const imagenBuffer = req.file.buffer;

    try 
    {
        fs.unlink(lugarGuardadoFisicoViejaImagen, (err) => {
            if (err) {
              console.error('Hubo un error al intentar borrar el archivo:', err);
              return;
            }
        });

        fs.writeFileSync(lugarGuardadoFisicoNuevaImagen, imagenBuffer); // Guardo la imagen fisicamente

        await cambiarImagen(req.session.nombre, nombreNuevaImagen); // Modifico la imagen del usuario en la base de datos
    
        req.session.imagenPerfil = nombreNuevaImagen; // Actualizo los datos de sesion del usuario

        return res.status(200).json({ message: 'Imagen cambiada exitosamente.' }); // Envío respuesta de éxito al cliente
    }
    catch (error) 
    {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Ocurrió un error al cambiar la imagen.' }); // Envío respuesta de error al cliente
    }
    
}


const { verificarExistenciaNombre, cambiarNombre } = require('../models/usuarioModel');

async function postCambiarNombre(req, res) 
{
    console.log('***********************************************************');
    console.log('Ruta: POST /perfil/cambiarNombre \n');

    if (req.body.nuevoNombre) console.log('Nuevo nombre recibido:', req.body.nuevoNombre);
    else                      res.status(400).send('No se recibió ningún nombre.');

    const viejoNombre = req.session.nombre;
    const nuevoNombre = req.body.nuevoNombre;

    try
    {
        let usuario = await verificarExistenciaNombre(nuevoNombre);

        if(usuario) return res.status(409).json({error: 'Ese nombre ya esta siendo usado por otro usuario' });  // Envío respuesta de error al cliente
        else
        {
            await cambiarNombre(viejoNombre, nuevoNombre);
            req.session.nombre = nuevoNombre; // Actualizo los datos de sesion del usuario

            return res.status(200).json({ message: 'Nombre cambiado exitosamente.' }); // Envío respuesta de éxito al cliente
        }
    }
    catch(error)
    {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Ocurrió un error al cambiar el nombre.' });  // Envío respuesta de error al cliente
    }

}


const { cambiarContrasenia } = require('../models/usuarioModel');

async function postCambiarContrasenia(req, res) 
{
    console.log('***********************************************************');
    console.log('Ruta: POST /perfil/cambiarContrasenia \n');

    if (req.body.nuevaContrasenia) console.log('Nueva contraseña recibida:', req.body.nuevaContrasenia);
    else                           res.status(400).send('No se recibió ninguna contraseña.');

    const nuevaContrasenia = req.body.nuevaContrasenia;

    try
    {
        await cambiarContrasenia(req.session.nombre, nuevaContrasenia);
        req.session.contrasenia = nuevaContrasenia; // Actualizo los datos de sesion del usuario

        return res.status(200).json({ message: 'Contraseña cambiada exitosamente.' }); // Envío respuesta de éxito al cliente
    }
    catch(error)
    {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Ocurrió un error al cambiar la contraseña.' });  // Envío respuesta de error al cliente
    }

}



module.exports = { getPerfil, postCambiarImagen, postCambiarNombre, postCambiarContrasenia };