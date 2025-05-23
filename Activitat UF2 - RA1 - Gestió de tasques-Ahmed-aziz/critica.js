import { Tasca } from "./Tasca.js";

export class Critica extends Tasca {
    #dataLimit;
    #descripcio;

    constructor(id, nom, prioritat, dataLimit, descripcio) {
        super(id, nom, prioritat, "Crítica");
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
        return `${super.mostrarInfoTasca()} | Data límit: ${this.#dataLimit} | Descripció: ${this.#descripcio}`;
    }
}
