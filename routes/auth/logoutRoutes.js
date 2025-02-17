// Rutas de: /logout

// Modulos
var express = require('express')
var router = express.Router()

router.get('/', (req, res) => {

    // Logging
    console.log('***********************************************************');
    console.log('Ruta: GET /logout \n');

    req.session.destroy((error) => { 
        if (error) return res.status(500).send('Error al cerrar sesión'); 
        res.redirect('/'); 
    });

});

module.exports = router