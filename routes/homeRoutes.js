// Rutas de: /

// Modulos
var express = require('express')
var router = express.Router()

const { getHome } = require('../controllers/homeController');

router.get('/', getHome);

module.exports = router