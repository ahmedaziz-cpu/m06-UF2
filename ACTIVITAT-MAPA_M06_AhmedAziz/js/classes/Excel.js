/**
 * Clase para procesamiento de archivos CSV y obtención de información de países
 * Esta clase proporciona métodos para leer archivos CSV y consultar la API REST Countries
 */
export class Excel {
    /**
     * Constructor de la clase Excel
     * No requiere parámetros de inicialización
     */
    constructor() {
        // Constructor vacío - no se inicializan propiedades
    }

  
    readCSV(file) {
        // Devuelve una nueva Promise que encapsula la operación asíncrona de lectura
        return new Promise((resolve, reject) => {
            // Crea una instancia de FileReader para leer el contenido del archivo
            const reader = new FileReader();
            
            // Define el controlador para el evento 'load' (cuando se complete la lectura)
            reader.onload = (e) => {
                try {
                    // Obtiene el contenido del archivo como string
                    const content = e.target.result;
                    // Divide el contenido en líneas usando el salto de línea como separador
                    const rows = content.split('\n');
                    // Extrae los encabezados (primera línea) y elimina espacios en blanco
                    const headers = rows[0].split(',').map(header => header.trim());
                    
                    // Array para almacenar los datos procesados
                    const data = [];
                    
                    // Procesa cada línea del archivo (excepto la primera que son los encabezados)
                    for (let i = 1; i < rows.length; i++) {
                        // Ignora líneas vacías
                        if (rows[i].trim() === '') continue;
                        
                        // Parsea la línea actual usando el método auxiliar parseCSVLine
                        const values = this.parseCSVLine(rows[i]);
                        // Objeto para almacenar los datos de la fila actual
                        const row = {};
                        
                        // Asigna cada valor a su correspondiente encabezado
                        for (let j = 0; j < headers.length; j++) {
                            // Almacena el valor limpio de espacios o un string vacío si no existe
                            row[headers[j]] = values[j] ? values[j].trim() : '';
                        }
                        
                        // Añade el objeto de la fila al array de datos
                        data.push(row);
                    }
                    
                    // Resuelve la Promise con los datos procesados
                    resolve(data);
                } catch (error) {
                    // Si ocurre algún error durante el procesamiento, rechaza la Promise
                    reject(error);
                }
            };
            
            // Define el controlador para el evento 'error' (si falla la lectura)
            reader.onerror = () => {
                // Rechaza la Promise con un mensaje de error descriptivo
                reject(new Error("Error al leer el archivo CSV"));
            };
            
            // Inicia la lectura del archivo como texto
            reader.readAsText(file);
        });
    }
    
    /**
     * Método auxiliar para parsear una línea de CSV respetando campos entre comillas
     */
    parseCSVLine(line) {
        // Array para almacenar los valores extraídos
        const result = [];
        // Variable para ir construyendo el valor actual
        let current = '';
        // Bandera que indica si estamos dentro de un campo entrecomillado
        let inQuotes = false;
        
        // Recorre cada carácter de la línea
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                // Si encuentra una comilla, cambia el estado de la bandera inQuotes
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                // Si encuentra una coma y no estamos dentro de comillas,
                // añade el valor actual al resultado y reinicia la variable current
                result.push(current);
                current = '';
            } else {
                // Para cualquier otro carácter, lo añade al valor actual
                current += char;
            }
        }
        
        // Añade el último valor (después de la última coma)
        result.push(current);
        
        // Devuelve el array de valores
        return result;
    }

    /**
     * Método para obtener información de un país mediante la API REST Countries

     */
    async getInfoCountry(countryCode) {
        try {
            // Realiza una petición HTTP a la API REST Countries con el código del país
            const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
            
            // Verifica si la respuesta es válida (status 200-299)
            if (!response.ok) {
                throw new Error('Error al obtener información del país');
            }
            
            // Convierte la respuesta a JSON
            const data = await response.json();
            // Obtiene el primer elemento del array (la API devuelve un array con un solo país)
            const country = data[0];
            
            // Crea un objeto con la información requerida del país
            const info = {
                city: '', // Campo vacío - se debe proporcionar desde fuera del método
                flag: country.flags.png, // URL de la imagen de la bandera
                lat: country.capitalInfo?.latlng?.[0] || 0, // Latitud de la capital (o 0 si no existe)
                long: country.capitalInfo?.latlng?.[1] || 0 // Longitud de la capital (o 0 si no existe)
            };
            
            // Devuelve el objeto con la información
            return info;
        } catch (error) {
            // Registra el error en la consola
            console.error("Error en getInfoCountry:", error);
            // Propaga el error
            throw error;
        }
    }
}