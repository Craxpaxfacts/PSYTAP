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
  if (explosionSound && explosionSound.isLoaded()) {
    explosionSound.play();
  }
}

function createExplosion(x, y) {
  let baseHue = random(360);
  // Искры
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle(x, y, baseHue, 'spark'));
  }
  // Волны света
  for (let i = 0; i < 5; i++) {
    particles.push(new Particle(x, y, baseHue, 'wave'));
  }
  // Вращающиеся кольца
  for (let i = 0; i < 3; i++) {
    particles.push(new Particle(x, y, baseHue, 'ring'));
  }
  // Дымовые шлейфы
  for (let i = 0; i < 40; i++) {
    particles.push(new Particle(x, y, baseHue, 'smoke'));
  }
  // Мерцающие звезды
  for (let i = 0; i < 20; i++) {
    particles.push(new Particle(x, y, baseHue, 'star'));
  }
}

class Particle {
  constructor(x, y, baseHue, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.angle = random(TWO_PI);
    
    if (type === 'spark') {
      this.size = random(3, 10);
      this.vx = random(-6, 6);
      this.vy = random(-6, 6);
      this.life = random(150, 255);
    } else if (type === 'wave') {
      this.size = 0;
      this.vx = 0;
      this.vy = 0;
      this.life = 200;
      this.speed = random(2, 4);
    } else if (type === 'ring') {
      this.size = random(20, 40);
      this.vx = 0;
      this.vy = 0;
      this.life = 150;
      this.rotationSpeed = random(-0.05, 0.05);
    } else if (type === 'smoke') {
      this.size = random(10, 30);
      this.vx = random(-2, 2);
      this.vy = random(-2, 2);
      this.life = random(100, 200);
    } else if (type === 'star') {
      this.size = random(5, 15);
      this.vx = random(-3, 3);
      this.vy = random(-3, 3);
      this.life = random(50, 150);
      this.twinkle = random(0.5, 1);
    }
    
    this.hue = (baseHue + random(-50, 50)) % 360;
    this.saturation = random(70, 100);
    this.lightness = type === 'smoke' ? random(20, 40) : random(50, 90);
  }
  
  update() {
    if (this.type === 'spark') {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.96;
      this.vy *= 0.96;
      this.life -= 4;
      this.size *= 0.98;
    } else if (this.type === 'wave') {
      this.size += this.speed;
      this.life -= 3;
    } else if (this.type === 'ring') {
      this.size += 1;
      this.angle += this.rotationSpeed;
      this.life -= 2;
    } else if (this.type === 'smoke') {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.95;
      this.vy *= 0.95;
      this.life -= 2;
      this.size += 0.2;
    } else if (this.type === 'star') {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.97;
      this.vy *= 0.97;
      this.life -= 3;
      this.twinkle = sin(frameCount * 0.1) * 0.5 + 0.5;
    }
  }
  
  show() {
    noStroke();
    colorMode(HSL);
    
    if (this.type === 'spark') {
      for (let i = 0; i < 3; i++) {
        let alpha = this.life * (1 - i * 0.4);
        fill(this.hue, this.saturation, this.lightness, alpha/255);
        circle(this.x, this.y, this.size * (1 + i * 0.5));
      }
    } else if (this.type === 'wave') {
      noFill();
      stroke(this.hue, this.saturation, this.lightness, this.life/255);
      strokeWeight(3);
      circle(this.x, this.y, this.size);
    } else if (this.type === 'ring') {
      push();
      translate(this.x, this.y);
      rotate(this.angle);
      noFill();
      stroke(this.hue, this.saturation, this.lightness, this.life/255);
      strokeWeight(2);
      ellipse(0, 0, this.size, this.size * 0.5);
      pop();
    } else if (this.type === 'smoke') {
      fill(this.hue, this.saturation, this.lightness, this.life/255);
      circle(this.x, this.y, this.size);
    } else if (this.type === 'star') {
      fill(this.hue, this.saturation, this.lightness * this.twinkle, this.life/255);
      beginShape();
      for (let i = 0; i < 5; i++) {
        let angle = TWO_PI / 5 * i;
        let x = this.x + cos(angle) * this.size;
        let y = this.y + sin(angle) * this.size;
        vertex(x, y);
        angle += TWO_PI / 10;
        x = this.x + cos(angle) * (this.size * 0.5);
        y = this.y + sin(angle) * (this.size * 0.5);
        vertex(x, y);
      }
      endShape(CLOSE);
    }
    colorMode(RGB);
  }
  
  isFinished() {
    return this.life <= 0;
  }
}