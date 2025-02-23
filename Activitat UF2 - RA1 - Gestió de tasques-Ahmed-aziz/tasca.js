class Tasca {
    static totalTasques = 0;

    #id;
    #nom;
    #completada;
    prioritat;
    tipus;
    
// Aquesta classe gestiona tasques amb un id, nom, prioritat i tipus, i compta les tasques totals.
// Permet marcar una tasca com completada i mostrar la seva informacio.

    constructor(id, nom, prioritat, tipus) {
        this.#id = id;
        this.#nom = nom;
        this.#completada = false;
        this.prioritat = prioritat;
        this.tipus = tipus;
        Tasca.totalTasques++;
    }

    get id() {
        return this.#id;
    }

    set id(id) {
        this.#id = id;
    }
    

    get nom() {
        return this.#nom;
    }

    set nom(nom) {
        this.#nom = nom;
    }

    set completada(completada) {
        this.#completada = completada;
    }

    estaCompletada() {
        return this.#completada;
    }

    mostrarInfoTasca() {
        return `Nom: ${this.#nom}, Tipus: ${this.tipus}, Prioritat: ${this.prioritat}, Completada: ${this.#completada}`;
    }

    static obtenirTotalTasques() {
        return Tasca.totalTasques;
    }
}