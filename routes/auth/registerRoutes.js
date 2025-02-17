// Rutas de: /register

var express = require('express');
var router = express.Router();

const multer = require('multer'); // Modulo para manejar la subidad de archivos
const upload = multer({ storage: multer.memoryStorage() }); // Creo una instancia de multer

const { getRegister, postRegister } = require('../../controllers/auth/registerController');

router.get('/', getRegister);
router.post('/', upload.single('imagenPerfil'), postRegister);

module.exports = router