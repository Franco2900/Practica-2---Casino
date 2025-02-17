async function getTragamonedas(req, res)
{
    // Logging
    console.log('***********************************************************');
    console.log('Ruta: GET /juegos/tragamonedas \n');

    const usuario = req.session;
    const body = 'juegos/tragamonedasView';

    res.render('layout', {usuario, body} ); 
}




const { cargarFichas, restarFichas } = require('../../models/usuarioModel');
const { agregarHistoria }            = require('../../models/historialModel');

async function postTragamonedas(req, res)
{
    // Logging
    console.log('***********************************************************');
    console.log('Ruta: POST /juegos/tragamonedas \n');

    try
    {
        // Verifico que el usuario tenga suficientes fichas para jugar
        if(req.session.fichas - 5 < 0) return res.status(403).json({ error: 'No hay suficientes fichas para jugar al tragamonedas.' });

        await restarFichas(req.session.nombre, 5); // Descuento las 5 fichas que cuesta jugar al tragamonedas
        req.session.fichas -= 5; 

        const opcionesPocoValor  = [ 'cereza', 'limon', 'sandia' ]; // Opciones del tragamonedas
        const opcionesMedioValor = [ 'bar', 'campana' ];
        const opcionesAltoValor  = [ 'diamante', '7' ];

        // FILA MEDIO
        let filaMedio = [];

        for(let i = 0; i < 3; i++)
        {
            let probabilidadOpcion = Math.ceil( Math.random() * 100 ); // Numero al azar entre 0 y 1 (excluidos) multiplicado por 100 (se redondea para arriba)

            if( probabilidadOpcion >= 1 && probabilidadOpcion <= 60 )   filaMedio.push( opcionesPocoValor [ Math.floor(Math.random() * opcionesPocoValor.length)  ] );
            if( probabilidadOpcion >= 61 && probabilidadOpcion <= 90 )  filaMedio.push( opcionesMedioValor[ Math.floor(Math.random() * opcionesMedioValor.length) ] );
            if( probabilidadOpcion >= 91 && probabilidadOpcion <= 100 ) filaMedio.push( opcionesAltoValor [ Math.floor(Math.random() * opcionesAltoValor.length)  ] );
        }

        console.log( 'Resultados del tragamonedas: ', filaMedio );

        // Si el usuario gana
        let cantidadGanada = 0;
        let resultadoJuego = 'derrota';

        if( filaMedio.every(valor => valor === filaMedio[0]) ) // every recorre cada elemento del arreglo y verifica si se cumple la condicion (en este caso reviso si todo los elementos son iguales al primero)
        {
            // Le sumo la cantidad de fichas que corresponde
            if( filaMedio[0] === 'cereza' || filaMedio[0] === 'limon' || filaMedio[0] === 'sandia' )
            { 
                await cargarFichas(req.session.nombre, 50);
                cantidadGanada = 50
                req.session.fichas += cantidadGanada; 
            }

            if( filaMedio[0] === 'bar'    || filaMedio[0] === 'campana' )
            {
                await cargarFichas(req.session.nombre, 300);
                cantidadGanada = 300;
                req.session.fichas += cantidadGanada; 
            }
                
            if( filaMedio[0] === 'diamante' || filaMedio[0] === '7') 
            {
                await cargarFichas(req.session.nombre, 1000);
                cantidadGanada = 1000;
                req.session.fichas += cantidadGanada; 
            }
            
            resultadoJuego = 'victoria';
        }


        // FILA ARRIBA
        let filaArriba =  []; 
        
        do
        {
            filaArriba = []; // Reinicia el array en cada iteración

            for(let i = 0; i < 3; i++)
            {
                let probabilidadOpcion = Math.ceil( Math.random() * 100 ); 
        
                if( probabilidadOpcion >= 1 && probabilidadOpcion <= 60 )   filaArriba.push( opcionesPocoValor [ Math.floor(Math.random() * opcionesPocoValor.length)  ] );
                if( probabilidadOpcion >= 61 && probabilidadOpcion <= 90 )  filaArriba.push( opcionesMedioValor[ Math.floor(Math.random() * opcionesMedioValor.length) ] );
                if( probabilidadOpcion >= 91 && probabilidadOpcion <= 100 ) filaArriba.push( opcionesAltoValor [ Math.floor(Math.random() * opcionesAltoValor.length)  ] );
            }
        }
        while( filaArriba.every(valor => valor === filaArriba[0]) ) // Se hace hasta que todos los resultados dejen de ser iguales


        // FILA ABAJO
        let filaAbajo =  [];
        
        do
        {
            filaAbajo = []; 

            for(let i = 0; i < 3; i++)
            {
                let probabilidadOpcion = Math.ceil( Math.random() * 100 ); 
        
                if( probabilidadOpcion >= 1 && probabilidadOpcion <= 60 )   filaAbajo.push( opcionesPocoValor [ Math.floor(Math.random() * opcionesPocoValor.length)  ] );
                if( probabilidadOpcion >= 61 && probabilidadOpcion <= 90 )  filaAbajo.push( opcionesMedioValor[ Math.floor(Math.random() * opcionesMedioValor.length) ] );
                if( probabilidadOpcion >= 91 && probabilidadOpcion <= 100 ) filaAbajo.push( opcionesAltoValor [ Math.floor(Math.random() * opcionesAltoValor.length)  ] );
            }
        }
        while( filaAbajo.every(valor => valor === filaAbajo[0]) ) 

        // Agrego el registro al historial del usuario
        agregarHistoria(req.session.nombre, 'Tragamonedas', 5, resultadoJuego, cantidadGanada, req.session.fichas);

        return res.status(200).json({ filaArriba: filaArriba, filaMedio: filaMedio, filaAbajo: filaAbajo});
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({ error: 'Ocurrió un error al jugar al tragamonedas.' });
    }

}


module.exports = { getTragamonedas, postTragamonedas };