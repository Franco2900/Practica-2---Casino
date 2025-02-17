// Rutas de: /juegos

// Modulos
var express = require('express')
var router = express.Router()

// Importacion de las funciones de los controllers
const { getJuegos } = require('../controllers/juegos/juegosController');
const { getTragamonedas, postTragamonedas } =  require('../controllers/juegos/tragamonedasController');
const { getBlackjack, empezarPartida, actualizarAsesJugador, pedirCarta, plantarse } = require('../controllers/juegos/blackjackController');

const { autentificar } = require('../util');


// Rutas
router.get( '/', getJuegos );

router.get( '/tragamonedas', autentificar, getTragamonedas );
router.post( '/tragamonedas', postTragamonedas );

router.get( '/blackjack', autentificar, getBlackjack );
router.post( '/blackjack/empezarPartida', empezarPartida );
router.post( '/blackjack/actualizarAsesJugador', empezarPartida );
router.post( '/blackjack/pedirCarta', pedirCarta );
router.post( '/blackjack/plantarse', plantarse );

module.exports = router