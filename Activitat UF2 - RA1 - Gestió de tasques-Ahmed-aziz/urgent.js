import { Tasca } from "./Tasca.js";

export class Urgent extends Tasca {
    #recordatori;

    constructor(id, nom, prioritat, recordatori) {
        super(id, nom, prioritat, "Urgent");
        this.#recordatori = recordatori;
    }

    mostrarInfoTasca() {
        return `${super.mostrarInfoTasca()} | Recordatori: ${this.#recordatori}`;
    }
}
