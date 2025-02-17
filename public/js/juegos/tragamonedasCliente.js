function jugarTragamonedas()
{
    var fichas = parseInt(document.getElementById('fichas').innerText, 10);

    // Verifico si el usuario tiene las fichas suficientes para jugar
    if(fichas - 5 < 0) alert('No tienes suficiente fichas para jugar este juego');
    else
    {
        document.getElementById('fichas').innerText = fichas - 5; // Descuento las 5 fichas que cuesta jugar al tragamonedas
        fichas -= 5;

        // Solicitud al servidor
        fetch('http://localhost:777/juegos/tragamonedas', 
        { method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        })
        .then(response => response.json() )
        .then(data => {
            console.log(data);

            var filaArriba = data.filaArriba;
            var filaMedio  = data.filaMedio;
            var filaAbajo  = data.filaAbajo;

            const posiblesOpciones  = [ 'cereza.png', 'limon.png', 'sandia.png', 'bar.jpg', 'campana.png', 'diamante.png', '7.png' ];

            // Cambio la imagen segun el resultado obtenido (ANDA)
            document.getElementById('filaArriba slot 1 img').src = "/images/Juegos/Tragamonedas/" + posiblesOpciones.filter( opcion => opcion.includes( filaArriba[0] ) );
            document.getElementById('filaArriba slot 2 img').src = "/images/Juegos/Tragamonedas/" + posiblesOpciones.filter( opcion => opcion.includes( filaArriba[1] ) );
            document.getElementById('filaArriba slot 3 img').src = "/images/Juegos/Tragamonedas/" + posiblesOpciones.filter( opcion => opcion.includes( filaArriba[2] ) );

            document.getElementById('filaMedio slot 1 img').src = "/images/Juegos/Tragamonedas/" + posiblesOpciones.filter( opcion => opcion.includes( filaMedio[0] ) ); 
            document.getElementById('filaMedio slot 2 img').src = "/images/Juegos/Tragamonedas/" + posiblesOpciones.filter( opcion => opcion.includes( filaMedio[1] ) );
            document.getElementById('filaMedio slot 3 img').src = "/images/Juegos/Tragamonedas/" + posiblesOpciones.filter( opcion => opcion.includes( filaMedio[2] ) );

            document.getElementById('filaAbajo slot 1 img').src = "/images/Juegos/Tragamonedas/" + posiblesOpciones.filter( opcion => opcion.includes( filaAbajo[0] ) );
            document.getElementById('filaAbajo slot 2 img').src = "/images/Juegos/Tragamonedas/" + posiblesOpciones.filter( opcion => opcion.includes( filaAbajo[1] ) );
            document.getElementById('filaAbajo slot 3 img').src = "/images/Juegos/Tragamonedas/" + posiblesOpciones.filter( opcion => opcion.includes( filaAbajo[2] ) );


            // EXPERIMENTAL - COMIENZO
            /*const slot1    = document.getElementById('slot 1');
            const slot2    = document.getElementById('slot 2');
            const slot3    = document.getElementById('slot 3');

            const auxSlot1 = document.getElementById('aux slot 1');
            const auxSlot2 = document.getElementById('aux slot 2');
            const auxSlot3 = document.getElementById('aux slot 3');

            if( getComputedStyle(auxSlot1).opacity == "0" )
            {
                auxSlot1.src = "/images/Juegos/Tragamonedas/" + posiblesOpciones.filter( opcion => opcion.includes( resultados[0] ) ); 
                auxSlot1.classList.remove('hidden');
                slot1.classList.add('hidden');

                auxSlot2.src = "/images/Juegos/Tragamonedas/" + posiblesOpciones.filter( opcion => opcion.includes( resultados[1] ) ); 
                auxSlot2.classList.remove('hidden');
                slot2.classList.add('hidden');

                auxSlot3.src = "/images/Juegos/Tragamonedas/" + posiblesOpciones.filter( opcion => opcion.includes( resultados[2] ) ); 
                auxSlot3.classList.remove('hidden');
                slot3.classList.add('hidden');
            }
            else
            {
                slot1.src = "/images/Juegos/Tragamonedas/" + posiblesOpciones.filter( opcion => opcion.includes( resultados[0] ) ); 
                slot1.classList.remove('hidden');
                auxSlot1.classList.add('hidden');

                slot2.src = "/images/Juegos/Tragamonedas/" + posiblesOpciones.filter( opcion => opcion.includes( resultados[1] ) ); 
                slot2.classList.remove('hidden');
                auxSlot2.classList.add('hidden');

                slot3.src = "/images/Juegos/Tragamonedas/" + posiblesOpciones.filter( opcion => opcion.includes( resultados[2] ) ); 
                slot3.classList.remove('hidden');
                auxSlot3.classList.add('hidden');
            }*/
            // EXPERIMENTAL - FIN

            // Si el usuario gano
            if( filaMedio.every(valor => valor === filaMedio[0]) ) // every recorre cada elemento del arreglo y verifica si se cumple la condicion (en este caso reviso si todo los elementos son iguales al primero)
            {
                document.getElementById('filaMedio slot 1 div').style.backgroundColor = 'green';
                document.getElementById('filaMedio slot 2 div').style.backgroundColor = 'green';
                document.getElementById('filaMedio slot 3 div').style.backgroundColor = 'green';

                var sonido = new Audio('/sonidos/Tragamonedas/ganador 1.mp3');
                sonido.play();

                // Le sumo la cantidad de fichas que corresponde
                if( filaMedio[0] === 'cereza' || filaMedio[0] === 'limon' || filaMedio[0] === 'sandia' )
                {
                    alert('FELICITACIONES. Ganaste 50 fichas');
                    fichas += 50;
                } 
                
                if( filaMedio[0] === 'bar'    || filaMedio[0] === 'campana' )
                {
                    alert('FELICITACIONES. Ganaste 300 fichas');
                    fichas += 300;
                }
                    
                if( filaMedio[0] === 'diamante' || filaMedio[0] === '7')
                {
                    alert('FELICITACIONES. Ganaste 1000 fichas');
                    fichas += 1000;
                }

                document.getElementById('fichas').innerText = fichas;
            }
            else 
            {
                document.getElementById('filaMedio slot 1 div').style.backgroundColor = 'yellow';
                document.getElementById('filaMedio slot 2 div').style.backgroundColor = 'yellow';
                document.getElementById('filaMedio slot 3 div').style.backgroundColor = 'yellow';
            }
            
        })
        .catch(error => {
            console.log(error);
        })
    }

}