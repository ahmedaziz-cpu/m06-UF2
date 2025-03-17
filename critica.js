class Critica extends Tasca {
    #dataLimit;
    #descripcio;

    // Aquesta subclasse afegeix data límit i descripcio a les tasques critiques.
// Permet mostrar la informacio completa d'una tasca critica.

    constructor(id, nom, prioritat, dataLimit, descripcio) {
        super(id, nom, prioritat, 'Critica');
        this.#dataLimit = dataLimit;
        this.#descripcio = descripcio;
    }

    get dataLimit() {
        return this.#dataLimit;
    }

    set dataLimit(novaData) {
        this.#dataLimit = novaData;
    }

    mostrarInfoTasca() {
        return `${super.mostrarInfoTasca()}, Data Limit: ${this.#dataLimit}, Descripcio: ${this.#descripcio}`;
    }
}