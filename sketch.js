let particles = [];
let colors;
let score = 0;
let currentExplosionColor;
let explosionSound;

const PARTICLES_PER_CLICK = 30;
const MAX_PARTICLES = 500;

function preload() {
  // Загрузка звукового файла
  explosionSound = loadSound('assets/sounds/explosion.mp3');
}

// --- Setup ---
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);
  colors = [
    color(255, 0, 127), color(0, 255, 127), color(127, 0, 255),
    color(255, 255, 0), color(0, 127, 255), color(0, 255, 255),
    color(255, 127, 0)
  ];
  background(0);
  currentExplosionColor = random(colors);
}

// --- Draw ---
function draw() {
  background(0, 20);
  blendMode(ADD); // Яркий неон

  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.show();
    if (p.isFinished()) {
      particles.splice(i, 1);
    }
  }

  blendMode(BLEND); // Нормальный режим для текста
  drawScore();
}

// --- Обработка ввода ---
function mousePressed() {
  triggerExplosion(mouseX, mouseY);
}

function mouseDragged() {
  if (frameCount % 3 === 0) {
    triggerExplosion(mouseX, mouseY);
  }
}

function touchStarted() {
  if (touches.length > 0) {
    triggerExplosion(touches[0].x, touches[0].y);
  }
  return false;
}

function touchMoved() {
  if (touches.length > 0 && frameCount % 3 === 0) {
    triggerExplosion(touches[0].x, touches[0].y);
  }
  return false;
}

// --- Логика Взрыва ---
function triggerExplosion(x, y) {
  currentExplosionColor = random(colors);

  let count = 0;
  while(count < PARTICLES_PER_CLICK && particles.length < MAX_PARTICLES) {
    particles.push(new Particle(x, y, currentExplosionColor));
    count++;
  }

  while (particles.length > MAX_PARTICLES) {
    particles.shift();
  }

  score += 5;

  // Воспроизведение звука при каждом взрыве
  if (explosionSound.isPlaying()) {
    explosionSound.stop();  // Если звук уже играет, остановим его
  }
  explosionSound.play();  // Запуск нового звука
}

// --- Отрисовка Счета ---
function drawScore() {
  fill(255, 200);
  noStroke();
  textSize(28);
  textAlign(RIGHT, TOP);
  text(`Score: ${score}`, width - 20, 20);
}

// --- Класс Частицы ---
class Particle {
  constructor(x, y, explosionColor) {
    this.pos = createVector(x, y);
    let angle = random(TWO_PI);
    let speed = random(1, 3);  // Медленное движение
    this.vel = p5.Vector.fromAngle(angle).mult(speed);
    this.lifespan = random(300, 800); // Долгий срок жизни
    this.maxLife = this.lifespan;
    this.baseSize = random(15, 50); // Большие частицы
    this.size = this.baseSize;
    this.col = explosionColor;
    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(-0.005, 0.005);  // Медленное вращение
    this.drag = random(0.995, 0.999);  // Очень медленное замедление
    this.angleVariation = random(-0.02, 0.02); // Маленькие отклонения
    this.colorShiftSpeed = random(0.002, 0.01); // Плавное изменение цвета
  }

  update() {
    this.vel.mult(this.drag);
    this.pos.add(this.vel);
    this.lifespan -= 1;
    this.size = this.baseSize * max(0, this.lifespan / this.maxLife); // Уменьшение размера
    this.rotation += this.rotationSpeed;
    this.vel.add(p5.Vector.fromAngle(random(TWO_PI)).mult(this.angleVariation)); // Разнообразие направления
    this.col = lerpColor(this.col, random(colors), this.colorShiftSpeed); // Плавное изменение цвета
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rotation);
    let r = red(this.col);
    let g = green(this.col);
    let b = blue(this.col);
    let lifeRatio = max(0, this.lifespan / this.maxLife);
    let alpha = map(lifeRatio * lifeRatio, 0, 1, 0, 255);
    noStroke();
    fill(r, g, b, alpha * 0.4);
    ellipse(0, 0, this.size * 2, this.size * 1.5);  // Плавные контуры
    fill(r, g, b, alpha * 0.7);
    ellipse(0, 0, this.size * 1.7, this.size * 1.3);
    fill(r, g, b, alpha);
    ellipse(0, 0, this.size * 1.4, this.size);
    pop();
  }

  isFinished() {
    return this.lifespan < 0 || this.size < 0.5;
  }
}

// --- Window Resize ---
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}
