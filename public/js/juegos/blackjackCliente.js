function empezarPartida()
{
    var cantidadApostada = parseInt( document.getElementById('cantidadApostada').value );
    var fichas           = parseInt( document.getElementById('fichas').innerText, 10 );

    if(fichas - cantidadApostada < 0) alert('No tienes suficiente fichas para jugar este juego');
    else
    {
        document.getElementById('fichas').innerText = fichas - cantidadApostada; // Descuento las 5 fichas que el jugador apostó
        fichas -= cantidadApostada;

        // Solicitud al servidor
        fetch('http://localhost:777/juegos/blackjack/empezarPartida', 
        { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cantidadApostada: cantidadApostada
            })
        })
        .then(response => response.json() )
        .then(data => {

            // Recibo los datos del servidor
            console.log(data);

            var carta1Coupier = data.carta1Coupier;
            var carta1Jugador = data.carta1Jugador;
            var carta2Jugador = data.carta2Jugador; 

            // Elimino y vuelvo a poner todas las cartas (esto sirve en caso de que el jugador empieze a jugar una partida después de completar una partida anterior ya que reinicia las cartas)
            // Elimino todas las cartas del jugador
            document.querySelectorAll('[id^="jugador carta"]').forEach(function(element) {
                element.remove();
            });

            // Elimino todas las cartas del crupier
            document.querySelectorAll('[id^="crupier carta"]').forEach(function(element) {
                element.remove();
            });
            

            // Pongo las cartas como si empezara una nueva partida
            const htmlCrupierCartas = `
            <div id="crupier carta 1" class="col-auto">
                <img id="crupier imagen carta 1" src="/images/Juegos/Blackjack/Reverso.png" class="img-fluid">
                <p class="text-center">Valor: <span id="crupier valor carta 1"></span></p>
            </div>
            <div id="crupier carta 2" class="col-auto">
                <img id="crupier imagen carta 2" src="/images/Juegos/Blackjack/Reverso.png" class="img-fluid">
                <p class="text-center">Valor: <span id="crupier valor carta 2"></span></p>
            </div>
            `;

            document.getElementById('filas cartas crupier').innerHTML = htmlCrupierCartas;

            const htmlJugadorCartas = `
            <div id="jugador carta 1" class="col-auto">
                <img id="jugador imagen carta 1" src="/images/Juegos/Blackjack/Reverso.png" class="img-fluid">
                <p class="text-center">Valor: <span id="jugador valor carta 1"></span></p>
            </div>
            <div id="jugador carta 2" class="col-auto">
                <img id="jugador imagen carta 2" src="/images/Juegos/Blackjack/Reverso.png" class="img-fluid">
                <p class="text-center">Valor: <span id="jugador valor carta 2"></span></p>
            </div>
            `;

            document.getElementById('fila cartas jugador').innerHTML = htmlJugadorCartas;


            // Cambio las imagenes
            document.getElementById('jugador imagen carta 1').src = "/images/Juegos/Blackjack/" + carta1Jugador + '.png';
            document.getElementById('jugador imagen carta 2').src = "/images/Juegos/Blackjack/" + carta2Jugador + '.png';
            document.getElementById('crupier imagen carta 1').src = "/images/Juegos/Blackjack/" + carta1Coupier + '.png';

            // Verifico que cartas saco el jugador
            // Espera un pequeño tiempo para asegurarse que las imágenes se carguen antes de evaluar las cartas
            setTimeout(function() {

                if (carta1Jugador == 'A') document.getElementById('jugador valor carta 1').innerText = 'A';
                else                      document.getElementById('jugador valor carta 1').innerText = evaluarCarta(carta1Jugador);

                if (carta2Jugador == 'A') document.getElementById('jugador valor carta 2').innerText = 'A';
                else                      document.getElementById('jugador valor carta 2').innerText = evaluarCarta(carta2Jugador);

                document.getElementById('jugador puntos').innerText = evaluarCarta(carta1Jugador) + evaluarCarta(carta2Jugador);

            }, 50); // Milisegundos


            // Verifico que cartas saco el crupier
            carta1Coupier = evaluarCarta(carta1Coupier, true);
            document.getElementById('crupier puntos').innerText = carta1Coupier;
            document.getElementById('crupier valor carta 1').innerText = carta1Coupier;

            // Deshabilito la modificación del input una vez empezada la partida
            document.getElementById("cantidadApostada").disabled = true;

            // Quito el boton de empezar partida y agrego las opciones del jugador
            //document.getElementById('cantidadApostada').insertAdjacentElement('afterend', document.createElement('br') );
            document.getElementById('botonEmpezarPartida').style.display = 'none';

            // Boton Pedir Carta
            var botonPedirCarta = document.createElement('button');
            botonPedirCarta.innerHTML = 'Pedir carta';
            botonPedirCarta.id = 'botonPedirCarta';
            botonPedirCarta.style.marginRight = '10px';
            botonPedirCarta.addEventListener('click', pedirCarta );
            document.getElementById('botonEmpezarPartida').insertAdjacentElement('afterend', botonPedirCarta);

            // Boton Plantarse
            var botonPlantarse = document.createElement('button');
            botonPlantarse.innerHTML = 'Plantarse';
            botonPlantarse.id = 'botonPlantarse';
            botonPlantarse.style.marginRight = '10px';
            botonPlantarse.addEventListener('click', plantarse );
            document.getElementById('botonPedirCarta').insertAdjacentElement('afterend', botonPlantarse);

        })
        .catch(error => {
            console.log(error);
        })

    }
}


function evaluarCarta( carta, esCrupier = false, puntosJugador = 0 )
{
    if( parseInt(carta, 10) >= 2 && parseInt(carta, 10) <= 10 ) return parseInt(carta, 10);

    if( carta == 'J' || carta == 'Q' || carta == 'K' ) return 10;
    
    if( carta == 'A' )
    {
        if( esCrupier ) return 11;
        
        if( !esCrupier && puntosJugador <= 10) // Si el jugador tiene 10 puntos o menos, debe elegir si la A vale 1 o 11
        {
            var valor = 1; 

            do 
            {
                valor = prompt( 'Sacaste una A. Elige el valor de dicha carta (debe ser 1 o 11)' );
                valor = parseInt(valor, 10);
            } 
            while( isNaN(valor) || (valor !== 1 && valor !== 11) );
            
            if(valor == 1)
            {
                fetch('http://localhost:777/juegos/blackjack/actualizarAsesJugador', {
                    method: 'POST',
                })
                .then(() => {
                    console.log('Datos enviados correctamente');
                })
                .catch(error => {
                    console.log(error);
                })            
            }

            return valor;
        }
        else return 1; // Si el jugador tiene 11 puntos o más, la A vale automaticamente 1

    }

}



function pedirCarta() 
{
    fetch('http://localhost:777/juegos/blackjack/pedirCarta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(data => {
        // Recibo los datos del servidor
        const nuevaCartaJugador = data.nuevaCartaJugador; 
        const puntosJugador     = data.puntosJugador;

        // Calculo el nuevo ID de la nueva carta
        const imagenesCartasJugador = Array.from(document.querySelectorAll('[id^="jugador carta"]')); // Obtengo un arreglo con todos las cartas del jugador
        const ultimoID = imagenesCartasJugador.length ? parseInt(imagenesCartasJugador.pop().id.split(' ')[2]) : 0; // Obtengo el ID del último elemento del arreglo
        const nuevoUltimoID = (ultimoID + 1).toString();

        // Añado la nueva carta al jugador
        const divNuevaCarta = document.createElement('div');
        divNuevaCarta.id = `jugador carta ${nuevoUltimoID}`;
        divNuevaCarta.classList.add('col-auto');
        document.getElementById(`jugador carta ${ultimoID}`).insertAdjacentElement('afterend', divNuevaCarta);

        divNuevaCarta.innerHTML = `
            <img id="jugador imagen carta ${nuevoUltimoID}" src="/images/Juegos/Blackjack/${nuevaCartaJugador}.png" class="img-fluid" />
            <p class="text-center">Valor: <span id="jugador valor carta ${nuevoUltimoID}"></span></p>
        `;

        // Evaluo la nueva carta que le toco al usuario y sumo los puntos nuevos del jugador
        setTimeout(() => {

            document.getElementById('jugador puntos').innerText = puntosJugador;

            if (nuevaCartaJugador == 'A') document.getElementById(`jugador valor carta ${nuevoUltimoID}`).textContent = 'A';
            else                          document.getElementById(`jugador valor carta ${nuevoUltimoID}`).textContent = evaluarCarta(nuevaCartaJugador, false, puntosJugador);

            if (puntosJugador > 21) 
            {
                alert('PERDISTE. Te pasaste de 21.');
                location.reload();
            }

        }, 50);

    })
    .catch(error => {
        console.log(error);
    })

}



function plantarse() 
{
    fetch('http://localhost:777/juegos/blackjack/plantarse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        // Recibo los datos del servidor
        const cartasCrupier = data.cartasCrupier;
        const puntosCrupier = data.puntosCrupier;
        const puntosJugador = data.puntosJugador;
        const ganador   = data.ganador;
        console.log(data)

        // Borro todas las cartas del crupier para reemplazarlas luego por las que me envia el servidor
        document.querySelectorAll('[id^="crupier carta"]').forEach(element => element.remove());
        
        let nuevoUltimoID = 0;

        // Añado las nuevas cartas al crupier
        cartasCrupier.forEach(carta => {

            nuevoUltimoID++;
            const divNuevaCarta = document.createElement('div');
            divNuevaCarta.id = `crupier carta ${nuevoUltimoID}`;
            divNuevaCarta.classList.add('col-auto');
            document.getElementById('filas cartas crupier').appendChild(divNuevaCarta);

            divNuevaCarta.innerHTML = `
                <img id="crupier imagen carta ${nuevoUltimoID}" src="/images/Juegos/Blackjack/${carta}.png" class="img-fluid" />
                <p class="text-center">Valor: <span id="crupier valor carta ${nuevoUltimoID}"></span></p>
            `;
            
            if (carta == 'A') document.getElementById(`crupier valor carta ${nuevoUltimoID}`).textContent = 'A';
            else              document.getElementById(`crupier valor carta ${nuevoUltimoID}`).textContent = evaluarCarta(carta, true);
        });

        document.getElementById('crupier puntos').innerText = puntosCrupier;

        // Espera un pequeño tiempo para asegurarse que las imágenes se carguen antes de evaluar las cartas
        setTimeout(() => {

            if (ganador == 'crupier') alert(`PERDISTE \n\nPuntos Crupier: ${puntosCrupier} \nTus puntos: ${puntosJugador}`);

            if (ganador == 'jugador') 
            {
                alert(`GANASTE \n\nPuntos Crupier: ${puntosCrupier} \nTus puntos: ${puntosJugador} \n\nGanaste ${data.fichasGanadas} fichas`);
                
                var fichas = parseInt( document.getElementById('fichas').innerText, 10 );
                document.getElementById('fichas').innerText = fichas + parseInt(data.fichasGanadas, 10);
            }
            if (ganador == 'ninguno')
            {
                alert(`EMPATE \n\nPuntos Crupier: ${puntosCrupier} \nTus puntos: ${puntosJugador} \nRecuperas las fichas que apostaste: ${data.fichasGanadas}`);

                var fichas = parseInt( document.getElementById('fichas').innerText, 10 );
                document.getElementById('fichas').innerText = fichas + parseInt(data.fichasGanadas, 10);
            }
        
        }, 200); // Milisegundos

        // Vuelvo a habilitar la modificación del input una vez empezada una nueva partida
        document.getElementById("cantidadApostada").disabled = false;

        // Quito las opciones de partida y vuelvo a poner el boton empezar partida
        document.getElementById('botonPedirCarta').style.display = 'none';
        document.getElementById('botonPlantarse').style.display = 'none';
        document.getElementById('botonEmpezarPartida').style.display = 'inline';
    })
    .catch(error => {
        console.log(error);
    })

}
