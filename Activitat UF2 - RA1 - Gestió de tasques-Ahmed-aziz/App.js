export class App {
    #tasques = [];

    afegirTasca(tasca) {
        this.#tasques.push(tasca);
        this.actualitzarLlista();
    }

    completarTasca(id) {
        const tasca = this.#tasques.find(t => t.id === id);
        if (tasca) tasca.completada = true;
        this.actualitzarLlista();
    }

    eliminarTasca(id) {
        this.#tasques = this.#tasques.filter(t => t.id !== id);
        this.actualitzarLlista();
    }

    modificaNomTasca(id, nom) {
        const tasca = this.#tasques.find(t => t.id === id);
        if (tasca) tasca.nom = nom;
        this.actualitzarLlista();
    }

    actualitzarLlista() {
        const llista = document.getElementById("llistaTasques");
        llista.innerHTML = "";
        this.#tasques.forEach(t => {
            const div = document.createElement("div");
            div.className = `tasca ${t.estaCompletada() ? "completada" : ""}`;
            div.innerHTML = `<p>${t.mostrarInfoTasca()}</p>
                             <button onclick="app.completarTasca(${t.id})">Completar</button>
                             <button onclick="app.eliminarTasca(${t.id})">Eliminar</button>`;
            llista.appendChild(div);
        });
        document.getElementById("totalTasques").innerText = this.mostrarTotalTasques();
    }

    mostrarTotalTasques() {
        return this.#tasques.length;
    }
}
