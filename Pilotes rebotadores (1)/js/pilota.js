// Clase Pilota para representar una pelota saltarina
export class Pilota {
  constructor(x, y, velX, velY, color, mida) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.mida = mida;
  }

  // Método para dibujar la pelota en el canvas
  dibuixa(ctx) {
    ctx.beginPath(); // Para comenzar a dibujar formas en el canvas
    ctx.fillStyle = this.color; // Color con el que dibujaremos
    ctx.arc(this.x, this.y, this.mida, 0, 2 * Math.PI); // Dibujo de un arco
    ctx.fill(); // Finaliza el dibujo y lo llena con el color ya establecido
  }

  // Método para mover la pelota y hacer que rebote en los bordes
  mou(width, height) {
    // Rebote en el borde derecho
    if (this.x + this.mida >= width) {
      this.velX = -this.velX;
      this.x = width - this.mida; // Corregir posición para evitar que se quede atascada
    }
    
    // Rebote en el borde izquierdo
    if (this.x - this.mida <= 0) {
      this.velX = -this.velX;
      this.x = this.mida; // Corregir posición para evitar que se quede atascada
    }
    
    // Rebote en el borde inferior
    if (this.y + this.mida >= height) {
      this.velY = -this.velY;
      this.y = height - this.mida; // Corregir posición para evitar que se quede atascada
    }
    
    // Rebote en el borde superior
    if (this.y - this.mida <= 0) {
      this.velY = -this.velY;
      this.y = this.mida; // Corregir posición para evitar que se quede atascada
    }
    
    // Actualizar la posición
    this.x += this.velX;
    this.y += this.velY;
  }

  // Método para detectar colisiones con otras pelotas
  detectarColisio(pilotes) {
    for (const pilota of pilotes) {
      // No comprobamos la colisión con nosotros mismos
      if (this === pilota) {
        continue;
      }
      
      // Calculamos la distancia entre los centros de las pelotas
      const dx = this.x - pilota.x;
      const dy = this.y - pilota.y;
      const distancia = Math.sqrt(dx * dx + dy * dy);
      
      // Si la distancia es menor que la suma de los radios, hay colisión
      if (distancia < this.mida + pilota.mida) {
        // Implementación mejorada de rebote
        const angle = Math.atan2(dy, dx);
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        
        // Intercambiar velocidades (versión simplificada)
        const vx1 = this.velX;
        const vy1 = this.velY;
        
        this.velX = -vx1;
        this.velY = -vy1;
        
        // Evitar que queden superpuestas
        const distCorrection = (this.mida + pilota.mida - distancia) / 2;
        this.x += cos * distCorrection;
        this.y += sin * distCorrection;
      }
    }
  }
}