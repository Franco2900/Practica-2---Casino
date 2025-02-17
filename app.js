// Modulos
const express    = require('express'); // Modulo para la navegación web y creación del servidor
const session    = require('express-session'); // Modulo para usar variables de sesions
const bodyParser = require('body-parser');
const cors       = require('cors'); // CORS (Cross-Origin Resource Sharing) permite las solicitudes entre diferentes dominios
const path       = require('path');

// Variables globales
const app    = express();
const puerto = 777;

// Motor de plantillas
app.set('views', path.join(__dirname, 'views')); // Indico que las vistas estan en la carpeta 'views'
app.set('view engine', 'ejs');                   // Indico que motor de plantillas uso

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // Permite el uso de formularios
app.use(express.json()); // Permite parsear JSON
app.use(cors());


app.use(session({            // Permite el uso de variables de sesión
    secret: '12345',         // Clave secreta usada para firmar la cookie de sesión.
    resave: false,           // Evita que la sesión se guarde de nuevo en el servidor si no ha sido modificada.
    saveUninitialized: true, // Guarda la sesión nueva aun si no ha sido modificada.
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 dia
    }
}));


app.use('/images', express.static('public/images'));
app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));
app.use('/sonidos', express.static('public/sonidos'));
app.use('/bootstrapCSS', express.static('node_modules/bootstrap/dist/css'));  // Bootstrap
app.use('/bootstrapJS', express.static('node_modules/bootstrap/dist/js'));
app.use('/bootstrapICONS', express.static('node_modules/bootstrap-icons/font'));

// Rutas
app.use('/', require('./routes/homeRoutes.js') );
app.use('/contacto', require('./routes/contactoRoutes.js') );
app.use('/login', require('./routes/auth/loginRoutes.js') );
app.use('/register', require('./routes/auth/registerRoutes.js') );
app.use('/logout', require('./routes/auth/logoutRoutes.js') );
app.use('/perfil', require('./routes/perfilRoutes.js') );
app.use('/promociones', require('./routes/promocionesRoutes.js') );
app.use('/juegos', require('./routes/juegosRoutes.js') );


// Inicio el servidor
const servidor = app.listen(puerto, () => {
    console.log('Servidor web iniciado en el puerto ' + puerto);
});

module.exports = app;