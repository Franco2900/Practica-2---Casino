function duracionAlAzar() 
{ 
    return (Math.random() * 30) + 20; // Duración entre 50s y 20s 
} 


function posicionAleatoria() 
{ 
    const altura = document.getElementById('plantillaSecundaria').clientHeight; 
    const ancho = document.getElementById('plantillaSecundaria').clientWidth; 
    const top = Math.random() * altura; 
    const left = Math.random() * ancho; 
    return { top, left }; 
}


window.onload = function() 
{ 
    const gif = document.querySelector('.moving-gif'); 
    gif.style.animationDuration = `${duracionAlAzar()}s`;
    
    const { top, left } = posicionAleatoria(); 
    gif.style.top = `${top}px`; 
    gif.style.left = `${left}px`;

    gif.addEventListener('animationiteration', function() 
    { 
        gif.style.animationDuration = `${duracionAlAzar()}s`; 
        const { top, left } = posicionAleatoria(); 
        gif.style.top = `${top}px`; 
        gif.style.left = `${left}px`; 

        // Reiniciar la animación de desvanecimiento 
        gif.style.animation = 'none'; 
        setTimeout(() => { 
            gif.style.animation = ''; 
        }, 10);
    });
}


