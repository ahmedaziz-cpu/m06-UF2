// Clase base para los puntos de interés
export class PuntInteres {
    #id;
    #esManual;
    static totalTasques = 0;

    constructor(id, pais, ciutat, nom, direccio, tipus, latitud, longitud, puntuacio, esManual = false) {
        this.#id = id;
        this.#esManual = esManual;
        this.pais = pais;
        this.ciutat = ciutat;
        this.nom = nom;
        this.direccio = direccio;
        this.tipus = tipus;
        this.latitud = latitud;
        this.longitud = longitud;
        this.puntuacio = puntuacio;
        PuntInteres.totalTasques++;
    }

    // Getters y setters
    get id() {
        return this.#id;
    }

    set id(newId) {
        this.#id = newId;
    }

    get esManual() {
        return this.#esManual;
    }

    set esManual(value) {
        this.#esManual = value;
    }

    // Método estático para obtener el total de elementos
    static obtenirTotalElements() {
        return PuntInteres.totalTasques;
    }
}