// Rutas de: /perfil

var express = require('express');
var router = express.Router();

const multer = require('multer');                           // Modulo para manejar la subidad de archivos
const upload = multer({ storage: multer.memoryStorage() }); // Creo una instancia de multer

const { getPerfil, postCambiarImagen, postCambiarNombre, postCambiarContrasenia } = require('../controllers/perfilController');
const { autentificar } = require('../util');

router.get('/', autentificar, getPerfil);   
router.post('/cambiarImagen', upload.single('imagenPerfil'), postCambiarImagen);
router.post('/cambiarNombre', postCambiarNombre);
router.post('/cambiarContrasenia', postCambiarContrasenia);

module.exports = router;
