/* class Map {
    constructor() {
        this.map = null;
        this.currentPosition = null;
        this.initMap();
        this.mostrarPuntInicial();
    }

    initMap() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.currentPosition = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };
                this.map = new google.maps.Map(document.getElementById('map'), {
                    center: { lat: this.currentPosition.lat, lng: this.currentPosition.lon },
                    zoom: 15
                });
                this.mostrarPunt(this.currentPosition.lat, this.currentPosition.lon, "Posició Actual");
            });
        } else {
            console.error("Geolocalització no suportada pel navegador.");
        }
    }

    mostrarPuntInicial() {
        if (this.currentPosition) {
            this.mostrarPunt(this.currentPosition.lat, this.currentPosition.lon, "Posició Inicial");
        }
    }

    actualitzarPosInitMapa(lat, lon) {
        this.map.setCenter({ lat: lat, lng: lon });
        this.mostrarPunt(lat, lon, "Posició Actualitzada");
    }

    mostrarPunt(lat, lon, desc = "") {
        const marker = new google.maps.Marker({
            position: { lat: lat, lng: lon },
            map: this.map,
            title: desc
        });

        const infoWindow = new google.maps.InfoWindow({
            content: desc
        });

        marker.addListener('click', () => {
            infoWindow.open(this.map, marker);
        });
    }

    borrarPunt() {
        if (this.markers) {
            this.markers.forEach(marker => marker.setMap(null));
            this.markers = [];
        }
    }

    getPosicioActual() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                }, (error) => {
                    reject(error);
                });
            } else {
                reject(new Error("Geolocalització no suportada pel navegador."));
            }
        });
    }
} */