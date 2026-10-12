const API_KEY = 'c5ef1b76f88f2933cd39ccfdbee6a481'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

const seriesGrid    = document.getElementById('series-grid');
const loadingDiv    = document.getElementById('loading');
const errorDiv      = document.getElementById('error');
const errorMessage  = document.getElementById('error-message');
const resultsTitle  = document.getElementById('results-title');
const resultsCount  = document.getElementById('results-count');
const searchInput   = document.getElementById('search');
const clearBtn      = document.getElementById('clear-search');
const retryBtn      = document.getElementById('retry-btn');
const themeToggle   = document.getElementById('theme-toggle');
const modal         = document.getElementById('serie-modal');
const modalBody     = document.getElementById('modal-body');
const modalClose    = document.getElementById('modal-close');
const modalOverlay  = document.getElementById('modal-overlay');


// ============================================================================
// UTILIDADES DE UI (DADO - no modificar)
// ============================================================================
const mostrarLoading = () => {
    loadingDiv.style.display = 'flex';
    errorDiv.style.display = 'none';
    seriesGrid.innerHTML = '';
};

const ocultarLoading = () => {
    loadingDiv.style.display = 'none';
};

const mostrarError = (mensaje) => {
    ocultarLoading();
    errorMessage.textContent = mensaje;
    errorDiv.style.display = 'flex';
    seriesGrid.innerHTML = '';
};


// ============================================================================
// DARK MODE (DADO - no modificar)
// ============================================================================
const aplicarTema = (tema) => {
    document.documentElement.setAttribute('data-theme', tema);
    themeToggle.textContent = tema === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', tema);
};

const cargarTema = () => {
    const guardado = localStorage.getItem('theme');
    const preferido = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    aplicarTema(guardado || preferido);
};

themeToggle.addEventListener('click', () => {
    const actual = document.documentElement.getAttribute('data-theme');
    aplicarTema(actual === 'dark' ? 'light' : 'dark');
});

cargarTema();

const obtenerSeries = async()=>{
    const url = `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=es-ES`;
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    console.log("Obtener Series");
    return datos.results;
}

const crearTarjeta=(serie) =>{
    const{name, first_air_date, vote_average,poster_path} = serie;
    const año = first_air_date;
    const imagen = poster_path ? `${IMAGE_URL}${poster_path}`:'';
    const rating = vote_average ? vote_average.toFixed(1):'N/A';
    return `
        <article class="series-card">
            <div class="serie-card__poster">
                <img class="serie-card__image" src = "${imagen}" alt="${name}">
                <span class="serie-card__rating">${rating}</span>
            </div>
            <div class="serie-card__content">
                <h3 class="serie-card__title">${name}</h3>
                <p class="serie-card__year">${año}</p>
            </div>
        </article>
    `;
}
/*
const busqueda = async(texto)=>{
    if(!texto || texto.trim() === ''){
        return obtenerSeries;
    }
    const query = encodeURIComponent(texto.trim());
    const url = `${BASE_URL}/search/tv?api_key=${API_KEY}&language=es-ES&query=${query}`;
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    console.log("Obtener Series");
    return datos.results;
}
let timeoutBusqueda = null;
searchInput.addEventListener('input',(evento) => {
    const texto = evento.target.value;
    clearTimeout(timeoutBusqueda);
    timeoutBusqueda=setTimeout(async ()=>{
        console.log(`Buscando `);
        mostrarLoading();
        try{
            const series = await busqueda(texto);
            ocultarLoading();
            if(series.length === 0){
                seriesGrid.innerHTML=`
                    <p>No se encontrar series con la palabra ${texto} </p>
                `
            }
            seriesGrid.innerHTML=series.map(crearTarjeta).join('');
            console.log(`${series.length} resultados`)
        }catch(error){

        }
    },500);
})
clearBtn.addEventListener('click', () =>{
    searchInput.value = "";
    iniciar();
})
*/
const iniciar = async()=>{
    console.log('Mostrar series');
    mostrarLoading();
    try{
        const series = await obtenerSeries();
        console.log(`${series.length} series obtenidas`)
        ocultarLoading();
        seriesGrid.innerHTML=series.map(crearTarjeta).join('');
        console.log('Primera serie renderizada');
    }catch(error){
        console.log('Eroor', error);
        let mensaje ='No se pudo cargar peliculas';
        if(error.message.includes('401')){
            mensaje = 'API Key invalida, verifica tu clave';
        }else if(error.message.includes('fetch')){
            mensaje = 'Error de red';
        }else if(error.message.includes('429')){
            mensaje = 'Existe demasiadas peticiones. Espera un momento';
        }
        mostrarError();
    }
    
    
    //const primera = peliculas[0];
    //console.log('Primera pelicula',primera);
    
}



iniciar();
