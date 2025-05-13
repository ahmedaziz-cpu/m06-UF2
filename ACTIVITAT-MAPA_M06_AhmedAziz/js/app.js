// Importación de módulos necesarios para el funcionamiento de la aplicación
import { PuntInteres } from './classes/PuntInteres.js'; // Clase base para puntos de interés
import { Atraccio } from './classes/Atraccio.js';      // Clase para atracciones turísticas
import { Museu } from './classes/Museu.js';            // Clase para museos
import { Mapa } from './classes/Mapa.js';              // Clase para manejar el mapa
import { Excel } from './classes/Excel.js';            // Clase para procesar archivos CSV

// Variables globales para el funcionamiento de la aplicación
let mapa;                               // Instancia del mapa
let puntosInteres = [];                 // Array para almacenar todos los puntos de interés
let tiposUnicos = new Set(['todos']);   // Set para almacenar tipos de puntos sin duplicados
let excel;                              // Instancia para manejar archivos CSV

// Evento que se dispara cuando el DOM está completamente cargado
// Inicia la configuración de la aplicación
document.addEventListener('DOMContentLoaded', inicializar);

/**
 * Función de inicialización de la aplicación
 * Crea instancias de los objetos principales y configura los eventos
 */
function inicializar() {
    // Inicializar objetos principales
    mapa = new Mapa();    // Crea nueva instancia del mapa
    excel = new Excel();  // Crea nueva instancia para manejar CSV
    
    // Configurar los componentes de la interfaz
    configurarDropZone();  // Configura la zona para arrastrar archivos
    configurarFiltros();   // Configura los filtros de búsqueda
    
    // Asignar evento para limpiar todos los datos
    document.getElementById('limpiarLista').addEventListener('click', limpiarDatos);
}

/**
 * Configura la zona donde se arrastran los archivos CSV
 * Maneja los eventos de arrastrar y soltar
 */
function configurarDropZone() {
    const dropZone = document.getElementById('dropZone');
    
    // Prevenir comportamiento por defecto en eventos de arrastre y configurar estilos
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        // Prevenir comportamiento por defecto en todos los eventos
        dropZone.addEventListener(eventName, preventDefaults);
        
        // Añadir o quitar la clase 'active' según el tipo de evento
        if (['dragenter', 'dragover'].includes(eventName)) {
            // Para eventos de entrada o sobre la zona
            dropZone.addEventListener(eventName, () => dropZone.classList.add('active'));
        } else {
            // Para eventos de salida o soltar
            dropZone.addEventListener(eventName, () => dropZone.classList.remove('active'));
        }
    });
    
    // Asociar el evento de soltar archivo con su manejador
    dropZone.addEventListener('drop', handleDrop);
}

/**
 * Función para prevenir el comportamiento por defecto de eventos
 * Evita que el navegador abra los archivos al arrastrarlos
 */
function preventDefaults(e) {
    e.preventDefault();     // Previene la acción por defecto
    e.stopPropagation();    // Detiene la propagación del evento
}

/**
 * Maneja el evento de soltar un archivo en la zona de arrastre
 * Comprueba que sea un CSV y lo procesa
 */
function handleDrop(e) {
    // Obtener el archivo soltado
    const file = e.dataTransfer.files[0];
    
    // Verificar si el archivo es CSV
    if (file.name.endsWith('.csv')) {
        procesarCSV(file);  // Procesar el archivo CSV
    } else {
        alert("El fichero no es csv");  // Mostrar error si no es CSV
    }
}

/**
 * Procesa un archivo CSV
 * Lee los datos, los procesa y actualiza la interfaz
 * @param {File} file - Archivo CSV a procesar
 */
async function procesarCSV(file) {
    try {
        // Leer datos del CSV usando la clase Excel
        const datos = await excel.readCSV(file);
        
        // Verificar si hay datos
        if (datos.length === 0) {
            alert("No se encontraron datos en el archivo CSV");
            return;
        }
        
        // Procesar los datos en orden
        limpiarDatos();                      // Limpia datos anteriores
        await mostrarInfoPaisDesdeCSV(datos[0]);  // Muestra info del país
        procesarPuntosInteres(datos);        // Procesa los puntos de interés
        actualizarMenuTipos();               // Actualiza el menú de tipos
        actualizarVistaPuntos();             // Actualiza la vista de puntos
        
    } catch (error) {
        // Manejar errores
        console.error("Error al procesar el CSV:", error);
        alert("Error al procesar el archivo CSV");
    }
}

/**
 * Obtiene y muestra la información del país a partir del primer registro del CSV
 * @param {Object} primerElemento - Primer elemento del CSV
 */
async function mostrarInfoPaisDesdeCSV(primerElemento) {
    // Obtener el código del país
    const codigoPais = primerElemento.codi || primerElemento.code;
    
    if (codigoPais) {
        try {
            // Obtener información del país usando la clase Excel
            const infoPais = await excel.getInfoCountry(codigoPais);
            infoPais.city = primerElemento.ciutat || primerElemento.ciudad || '';
            
            // Elementos del DOM para mostrar la información
            const banderaImg = document.getElementById('bandera');
            const ciudadPaisSpan = document.getElementById('ciudadPais');
            
            // Mostrar la bandera si está disponible
            if (infoPais.flag) {
                banderaImg.src = infoPais.flag;
                banderaImg.style.display = 'inline';
            }
            
            // Mostrar el nombre de la ciudad
            ciudadPaisSpan.textContent = infoPais.city || '';
            
            // Actualizar la posición inicial del mapa
            mapa.actualitzarPosInitMapa(infoPais.lat, infoPais.long);
        } catch (error) {
            console.error("Error al obtener información del país:", error);
        }
    }
}

/**
 * Procesa los datos del CSV para crear objetos de puntos de interés
 * @param {Array} datos - Datos del CSV
 */
function procesarPuntosInteres(datos) {
    // Recorrer cada fila de datos
    datos.forEach((fila, index) => {
        const id = index + 1;  // ID secuencial
        const tipo = fila.tipus || fila.tipo;  // Tipo del punto (compatible con ES/CAT)
        
        // Añadir el tipo al conjunto de tipos únicos para filtros
        if (tipo) tiposUnicos.add(tipo);
        
        // Crear el objeto de punto de interés según su tipo
        let punto = crearPuntoInteres(id, tipo, fila);
        puntosInteres.push(punto);  // Añadir al array global
    });
}

/**
 * Crea un objeto de punto de interés según su tipo
 * @param {number} id - ID del punto
 * @param {string} tipo - Tipo del punto
 * @param {Object} fila - Datos del punto desde el CSV
 * @returns {PuntInteres|Atraccio|Museu} - Instancia de la clase correspondiente
 */
function crearPuntoInteres(id, tipo, fila) {
    // Preparar datos comunes para todos los tipos
    const datosPunto = {
        id,
        pais: fila.pais,
        ciudad: fila.ciutat || fila.ciudad,
        nombre: fila.nom || fila.nombre,
        direccion: fila.direccio || fila.direccion,
        tipo,
        latitud: fila.latitud,
        longitud: fila.longitud,
        puntuacion: fila.puntuacio || fila.puntuacion
    };
    
    // Crear el objeto según el tipo
    switch (tipo) {
        case 'Espai':
        case 'Espacio':
            // Crear punto de interés básico
            return new PuntInteres(
                datosPunto.id,
                datosPunto.pais,
                datosPunto.ciudad,
                datosPunto.nombre,
                datosPunto.direccion,
                datosPunto.tipo,
                datosPunto.latitud,
                datosPunto.longitud,
                datosPunto.puntuacion
            );
            
        case 'Atraccio':
        case 'Atraccion':
            // Crear atracción con datos adicionales
            return new Atraccio(
                datosPunto.id,
                datosPunto.pais,
                datosPunto.ciudad,
                datosPunto.nombre,
                datosPunto.direccion,
                datosPunto.tipo,
                datosPunto.latitud,
                datosPunto.longitud,
                datosPunto.puntuacion,
                fila.horaris || fila.horarios,
                fila.preu || fila.precio,
                fila.moneda
            );
            
        case 'Museu':
        case 'Museo':
            // Crear museo con datos adicionales
            return new Museu(
                datosPunto.id,
                datosPunto.pais,
                datosPunto.ciudad,
                datosPunto.nombre,
                datosPunto.direccion,
                datosPunto.tipo,
                datosPunto.latitud,
                datosPunto.longitud,
                datosPunto.puntuacion,
                fila.horaris || fila.horarios,
                fila.preu || fila.precio,
                fila.moneda,
                fila.descripcio || fila.descripcion
            );
            
        default:
            // Si no es un tipo reconocido, crear un punto de interés genérico
            return new PuntInteres(
                datosPunto.id,
                datosPunto.pais,
                datosPunto.ciudad,
                datosPunto.nombre,
                datosPunto.direccion,
                datosPunto.tipo,
                datosPunto.latitud,
                datosPunto.longitud,
                datosPunto.puntuacion
            );
    }
}

/**
 * Actualiza el menú desplegable de tipos para filtrado
 * Utiliza los tipos únicos recolectados durante el procesamiento
 */
function actualizarMenuTipos() {
    // Obtener el elemento select
    const tipoFiltro = document.getElementById('tipoFiltro');
    tipoFiltro.innerHTML = '';  // Limpiar opciones existentes
    
    // Añadir cada tipo como opción
    tiposUnicos.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        // Si es 'todos', mostrar "Todos", sino el nombre del tipo
        option.textContent = tipo === 'todos' ? 'Todos' : tipo;
        tipoFiltro.appendChild(option);
    });
}

/**
 * Actualiza la vista de puntos de interés tanto en la lista como en el mapa
 * @param {Array} puntosFiltrados - Puntos filtrados a mostrar (opcional)
 */
function actualizarVistaPuntos(puntosFiltrados = null) {
    // Elementos del DOM
    const listaPuntos = document.getElementById('listaPuntos');
    const totalElementos = document.getElementById('totalElementos');
    // Usar puntos filtrados si existen, si no usar todos los puntos
    const puntos = puntosFiltrados || puntosInteres;
    
    // Limpiar la lista y el mapa
    listaPuntos.innerHTML = '';
    mapa.borrarPunt();
    
    // Si no hay puntos para mostrar
    if (puntos.length === 0) {
        listaPuntos.innerHTML = '<p>No hay información para mostrar</p>';
        totalElementos.textContent = '0';
        return;
    }
    
    // Mostrar cada punto en la lista y en el mapa
    puntos.forEach(punto => {
        // Crear elemento HTML para el punto
        const puntoItem = crearElementoListaPunto(punto);
        listaPuntos.appendChild(puntoItem);
        
        // Mostrar el punto en el mapa si tiene coordenadas
        if (punto.latitud && punto.longitud) {
            const popupContent = crearContenidoPopup(punto);
            mapa.mostrarPunt(punto.latitud, punto.longitud, popupContent);
        }
    });
    
    // Actualizar contador de elementos
    totalElementos.textContent = puntos.length;
}

/**
 * Crea un elemento HTML para mostrar un punto en la lista
 * @param {PuntInteres} punto - Punto de interés a mostrar
 * @returns {HTMLElement} - Elemento div con la información del punto
 */
function crearElementoListaPunto(punto) {
    // Crear contenedor para el punto
    const puntoItem = document.createElement('div');
    puntoItem.className = `punto-item tipo-${punto.tipus.toLowerCase()}`;
    puntoItem.dataset.id = punto.id;
    
    // Generar el contenido HTML según el tipo de punto
    let contenido = generarContenidoPunto(punto);
    
    // Crear botón de eliminar
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'X';
    // Añadir evento para eliminar el punto
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();  // Evitar propagación del evento
        confirmarEliminarPunto(punto.id);
    });
    
    // Añadir contenido y botón al contenedor
    puntoItem.innerHTML = contenido;
    puntoItem.appendChild(deleteBtn);
    
    return puntoItem;
}

/**
 * Genera el contenido HTML para un punto según su tipo
 * @param {PuntInteres} punto - Punto de interés
 * @returns {string} - HTML con la información del punto
 */
function generarContenidoPunto(punto) {
    // Generar contenido según el tipo de punto
    switch(punto.tipus) {
        case 'Atraccio':
        case 'Atraccion':
            // Para atracciones: nombre, ciudad, tipo, horarios y precio
            return `
                <h3>${punto.nom}</h3>
                <p>${punto.ciutat} | Tipo: ${punto.tipus} | ${punto.horaris || 'Sin horarios'} | ${punto.preuIva}</p>
            `;
            
        case 'Museu':
        case 'Museo':
            // Para museos: nombre, ciudad, tipo, horarios, precio y descripción
            return `
                <h3>${punto.nom}</h3>
                <p>${punto.ciutat} | Tipo: ${punto.tipus} | ${punto.horaris || 'Sin horarios'} | ${punto.preuIva}</p>
                <p>${punto.descripcio || 'Sin descripción'}</p>
            `;
            
        default:
            // Para otros tipos: nombre, ciudad y tipo
            return `
                <h3>${punto.nom}</h3>
                <p>${punto.ciutat} | Tipo: ${punto.tipus}</p>
            `;
    }
}

/**
 * Crea el contenido HTML para el popup del mapa
 * @param {PuntInteres} punto - Punto de interés
 * @returns {string} - HTML para el popup
 */
function crearContenidoPopup(punto) {
    // Contenido básico del popup
    return `
        <div class="popup-content">
            <h3>${punto.nom}</h3>
            <p><strong>Dirección:</strong> ${punto.direccio}</p>
            ${['Museu', 'Museo', 'Atraccio', 'Atraccion'].includes(punto.tipus) ? 
                `<p><strong>Horario:</strong> ${punto.horaris || 'No disponible'}</p>
                 <p><strong>Precio:</strong> ${punto.preuIva}</p>` : ''}
            ${['Museu', 'Museo'].includes(punto.tipus) ? 
                `<p><strong>Descripción:</strong> ${punto.descripcio || 'No disponible'}</p>` : ''}
        </div>
    `;
}

/**
 * Muestra un diálogo de confirmación para eliminar un punto
 * @param {number} id - ID del punto a eliminar
 */
function confirmarEliminarPunto(id) {
    if (confirm("¿Estás seguro que quieres eliminar el punto de interés?")) {
        eliminarPunto(id);  // Eliminar si confirma
    }
}

/**
 * Elimina un punto de interés de la lista
 * @param {number} id - ID del punto a eliminar
 */
function eliminarPunto(id) {
    // Filtrar el punto de la lista
    puntosInteres = puntosInteres.filter(punto => punto.id !== id);
    // Actualizar contador de tareas
    PuntInteres.totalTasques = puntosInteres.length;
    // Actualizar la vista
    actualizarVistaPuntos();
}

/**
 * Limpia todos los datos de la aplicación
 * Elimina puntos, filtros y restaura estado inicial
 */
function limpiarDatos() {
    // Restablecer variables globales
    puntosInteres = [];
    PuntInteres.totalTasques = 0;
    tiposUnicos = new Set(['todos']);
    
    actualizarMenuTipos();  // Actualizar menú de tipos
    
    // Limpiar lista y contador
    document.getElementById('listaPuntos').innerHTML = '<p>No hay información para mostrar</p>';
    document.getElementById('totalElementos').textContent = '0';
    // Ocultar información del país
    document.getElementById('bandera').style.display = 'none';
    document.getElementById('ciudadPais').textContent = '';
    
    // Limpiar puntos del mapa
    mapa.borrarPunt();
}

/**
 * Configura los eventos para los filtros de búsqueda
 */
function configurarFiltros() {
    // IDs de los elementos de filtro
    const filtros = ['tipoFiltro', 'ordenacionFiltro', 'nombreFiltro'];
    
    // Asignar evento a cada filtro
    filtros.forEach(id => {
        document.getElementById(id).addEventListener(
            // Evento 'input' para campo de texto, 'change' para selects
            id === 'nombreFiltro' ? 'input' : 'change', 
            aplicarFiltros
        );
    });
}

/**
 * Aplica los filtros de búsqueda a la lista de puntos
 * Combina filtros por tipo, nombre y ordenación
 */
function aplicarFiltros() {
    // Obtener valores de los filtros
    const tipoSeleccionado = document.getElementById('tipoFiltro').value;
    const ordenacion = document.getElementById('ordenacionFiltro').value;
    const nombreBuscado = document.getElementById('nombreFiltro').value.toLowerCase();
    
    // Aplicar filtros combinados
    let puntosFiltrados = puntosInteres.filter(punto => {
        // Comprobar si cumple filtro de tipo
        const cumpleTipo = tipoSeleccionado === 'todos' || punto.tipus === tipoSeleccionado;
        // Comprobar si cumple filtro de nombre
        const cumpleNombre = !nombreBuscado || punto.nom.toLowerCase().includes(nombreBuscado);
        // Debe cumplir ambos filtros
        return cumpleTipo && cumpleNombre;
    });
    
    // Ordenar resultados
    puntosFiltrados.sort((a, b) => {
        // Comparar nombres
        const comparacion = a.nom.localeCompare(b.nom);
        // Orden ascendente o descendente según selección
        return ordenacion === 'ascendente' ? comparacion : -comparacion;
    });
    
    // Actualizar vista con los puntos filtrados
    actualizarVistaPuntos(puntosFiltrados);
}