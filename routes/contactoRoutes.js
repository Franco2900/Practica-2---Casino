// Rutas de: /contacto

// Modulos
var express = require('express')
var router = express.Router()

router.get('/', (req, res) => {

    // Logging
    console.log('***********************************************************');
    console.log('Ruta: GET /contacto \n');

    const usuario = req.session;
    const body = 'contactoView';

    res.render('layout', {usuario, body} ); 
});

module.exports = router