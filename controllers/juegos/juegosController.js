async function getJuegos(req, res)
{
    // Logging
    console.log('***********************************************************');
    console.log('Ruta: GET /juegos \n');

    const usuario = req.session;
    const body = 'juegos/juegosView';

    res.render('layout', {usuario, body} ); 
}


module.exports = { getJuegos, };