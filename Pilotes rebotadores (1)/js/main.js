// Preparació del canvas ----------------------
/* Obté una referència a <canvas>, després crida al mètode getContext()
  per definir un context al el que es pot començar a dibuisar
  (ctx) és un objecte que representa l'àrea de dibuix del 
  <canvas> y permet dibuixar elements 2D al damunt.

  width and height són dreceres a l'ample i alt del canvas  que coincideixen
  amb l'alt i ample del navegador (viewport)
*/
// Importamos la clase Pilota
// Importamos la clase Pilota
import { Pilota } from './pilota.js';

// Preparación del canvas ----------------------
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// Función para generar un número aleatorio entre dos cifras
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// Función para generar un color aleatorio
function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// Array para almacenar las pelotas
const pilotes = [];

// Crear 20 pelotas aleatorias (según el enunciado pide 20, no 25)
function crearPilotes() {
  for (let i = 0; i < 20; i++) {
    // Tamaño aleatorio entre 10 y 20
    const mida = random(10, 20);
    
    // Posición aleatoria (respetando los límites del canvas)
    const x = random(mida, width - mida);
    const y = random(mida, height - mida);
    
    // Velocidad aleatoria (entre -7 y 7, pero no 0)
    let velX = random(-7, 7);
    let velY = random(-7, 7);
    
    // Evitar que las pelotas se queden sin movimiento
    if (velX === 0) velX = 2;
    if (velY === 0) velY = 2;
    
    // Crear una nueva pelota con color aleatorio
    const color = randomRGB();
    
    // Crear la pelota y añadirla al array
    const pilota = new Pilota(x, y, velX, velY, color, mida);
    pilotes.push(pilota);
  }
}

// Función principal de animación
function loop() {
  // Pintar el fondo de negro en cada fotograma (con un poco de transparencia para efecto de estela)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);
  
  // Si aún no hay pelotas, las creamos
  if (pilotes.length === 0) {
    crearPilotes();
  }
  
  // Recorrer todas las pelotas
  for (const pilota of pilotes) {
    // Dibujar la pelota
    pilota.dibuixa(ctx);
    
    // Mover la pelota
    pilota.mou(width, height);
    
    // Detectar colisiones con otras pelotas
    pilota.detectarColisio(pilotes);
  }
  
  // Solicitar el siguiente fotograma de animación
  requestAnimationFrame(loop);
}

// Iniciar la animación
loop();

// Iniciar la animación
loop();