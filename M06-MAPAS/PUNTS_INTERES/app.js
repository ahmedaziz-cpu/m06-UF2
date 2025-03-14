document.addEventListener('DOMContentLoaded', () => {
    const tipoSelect = document.getElementById('tipo');
    const ordenacionSelect = document.getElementById('ordenacion');
    const filtroNombreInput = document.getElementById('filtroNombre');
    const listaPuntosDiv = document.getElementById('listaPuntos');
    const totalElementosSpan = document.getElementById('totalElementos');
    const limpiarListaBtn = document.getElementById('limpiarLista');
    const zonaArrastreDiv = document.getElementById('zonaArrastre');
    const mapDiv = document.getElementById('map');

    let puntosInteres = [];
    let mapa;

    // Inicializar el mapa
    function inicializarMapa() {
        mapa = L.map(mapDiv).setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapa);
        mostrarPuntoInicial();
    }

    // Mostrar punto inicial en el mapa
    function mostrarPuntoInicial() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                L.marker([lat, lon]).addTo(mapa)
                    .bindPopup('Estás aquí')
                    .openPopup();
                mapa.setView([lat, lon], 13);
            });
        }
    }

    // Leer archivo CSV
    function leerCSV(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const lines = text.split('\n');
            lines.forEach(line => {
                const [tipo, pais, ciudad, nombre, direccion, tipoLugar, latitud, longitud, puntuacion] = line.split(',');
                if (tipo && pais && ciudad && nombre && direccion && tipoLugar && latitud && longitud && puntuacion) {
                    const punto = {
                        tipo,
                        pais,
                        ciudad,
                        nombre,
                        direccion,
                        tipoLugar,
                        latitud: parseFloat(latitud),
                        longitud: parseFloat(longitud),
                        puntuacion: parseFloat(puntuacion)
                    };
                    puntosInteres.push(punto);
                    mostrarPuntoEnMapa(punto);
                }
            });
            actualizarListaPuntos();
        };
        reader.readAsText(file);
    }

    // Mostrar punto en el mapa
    function mostrarPuntoEnMapa(punto) {
        L.marker([punto.latitud, punto.longitud]).addTo(mapa)
            .bindPopup(`${punto.nombre} (${punto.tipoLugar})`)
            .openPopup();
    }

    // Actualizar lista de puntos de interés
    function actualizarListaPuntos() {
        listaPuntosDiv.innerHTML = '';
        puntosInteres.forEach(punto => {
            const puntoDiv = document.createElement('div');
            puntoDiv.classList.add('punto');
            puntoDiv.innerHTML = `
                <p>${punto.ciudad} | Tipo: ${punto.tipoLugar}</p>
                <button class="eliminar" data-id="${punto.id}">Eliminar</button>
            `;
            listaPuntosDiv.appendChild(puntoDiv);
        });
        totalElementosSpan.textContent = puntosInteres.length;
    }

    // Manejar arrastre de archivos
    zonaArrastreDiv.addEventListener('dragover', (event) => {
        event.preventDefault();
        zonaArrastreDiv.classList.add('dragover');
    });

    zonaArrastreDiv.addEventListener('dragleave', () => {
        zonaArrastreDiv.classList.remove('dragover');
    });

    zonaArrastreDiv.addEventListener('drop', (event) => {
        event.preventDefault();
        zonaArrastreDiv.classList.remove('dragover');
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'text/csv') {
                leerCSV(file);
            } else {
                alert('El archivo no es un CSV');
            }
        }
    });

+    inicializarMapa();
});