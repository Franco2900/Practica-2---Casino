async function getPromociones(req, res) 
{
    console.log('***********************************************************');
    console.log('Ruta: GET /promociones \n');

    const usuario = req.session;
    const body = 'promocionesView';

    res.render('layout', { usuario, body });
}


const { cargarFichas } = require('../models/usuarioModel');

async function postCargarFichas(req, res)
{
    console.log('***********************************************************');
    console.log('Ruta: POST /cargarFichas \n');

    if (req.body.cantidadFichas) console.log('Cantidad de fichas a cargar:', req.body.cantidadFichas);
    else                         res.status(400).send('No se recibió ningúna cantidad.');

    const fichas = req.body.cantidadFichas;

    try
    {
        await cargarFichas(req.session.nombre, fichas);
        req.session.fichas += fichas; // Actualizo los datos de sesion del usuario

        res.status(200).json({ message: 'Cantidad cargada exitosamente.' });
    }
    catch(error)
    {
        console.error('Error:', error);
        res.status(500).json({ error: 'Ocurrió un error al cargar las fichas.' });  // Envío respuesta de error al cliente
    }

}

module.exports = { getPromociones, postCargarFichas };