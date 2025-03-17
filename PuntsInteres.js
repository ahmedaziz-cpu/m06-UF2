class PuntInteres {
    static totalTasques = 0;

    #id;
    #esManual;
    pais;
    ciutat;
    nom;
    direccio;
    tipus;
    latitud;   
    longitud;
    puntuacio;

    constructor(id, esManual, pais, ciutat, nom, direccio, tipus, latitud, longitud, puntuacio) {
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

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
    }

    get esManual() {
        return this.#esManual;
    }

    set esManual(value) {
        this.#esManual = value;
    }

    static obtenirTotalElements() {
        return PuntInteres.totalTasques;
    }
}

