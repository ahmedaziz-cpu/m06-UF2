// Importar las clases
import { PuntInteres } from './classes/PuntInteres.js';
import { Atraccio } from './classes/Atraccio.js';
import { Museu } from './classes/Museu.js';
import { Mapa } from './classes/Mapa.js';
import { Excel } from './classes/Excel.js';

// Variables globales
let mapa;
let puntosInteres = [];
let tiposUnicos = new Set(['todos']);
let excel;

// Esperamos a que cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    inicializar();
});

// Función de inicialización
function inicializar() {
    // Inicializar el mapa
    mapa = new Mapa();
    excel = new Excel();

    // Configurar la zona de arrastre
    configurarDropZone();

    // Configurar los filtros
    configurarFiltros();

    // Configurar el botón de limpiar
    document.getElementById('limpiarLista').addEventListener('click', limpiarDatos);
}

// Configurar la zona para arrastrar archivos CSV
function configurarDropZone() {
    const dropZone = document.getElementById('dropZone');

    // Prevenir comportamiento por defecto de arrastre
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    // Cambiar estilos al arrastrar
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('active');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('active');
        }, false);
    });

    // Manejar archivo soltado
    dropZone.addEventListener('drop', handleDrop, false);
}

// Prevenir comportamiento por defecto
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Manejar el evento de soltar archivo
function handleDrop(e) {
    const dt = e.dataTransfer;
    const file = dt.files[0];

    // Verificar si el archivo es CSV
    if (file.name.endsWith('.csv')) {
        procesarCSV(file);
    } else {
        alert("El fichero no es csv");
    }
}

// Procesar el archivo CSV
async function procesarCSV(file) {
    try {
        // Leer el CSV
        const datos = await excel.readCSV(file);

        if (datos.length === 0) {
            alert("No se encontraron datos en el archivo CSV");
            return;
        }

        // Limpiar datos anteriores
        limpiarDatos();

        // Obtener info del país del primer elemento
        const primerElemento = datos[0];
        const codigoPais = primerElemento.codi || primerElemento.code;

        if (codigoPais) {
            try {
                const infoPais = await excel.getInfoCountry(codigoPais);
                infoPais.city = primerElemento.ciutat || primerElemento.ciudad || '';
                
                // Mostrar información del país
                mostrarInfoPais(infoPais);
                
                // Actualizar posición del mapa
                mapa.actualitzarPosInitMapa(infoPais.lat, infoPais.long);
            } catch (error) {
                console.error("Error al obtener información del país:", error);
            }
        }

        // Procesar cada fila y crear objetos de puntos de interés
        datos.forEach((fila, index) => {
            let punto;
            const id = index + 1;
            const tipo = fila.tipus || fila.tipo;
            
            // Añadir el tipo al conjunto de tipos únicos
            if (tipo) {
                tiposUnicos.add(tipo);
            }
            
            // Crear el objeto adecuado según el tipo
            switch (tipo) {
                case 'Espai':
                case 'Espacio':
                    punto = new PuntInteres(
                        id,
                        fila.pais,
                        fila.ciutat || fila.ciudad,
                        fila.nom || fila.nombre,
                        fila.direccio || fila.direccion,
                        tipo,
                        fila.latitud,
                        fila.longitud,
                        fila.puntuacio || fila.puntuacion
                    );
                    break;
                    
                case 'Atraccio':
                case 'Atraccion':
                    punto = new Atraccio(
                        id,
                        fila.pais,
                        fila.ciutat || fila.ciudad,
                        fila.nom || fila.nombre,
                        fila.direccio || fila.direccion,
                        tipo,
                        fila.latitud,
                        fila.longitud,
                        fila.puntuacio || fila.puntuacion,
                        fila.horaris || fila.horarios,
                        fila.preu || fila.precio,
                        fila.moneda
                    );
                    break;
                    
                case 'Museu':
                case 'Museo':
                    punto = new Museu(
                        id,
                        fila.pais,
                        fila.ciutat || fila.ciudad,
                        fila.nom || fila.nombre,
                        fila.direccio || fila.direccion,
                        tipo,
                        fila.latitud,
                        fila.longitud,
                        fila.puntuacio || fila.puntuacion,
                        fila.horaris || fila.horarios,
                        fila.preu || fila.precio,
                        fila.moneda,
                        fila.descripcio || fila.descripcion
                    );
                    break;
                    
                default:
                    // Si el tipo no coincide con ninguno de los esperados, crear un PuntInteres genérico
                    punto = new PuntInteres(
                        id,
                        fila.pais,
                        fila.ciutat || fila.ciudad,
                        fila.nom || fila.nombre,
                        fila.direccio || fila.direccion,
                        tipo,
                        fila.latitud,
                        fila.longitud,
                        fila.puntuacio || fila.puntuacion
                    );
            }


            
            puntosInteres.push(punto);
        });

        // Actualizar el menú desplegable de tipos
        actualizarMenuTipos();
        
        // Mostrar los puntos de interés en la lista y en el mapa
        actualizarVistaPuntos();
        
    } catch (error) {
        console.error("Error al procesar el CSV:", error);
        alert("Error al procesar el archivo CSV");
    }
}

// Mostrar información del país
function mostrarInfoPais(infoPais) {
    const banderaImg = document.getElementById('bandera');
    const ciudadPaisSpan = document.getElementById('ciudadPais');
    
    if (infoPais.flag) {
        banderaImg.src = infoPais.flag;
        banderaImg.style.display = 'inline';
    }
    
    ciudadPaisSpan.textContent = infoPais.city || '';
}

// Actualizar el menú desplegable de tipos
function actualizarMenuTipos() {
    const tipoFiltro = document.getElementById('tipoFiltro');
    tipoFiltro.innerHTML = ''; // Limpiar opciones existentes
    
    // Añadir la opción "todos"
    const optionTodos = document.createElement('option');
    optionTodos.value = 'todos';
    optionTodos.textContent = 'Todos';
    tipoFiltro.appendChild(optionTodos);
    
    // Añadir cada tipo único
    tiposUnicos.forEach(tipo => {
        if (tipo !== 'todos') {
            const option = document.createElement('option');
            option.value = tipo;
            option.textContent = tipo;
            tipoFiltro.appendChild(option);
        }
    });
}

// Mostrar los puntos de interés en la lista y en el mapa
function actualizarVistaPuntos(puntosFiltrados = null) {
    const listaPuntos = document.getElementById('listaPuntos');
    const totalElementos = document.getElementById('totalElementos');
    const puntos = puntosFiltrados || puntosInteres;
    
    // Limpiar la lista y el mapa
    listaPuntos.innerHTML = '';
    mapa.borrarPunt();
    
    if (puntos.length === 0) {
        listaPuntos.innerHTML = '<p>No hay información para mostrar</p>';
        totalElementos.textContent = '0';
        return;
    }
    
    // Mostrar cada punto en la lista y en el mapa
    puntos.forEach(punto => {
        // Crear elemento para la lista
        const puntoItem = document.createElement('div');
        puntoItem.className = `punto-item tipo-${punto.tipus.toLowerCase()}`;
        puntoItem.dataset.id = punto.id;
        
        // Contenido según el tipo
        let contenido = '';
        
        switch(punto.tipus) {
            case 'Espai':
            case 'Espacio':
                contenido = `
                    <h3>${punto.nom}</h3>
                    <p>${punto.ciutat} | Tipo: ${punto.tipus}</p>
                `;
                break;
                
            case 'Atraccio':
            case 'Atraccion':
                contenido = `
                    <h3>${punto.nom}</h3>
                    <p>${punto.ciutat} | Tipo: ${punto.tipus} | ${punto.horaris || 'Sin horarios'} | ${punto.preuIva}</p>
                `;
                break;
                
            case 'Museu':
            case 'Museo':
                contenido = `
                    <h3>${punto.nom}</h3>
                    <p>${punto.ciutat} | Tipo: ${punto.tipus} | ${punto.horaris || 'Sin horarios'} | ${punto.preuIva}</p>
                    <p>${punto.descripcio || 'Sin descripción'}</p>
                `;
                break;
                
            default:
                contenido = `
                    <h3>${punto.nom}</h3>
                    <p>${punto.ciutat} | Tipo: ${punto.tipus}</p>
                `;
        }
        
        // Añadir botón de eliminar
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'X';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            confirmarEliminarPunto(punto.id);
        });
        
        puntoItem.innerHTML = contenido;
        puntoItem.appendChild(deleteBtn);
        listaPuntos.appendChild(puntoItem);
        
        // Mostrar en el mapa
        if (punto.latitud && punto.longitud) {
            const popupContent = `
                <div class="popup-content">
                    <h3>${punto.nom}</h3>
                    <p><strong>Dirección:</strong> ${punto.direccio}</p>
                    ${punto.tipus === 'Museu' || punto.tipus === 'Museo' || punto.tipus === 'Atraccio' || punto.tipus === 'Atraccion' ? 
                        `<p><strong>Horario:</strong> ${punto.horaris || 'No disponible'}</p>
                         <p><strong>Precio:</strong> ${punto.preuIva}</p>` : ''}
                    ${punto.tipus === 'Museu' || punto.tipus === 'Museo' ? 
                        `<p><strong>Descripción:</strong> ${punto.descripcio || 'No disponible'}</p>` : ''}
                </div>
            `;
            
            mapa.mostrarPunt(punto.latitud, punto.longitud, popupContent);
        }
    });
    
    // Actualizar el total de elementos
    totalElementos.textContent = puntos.length;
}

// Función para confirmar la eliminación de un punto
function confirmarEliminarPunto(id) {
    if (confirm("¿Estás seguro que quieres eliminar el punto de interés?")) {
        eliminarPunto(id);
    }
}

// Función para eliminar un punto
function eliminarPunto(id) {
    // Filtrar el punto de la lista
    puntosInteres = puntosInteres.filter(punto => punto.id !== id);
    
    // Actualizar el contador de elementos
    PuntInteres.totalTasques = puntosInteres.length;
    
    // Actualizar la vista
    actualizarVistaPuntos();
}

// Limpiar todos los datos
function limpiarDatos() {
    puntosInteres = [];
    PuntInteres.totalTasques = 0;
    tiposUnicos = new Set(['todos']);
    
    // Restaurar menú de tipos
    actualizarMenuTipos();
    
    // Limpiar la vista
    const listaPuntos = document.getElementById('listaPuntos');
    listaPuntos.innerHTML = '<p>No hay información para mostrar</p>';
    
    document.getElementById('totalElementos').textContent = '0';
    
    // Limpiar el mapa
    mapa.borrarPunt();
    
    // Limpiar la información del país
    document.getElementById('bandera').style.display = 'none';
    document.getElementById('ciudadPais').textContent = '';
}

// Configurar eventos de filtros
function configurarFiltros() {
    const tipoFiltro = document.getElementById('tipoFiltro');
    const ordenacionFiltro = document.getElementById('ordenacionFiltro');
    const nombreFiltro = document.getElementById('nombreFiltro');
    
    // Evento para filtrar por tipo
    tipoFiltro.addEventListener('change', aplicarFiltros);
    
    // Evento para ordenar
    ordenacionFiltro.addEventListener('change', aplicarFiltros);
    
    // Evento para filtrar por nombre
    nombreFiltro.addEventListener('input', aplicarFiltros);
}

// Aplicar todos los filtros
function aplicarFiltros() {
    const tipoSeleccionado = document.getElementById('tipoFiltro').value;
    const ordenacion = document.getElementById('ordenacionFiltro').value;
    const nombreBuscado = document.getElementById('nombreFiltro').value.toLowerCase();
    
    // Filtrar por tipo y nombre
    let puntosFiltrados = [...puntosInteres];
    
    if (tipoSeleccionado !== 'todos') {
        puntosFiltrados = puntosFiltrados.filter(punto => punto.tipus === tipoSeleccionado);
    }
    
    if (nombreBuscado) {
        puntosFiltrados = puntosFiltrados.filter(punto => 
            punto.nom.toLowerCase().includes(nombreBuscado)
        );
    }
    
    // Ordenar
    puntosFiltrados.sort((a, b) => {
        if (ordenacion === 'ascendente') {
            return a.nom.localeCompare(b.nom);
        } else {
            return b.nom.localeCompare(a.nom);
        }
    });
    
    // Actualizar la vista con los puntos filtrados
    actualizarVistaPuntos(puntosFiltrados);
}