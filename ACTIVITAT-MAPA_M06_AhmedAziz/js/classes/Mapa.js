export class Mapa {
    #map;
    #markers = [];
    #posicionActual = null;
    #marcadorPosicionActual = null;

    constructor() {
        // Inicializar el mapa en el elemento con id 'mapa'
        this.#map = L.map('mapa').setView([0, 0], 13);
        
        // Añadir capa de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
        
        // Obtener la posición actual
        this.#getPosicioActual()
            .then(coords => {
                this.#posicionActual = coords;
                this.mostrarPuntInicial();
            })
            .catch(error => {
                console.error("Error al obtener la posición actual:", error);
                // Posición por defecto en caso de error (Barcelona)
                this.#posicionActual = { lat: 41.3851, lng: 2.1734 };
                this.mostrarPuntInicial();
            });
    }

    // Método privado para obtener la posición actual
    #getPosicioActual() {
        return new Promise((resolve, reject) => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const coords = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        resolve(coords);
                    },
                    error => {
                        reject(error);
                    }
                );
            } else {
                reject(new Error("La geolocalización no está disponible en este navegador"));
            }
        });
    }

    // Mostrar el punto inicial (posición actual)
    mostrarPuntInicial() {
        if (this.#posicionActual) {
            this.#map.setView([this.#posicionActual.lat, this.#posicionActual.lng], 13);
            
            // Si ya había un marcador de posición actual, lo eliminamos
            if (this.#marcadorPosicionActual) {
                this.#map.removeLayer(this.#marcadorPosicionActual);
            }
            
            // Crear un nuevo marcador para la posición actual
            this.#marcadorPosicionActual = L.marker([this.#posicionActual.lat, this.#posicionActual.lng])
                .addTo(this.#map)
                .bindPopup("Estás aquí")
                .openPopup();
        }
    }

    // Actualizar la posición inicial del mapa
    actualitzarPosInitMapa(lat, lon) {
        this.#map.setView([lat, lon], 13);
    }

    // Mostrar un punto en el mapa
    mostrarPunt(lat, long, desc = "") {
        const marker = L.marker([lat, long]).addTo(this.#map);
        
        if (desc) {
            marker.bindPopup(desc);
        }
        
        this.#markers.push(marker);
        return marker;
    }

    // Borrar todos los puntos del mapa (excepto la posición actual)
    borrarPunt() {
        this.#markers.forEach(marker => {
            this.#map.removeLayer(marker);
        });
        
        this.#markers = [];
    }
}