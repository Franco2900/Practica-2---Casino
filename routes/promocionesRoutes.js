// Rutas de: /promociones

var express = require('express');
var router = express.Router();

const { getPromociones, postCargarFichas } = require('../controllers/promocionesController');
const { autentificar } = require('../util');

router.get('/', autentificar, getPromociones);   
router.post('/cargarFichas', postCargarFichas);   

module.exports = router;
