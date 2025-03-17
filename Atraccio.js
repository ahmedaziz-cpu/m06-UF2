class Atraccio extends PuntsInteres {
    #recordatori;

// Aquesta subclasse gestiona tasques urgents afegint un recordatori.  
// Permet mostrar la informacio d'una tasca urgent amb el seu recordatori.

    constructor(id, nom, prioritat, recordatori) {
        super(id, nom, prioritat, 'Urgent');
        this.#recordatori = recordatori;
    }

    mostrarInfoTasca() {
        return `${super.mostrarInfoTasca()}, Recordatori: ${this.#recordatori}`;
    }
}