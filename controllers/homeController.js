async function getHome(req, res)
{
    // Logging
    console.log('***********************************************************');
    console.log('Ruta: GET / \n');

    const usuario = req.session;
    const body = 'homeView';

    res.render('layout', {usuario, body} ); 
}

module.exports = { getHome };