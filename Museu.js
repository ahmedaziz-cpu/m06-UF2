const IVA_PAISOS = {
    'ES': 0.21,
    'FR': 0.20,
    'DE': 0.19,
    // Afegir més països i els seus IVA aquí
};

class PuntInteres {
    // Implementació de la classe base PuntInteres
}

class Museu extends PuntInteres {
    constructor(horaris, preu, moneda, descripcio, pais) {
        super();
        this.horaris = horaris;
        this.preu = preu;
        this.moneda = moneda;
        this.descripcio = descripcio;
        this.pais = pais;
    }

    get preuIva() {
        if (this.preu === 0) {
            return "Entrada gratuïta";
        }

        const iva = IVA_PAISOS[this.pais];
        if (iva !== undefined) {
            const preuAmbIva = this.preu * (1 + iva);
            return `${preuAmbIva.toFixed(2)}${this.moneda} (IVA)`;
        } else {
            return `${this.preu.toFixed(2)}${this.moneda} (no IVA)`;
        }
    }
}

// Exemple d'ús
const museu = new Museu("9:00-18:00", 12.00, "€", "Museu d'Art", "ES");
console.log(museu.preuIva); // "14.52€ (IVA)"