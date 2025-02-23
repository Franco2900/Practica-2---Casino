// Redirige a la página de login si el usuario no está logueado 
function autentificar(req, res, next) 
{
    if (req.session && req.session.nombre) return next();
    else                                   res.redirect('/login');   
}

function obtenerNombreDeArchivo(nombreOriginal)
{
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
    const dia = ('0' + fecha.getDate()).slice(-2);
    const horas = ('0' + fecha.getHours()).slice(-2);
    const minutos = ('0' + fecha.getMinutes()).slice(-2);
    const segundos = ('0' + fecha.getSeconds()).slice(-2);

    return `${año}${mes}${dia}_${horas}${minutos}${segundos}_${nombreOriginal}`; 
};

module.exports = { 
    autentificar,
    obtenerNombreDeArchivo,
};