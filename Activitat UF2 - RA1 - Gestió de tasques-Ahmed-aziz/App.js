class App {
    #tasques = [];

// Aquesta classe gestiona una llista de tasques, permetent afegir, completar, eliminar o modificar-ne el nom.
// També mostra la llista de tasques i el total actual de tasques.

    afegirTasca(tasca) {
        this.#tasques.push(tasca);
    }

    completarTasca(id) {
        const tasca = this.#tasques.find(t => t.id === id);
        if (tasca) {
            tasca.completada = true;
        }
    }

    eliminarTasca(id) {
        this.#tasques = this.#tasques.filter(t => t.id !== id);
        Tasca.totalTasques--;
    }

    modificaNomTasca(id, nom) {
        const tasca = this.#tasques.find(t => t.id === id);
        if (tasca) {
            tasca.nom = nom;
        }
    }

    actualitzarLlista() {
        this.#tasques.forEach(tasca => {
            console.log(tasca.mostrarInfoTasca());
        });
    }

    mostrarTotalTasques() {
        console.log(`Total de tasques: ${Tasca.obtenirTotalTasques()}`);
    }
}