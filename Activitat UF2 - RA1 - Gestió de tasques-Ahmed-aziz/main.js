import { Tasca } from "./Tasca.js";
import { Urgent } from "./Urgent.js";
import { Critica } from "./Critica.js";
import { App } from "./App.js";

export const app = new App();

window.app = app;

window.afegirTascaHandler = function() {
    const nom = document.getElementById("nomTasca").value;
    const prioritat = parseInt(document.getElementById("prioritatTasca").value) || 1;
    const tipus = document.getElementById("tipusTasca").value;
    const recordatori = document.getElementById("recordatoriTasca").value;
    const descripcio = document.getElementById("descripcioTasca").value;
    const dataLimit = document.getElementById("dataLimitTasca").value;

    let tasca;
    const id = Tasca.obtenirTotalTasques() + 1;

    if (tipus === "normal") {
        tasca = new Tasca(id, nom, prioritat, "Normal");
    } else if (tipus === "urgent") {
        tasca = new Urgent(id, nom, prioritat, recordatori);
    } else if (tipus === "critica") {
        tasca = new Critica(id, nom, prioritat, dataLimit, descripcio);
    }

    if (tasca) app.afegirTasca(tasca);

    document.getElementById("nomTasca").value = "";
    document.getElementById("prioritatTasca").value = "";
    document.getElementById("recordatoriTasca").value = "";
    document.getElementById("descripcioTasca").value = "";
    document.getElementById("dataLimitTasca").value = "";
};

// Tests inicials
app.afegirTasca(new Tasca(1, "Tasca Normal 1", 2, "Normal"));
app.afegirTasca(new Tasca(2, "Tasca Normal 2", 4, "Normal"));
app.afegirTasca(new Urgent(3, "Tasca Urgent 1", 3, "Recordar enviar email"));
app.afegirTasca(new Urgent(4, "Tasca Urgent 2", 1, "Fer trucada important"));
app.afegirTasca(new Critica(5, "Tasca Crítica", 5, "2025-03-01", "Finalitzar projecte urgent"));
app.modificaNomTasca(2, "Tasca Normal 2 (Modificada)");
app.completarTasca(1);
app.completarTasca(3);
app.afegirTasca(new Tasca(6, "Nova Tasca Normal", 1, "Normal"));
app.eliminarTasca(4);
app.eliminarTasca(5);
