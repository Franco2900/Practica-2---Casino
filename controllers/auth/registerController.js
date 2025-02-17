const { verificarExistenciaEmailNombre, crearUsuario } = require('../../models/usuarioModel.js');

// Modulos
const path = require('path'); 
const fs = require('fs');

const { obtenerNombreDeArchivo } = require('../../util.js');

async function getRegister(req, res) 
{
    // Logging
    console.log('***********************************************************');
    console.log('Ruta: GET /register \n');

    const usuario = req.session;
    const body = 'auth/registerView';

    res.render('layout', { usuario, body });
}


async function postRegister(req, res) 
{
    // Logging
    console.log('***********************************************************');
    console.log('Ruta: POST /register \n');
    console.log('Datos ingresados por el usuario');
    console.log(req.body);

    const datos = req.body;

    try 
    {
        // Consulto si ya existe un usuario con ese nombre y ese email
        const existeUsuario = await verificarExistenciaEmailNombre(datos);

        // Si existe, le informo del error al usuario
        if (existeUsuario) 
        {
            res.send(`
                <script>
                alert('Intente de vuelta con otros datos. El usuario ya existe');
                window.location.href = "/register/";
                </script>`);
        }
        
        // Si no existe, inserto el usuario en la coleccion
        else 
        {
            
            const nombreImagen = obtenerNombreDeArchivo() + req.file.originalname;
            const lugarGuardadoFisico = path.join(__dirname, '../../public/images/Perfil', nombreImagen);
            const imagen = req.file.buffer;

            fs.writeFileSync(lugarGuardadoFisico, imagen); // Guardo la imagen fisicamente

            await crearUsuario(datos, nombreImagen); // Creo el usuario
            
            res.status(201).send(
                `<script>
                    alert("Usuario creado");
                    window.location.href = "/";
                    </script>`);
        }

    }
    catch (error) 
    {
        res.status(500).send();
        console.log(error);
    }
}


module.exports = { getRegister, postRegister };