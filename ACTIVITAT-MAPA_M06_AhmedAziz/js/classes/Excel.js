export class Excel {
    constructor() {
        // Constructor vacío
    }

    // Método para leer un archivo CSV y devolver una Promise con los datos
    readCSV(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const content = e.target.result;
                    const rows = content.split('\n');
                    const headers = rows[0].split(',').map(header => header.trim());
                    
                    const data = [];
                    
                    for (let i = 1; i < rows.length; i++) {
                        if (rows[i].trim() === '') continue;
                        
                        const values = this.parseCSVLine(rows[i]);
                        const row = {};
                        
                        for (let j = 0; j < headers.length; j++) {
                            row[headers[j]] = values[j] ? values[j].trim() : '';
                        }
                        
                        data.push(row);
                    }
                    
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => {
                reject(new Error("Error al leer el archivo CSV"));
            };
            
            reader.readAsText(file);
        });
    }
    
    // Método auxiliar para parsear líneas CSV que pueden contener comas dentro de comillas
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        // Añadir el último valor
        result.push(current);
        
        return result;
    }

    // Método para obtener información del país mediante la API REST Countries
    async getInfoCountry(countryCode) {
        try {
            const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
            
            if (!response.ok) {
                throw new Error('Error al obtener información del país');
            }
            
            const data = await response.json();
            const country = data[0];
            
            // Crear un objeto con la información requerida
            const info = {
                city: '', // Se debe pasar desde fuera
                flag: country.flags.png,
                lat: country.capitalInfo?.latlng?.[0] || 0,
                long: country.capitalInfo?.latlng?.[1] || 0
            };
            
            return info;
        } catch (error) {
            console.error("Error en getInfoCountry:", error);
            throw error;
        }
    }
}