export class Tasca {
    static totalTasques = 0;

    #id;
    #nom;

    constructor(id, nom, prioritat, tipus) {
        this.#id = id;
        this.#nom = nom;
        this.completada = false;
        this.prioritat = prioritat;
        this.tipus = tipus;
        Tasca.totalTasques++;
    }

    get id() {
        return this.#id;
    }

    get nom() {
        return this.#nom;
    }

    set nom(nouNom) {
        this.#nom = nouNom;
    }

    set completada(estat) {
        this._completada = estat;
    }

    estaCompletada() {
        return this._completada;
    }

    mostrarInfoTasca() {
        return `${this.nom} | Tipus: ${this.tipus} | Prioritat: ${this.prioritat} | Completada: ${this.estaCompletada() ? "Sí" : "No"}`;
    }

    static obtenirTotalTasques() {
        return Tasca.totalTasques;
    }
}
