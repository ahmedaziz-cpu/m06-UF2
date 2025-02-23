const app = new App();
//Aquest codi simula la gestió d'una aplicació de tasques on es poden afegir, modificar, 
// completar i eliminar tasques, mostrant en tot moment l'estat actual de la llista i el nombre total de tasques.
app.actualitzarLlista();
app.mostrarTotalTasques();


const tasca1 = new Tasca(1, 'Tasca Normal 1', 1, 'Normal');
const tasca2 = new Tasca(2, 'Tasca Normal 2', 2, 'Normal');
const urgent1 = new Urgent(3, 'Tasca Urgent 1', 1, 'Recordatori 1');
const urgent2 = new Urgent(4, 'Tasca Urgent 2', 2, 'Recordatori 2');
const critica1 = new Critica(5, 'Tasca Critica 1', 1, '2025-12-31', 'Descripcio Critica 1');

app.afegirTasca(tasca1);
app.afegirTasca(tasca2);
app.afegirTasca(urgent1);
app.afegirTasca(urgent2);
app.afegirTasca(critica1);

app.actualitzarLlista();
app.mostrarTotalTasques();

app.modificaNomTasca(1, 'Tasca Normal 1 Modificada');
app.completarTasca(2);
app.completarTasca(3);

const tasca3 = new Tasca(6, 'Tasca Normal 3', 3, 'Normal');
app.afegirTasca(tasca3);

app.actualitzarLlista();
app.mostrarTotalTasques();

app.eliminarTasca(4);
app.eliminarTasca(5);

app.actualitzarLlista();
app.mostrarTotalTasques();