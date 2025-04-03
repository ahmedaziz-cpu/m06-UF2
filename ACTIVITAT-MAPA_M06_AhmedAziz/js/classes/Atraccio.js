import { PuntInteres } from './PuntInteres.js';

// Constante con los IVAs por país
const IVA_PAISES = {
    'Spain': 0.21,
    'United Kingdom': 0.20,
    'France': 0.20,
    'Germany': 0.19,
    'Italy': 0.22
};

// Clase para atracciones, hereda de PuntInteres
export class Atraccio extends PuntInteres {
    constructor(id, pais, ciutat, nom, direccio, tipus, latitud, longitud, puntuacio, horaris, preu, moneda, esManual = false) {
        super(id, pais, ciutat, nom, direccio, tipus, latitud, longitud, puntuacio, esManual);
        this.horaris = horaris;
        this.preu = preu;
        this.moneda = moneda;
    }

    // Método para obtener el precio con IVA
    get preuIva() {
        if (this.preu === 0 || this.preu === '0') {
            return "Entrada gratuïta";
        }

        const precio = parseFloat(this.preu);
        
        // Verificar si existe IVA para el país
        if (IVA_PAISES[this.pais]) {
            const precioConIva = precio * (1 + IVA_PAISES[this.pais]);
            return `${precioConIva.toFixed(2)}${this.moneda} (IVA)`;
        } else {
            return `${precio.toFixed(2)}${this.moneda} (no IVA)`;
        }
    }
}