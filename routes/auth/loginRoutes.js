// Rutas de: /login

var express = require('express');
var router = express.Router();

const { getLogin, postLogin } = require('../../controllers/auth/loginController');

router.get('/', getLogin);
router.post('/', postLogin);

module.exports = router;
