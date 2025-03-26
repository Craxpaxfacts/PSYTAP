let score = 0;
let particles = [];
let explosionSound;

function preload() {
  explosionSound = loadSound('assets/sounds/explosion.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(10);
  textAlign(CENTER);
  textSize(32);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(10, 10, 30, 70);
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    }
  }
  fill(255, 200);
  text(`Score: ${score}`, width/2, 50);
}

function mousePressed() {
  score++;
  createExplosion(mouseX, mouseY);
  if (explosionSound) {
    explosionSound.play();
  }
}

function createExplosion(x, y) {
  let baseHue = random(360);
  for (let i = 0; i < 80; i++) {
    particles.push(new Particle(x, y, baseHue, 'spark'));
  }
  for (let i = 0; i < 30; i++) {
    particles.push(new Particle(x, y, baseHue, 'smoke'));
  }
  for (let i = 0; i < 20; i++) {
    particles.push(new Particle(x, y, baseHue, 'flash'));
  }
}

class Particle {
  constructor(x, y, baseHue, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    if (type === 'spark') {
      this.size = random(4, 12);
      this.vx = random(-5, 5);
      this.vy = random(-5, 5);
      this.life = random(150, 255);
    } else if (type === 'smoke') {
      this.size = random(10, 25);
      this.vx = random(-2, 2);
      this.vy = random(-2, 2);
      this.life = random(100, 200);
    } else if (type === 'flash') {
      this.size = random(15, 30);
      this.vx = random(-1, 1);
      this.vy = random(-1, 1);
      this.life = random(50, 100);
    }
    this.hue = (baseHue + random(-40, 40)) % 360;
    this.saturation = random(70, 100);
    this.lightness = type === 'smoke' ? random(20, 40) : random(60, 100);
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.type === 'spark') {
      this.vx *= 0.97;
      this.vy *= 0.97;
      this.life -= 4;
      this.size *= 0.98;
    } else if (this.type === 'smoke') {
      this.vx *= 0.95;
      this.vy *= 0.95;
      this.life -= 2;
      this.size += 0.1;
    } else if (this.type === 'flash') {
      this.life -= 6;
      this.size *= 0.99;
    }
  }
  
  show() {
    noStroke();
    colorMode(HSL);
    if (this.type === 'smoke') {
      fill(this.hue, this.saturation, this.lightness, this.life/255);
      circle(this.x, this.y, this.size);
    } else {
      for (let i = 0; i < 3; i++) {
        let alpha = this.life * (1 - i * 0.4);
        fill(this.hue, this.saturation, this.lightness, alpha/255);
        circle(this.x, this.y, this.size * (1 + i * 0.6));
      }
    }
    colorMode(RGB);
  }
  
  isFinished() {
    return this.life <= 0;
  }
}