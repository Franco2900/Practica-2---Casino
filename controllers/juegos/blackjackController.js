async function getBlackjack(req, res)
{
    // Logging
    console.log('***********************************************************');
    console.log('Ruta: GET /juegos/blackjack \n');

    const usuario = req.session;
    const body = 'juegos/blackjackView';

    res.render('layout', {usuario, body} ); 
}



const { cargarFichas, restarFichas } = require('../../models/usuarioModel');
const { agregarHistoria }            = require('../../models/historialModel');

const posiblesCartas = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const valoresCartas = { 'A': 11, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10 };

async function empezarPartida(req, res)
{
    // Logging
    console.log('***********************************************************');
    console.log('Ruta: POST /juegos/blackjack/empezarPartida \n');

    try
    {
        // Verifico que se recibieron datos
        if (req.body.cantidadApostada) console.log('Cantidad fichas a apostar:', req.body.cantidadApostada);
        else                           
        {
            console.log('No se recibió ninguna ficha.');
            return res.status(400).send('No se recibió ninguna ficha.');
        }

        // Verifico que el jugador tenga suficientes fichas para jugar
        if(req.session.fichas - req.body.cantidadApostada < 0) return res.status(403).json({ error: 'No hay suficientes fichas para jugar al blackjack.' });

        // Guardo los datos
        const cantidadApostada = req.body.cantidadApostada; 
        req.session.cantidadApostada = req.body.cantidadApostada;

        // Actualizo la cantidad de fichas en la base de datos y en los datos de sesion del usuario
        await restarFichas( req.session.nombre, cantidadApostada );
        req.session.fichas -= cantidadApostada;



        // Eligo las cartas al azar
        const carta1Coupier = posiblesCartas[Math.floor( Math.random() * 13 )];
        const carta1Jugador = posiblesCartas[Math.floor( Math.random() * 13 )];
        const carta2Jugador = posiblesCartas[Math.floor( Math.random() * 13 )];



        // Variables de sesión para que el servidor pueda seguir el juego del jugador
        req.session.cartasJugador = [];
        req.session.cartasJugador.push( carta1Jugador, carta2Jugador );

        req.session.puntosJugador = 0;
        req.session.puntosJugador += valoresCartas[ req.session.cartasJugador[0] ];
        req.session.puntosJugador += valoresCartas[ req.session.cartasJugador[1] ];

        req.session.asesJugador = 0;
        if ( req.session.cartasJugador[0].includes('A') ) req.session.asesJugador++;
        if ( req.session.cartasJugador[1].includes('A') ) req.session.asesJugador++;

        // Variables de sesión para que el servidor pueda seguir el juego del crupier
        req.session.cartasCrupier = [];
        req.session.cartasCrupier.push( carta1Coupier );

        req.session.puntosCrupier = 0;
        req.session.puntosCrupier += valoresCartas[ req.session.cartasCrupier[0] ];

        req.session.asesCrupier = 0;
        if ( req.session.cartasCrupier.includes('A') ) req.session.asesCrupier++;


        console.log( 'Cartas jugador: ', req.session.cartasJugador ); //DEBUG
        console.log( 'Puntaje jugador', req.session.puntosJugador );
        console.log( 'Ases jugador', req.session.asesJugador );
        console.log();
        console.log( 'Cartas crupier: ', req.session.cartasCrupier );
        console.log( 'Puntaje crupier', req.session.puntosCrupier );
        console.log( 'Ases crupier', req.session.asesCrupier );

        // Agrego el registro al historial del usuario
        agregarHistoria(req.session.nombre, 'Blackjack', req.session.cantidadApostada, 'en progreso', 0, req.session.fichas);

        return res.status(200).json({ carta1Coupier: carta1Coupier, carta1Jugador: carta1Jugador, carta2Jugador: carta2Jugador});
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({ error: 'Ocurrió un error al jugar al blackjack' });
    }

}


async function actualizarAsesJugador(req, res)
{
    // Logging
    console.log('***********************************************************');
    console.log('Ruta: POST /juegos/blackjack/actualizarAsesJugador \n');

    req.session.puntosJugador -= 10;
    req.session.asesJugador--;

    return;
}


async function pedirCarta(req, res)
{
    // Logging
    console.log('***********************************************************');
    console.log('Ruta: POST /juegos/blackjack/pedirCarta \n');

    try
    {
        // Le agrego al usuario una carta al azar y sumo los puntos correspondientes
        const nuevaCartaJugador = posiblesCartas[Math.floor( Math.random() * 13 )]; 
        req.session.cartasJugador.push( nuevaCartaJugador );
        req.session.puntosJugador += valoresCartas[ nuevaCartaJugador ];

        // Si el jugador saco un As
        if( nuevaCartaJugador == 'A' ) req.session.asesJugador++;

        // Si el jugador saco un As y sus puntos son más de 21, el As pasa de valer 11 puntos a valer 1 punto
        if( req.session.puntosJugador > 21 && req.session.asesJugador > 0 )
        {
            req.session.puntosJugador -= 10;
            req.session.asesJugador--;
        }

        console.log( 'Cartas jugador: ', req.session.cartasJugador );
        console.log( 'Puntaje jugador', req.session.puntosJugador );
        console.log( 'Ases jugador', req.session.asesJugador );

        // Agrego el registro al historial del usuario
        if(req.session.puntosJugador > 21)
            agregarHistoria(req.session.nombre, 'Blackjack', 0, 'derrota', 0, req.session.fichas);

        return res.status(200).json({ nuevaCartaJugador: nuevaCartaJugador, puntosJugador: req.session.puntosJugador });
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({ error: 'Ocurrió un error al jugar al blackjack' });
    }

}



async function plantarse(req, res)
{
    // Logging
    console.log('***********************************************************');
    console.log('Ruta: POST /juegos/blackjack/plantarse \n');

    try
    {
        // Le doy cartas al crupier
        do
        {
            let nuevaCartaCroupier = posiblesCartas[Math.floor( Math.random() * 13 )]; 
            req.session.cartasCrupier.push( nuevaCartaCroupier );
            req.session.puntosCrupier += valoresCartas[ nuevaCartaCroupier ];
            
            if( nuevaCartaCroupier == 'A' ) req.session.asesCrupier++;

            if( req.session.puntosCrupier > 21 && req.session.asesCrupier > 0 )
            {
                req.session.puntosCrupier -= 10;
                req.session.asesCrupier--;
            }

        }
        while( req.session.puntosCrupier < 17 ); // Si el crupier tiene 17 o más, deja de sacar cartas

        // Determino quien gano la partida
        let ganador = null;
        if( req.session.puntosCrupier > req.session.puntosJugador && req.session.puntosCrupier <= 21 ) ganador = 'crupier';
        else if( req.session.puntosCrupier == req.session.puntosJugador )                             ganador = 'ninguno';
        else                                                                                          ganador = 'jugador';

        console.log( 'Cartas crupier: ', req.session.cartasCrupier );
        console.log( 'Puntaje crupier: ', req.session.puntosCrupier );
        console.log( 'Ases crupier: ', req.session.asesCrupier );
        console.log( 'Ganador: ', ganador );

        // Si el jugador gano, le doy la cantidad de fichas que corresponden
        let fichasGanadas = null;

        if(ganador == 'jugador' && req.session.puntosJugador == 21 && req.session.asesJugador == 1 && req.session.cartasJugador.length == 2)
        {
            fichasGanadas = Math.floor( req.session.cantidadApostada * 2.5 );
            req.session.fichas += fichasGanadas;
            cargarFichas(req.session.nombre, fichasGanadas);
            agregarHistoria(req.session.nombre, 'Blackjack', 0, 'victoria', fichasGanadas, req.session.fichas);
        }
        else if(ganador == 'jugador')
        {
            fichasGanadas = req.session.cantidadApostada * 2;
            req.session.fichas += fichasGanadas;
            cargarFichas(req.session.nombre, fichasGanadas);
            agregarHistoria(req.session.nombre, 'Blackjack', 0, 'victoria', fichasGanadas, req.session.fichas);
        }
        
        if(ganador == 'ninguno')
        {
            fichasGanadas = req.session.cantidadApostada;
            req.session.fichas += fichasGanadas;
            cargarFichas(req.session.nombre, fichasGanadas);
            agregarHistoria(req.session.nombre, 'Blackjack', 0, 'empate', fichasGanadas, req.session.fichas);
        }

        if(ganador == 'crupier')
        {
            agregarHistoria(req.session.nombre, 'Blackjack', 0, 'derrota', 0, req.session.fichas);
        }
        

        return res.status(200).json({ cartasCrupier: req.session.cartasCrupier, puntosCrupier: req.session.puntosCrupier, puntosJugador: req.session.puntosJugador, ganador: ganador, fichasGanadas: fichasGanadas });
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({ error: 'Ocurrió un error al jugar al blackjack' });
    }

}



module.exports = { getBlackjack, empezarPartida, actualizarAsesJugador, pedirCarta, plantarse };