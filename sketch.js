let score = 0;
let particles = [];
let explosionSound;
let startColor;
let endColor;
let lerpAmount = 0;

function preload() {
  explosionSound = loadSound('assets/sounds/explosion.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  startColor = color(0, 0, 0); // Начальный черный цвет
  endColor = color(255, 100, 100); // Конечный цвет (можно изменить на любой другой)
  textAlign(CENTER);
  textSize(32);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // Плавный переход цветов фона
  let currentColor = lerpColor(startColor, endColor, lerpAmount);
  background(currentColor);
  
  // Плавное изменение переменной lerpAmount
  lerpAmount += 0.001; // Чем меньше значение, тем медленнее переход
  if (lerpAmount > 1) lerpAmount = 0;  // Когда достигает конца, начинаем заново

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
  
  // Мягкие искры
  for (let i = 0; i < 80; i++) {  // Уменьшил количество искр
    particles.push(new Particle(x, y, baseHue, 'spark'));
  }

  // Плавные волны света
  for (let i = 0; i < 8; i++) {
    particles.push(new Particle(x, y, baseHue, 'wave'));
  }

  // Молнии
  for (let i = 0; i < 5; i++) {
    particles.push(new Particle(x, y, baseHue, 'lightning'));
  }

  // Дым
  for (let i = 0; i < 60; i++) {
    particles.push(new Particle(x, y, baseHue, 'smoke'));
  }

  // Звезды
  for (let i = 0; i < 30; i++) {
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
      this.size = random(4, 12);
      this.vx = random(-10, 10);
      this.vy = random(-10, 10);
      this.life = random(150, 255);
    } else if (type === 'wave') {
      this.size = 0;
      this.vx = 0;
      this.vy = 0;
      this.life = 200;
      this.speed = random(3, 6);
    } else if (type === 'lightning') {
      this.size = random(2, 6);
      this.vx = random(-3, 3);
      this.vy = random(-3, 3);
      this.life = random(100, 150);
      this.speed = random(5, 10);
    } else if (type === 'smoke') {
      this.size = random(15, 40);
      this.vx = random(-2, 2);
      this.vy = random(-2, 2);
      this.life = random(120, 220);
    } else if (type === 'star') {
      this.size = random(8, 18);
      this.vx = random(-5, 5);
      this.vy = random(-5, 5);
      this.life = random(60, 180);
      this.twinkle = random(0.4, 1);
    }
    
    this.hue = (baseHue + random(-50, 50)) % 360;
    this.saturation = random(70, 100);
    this.lightness = type === 'smoke' ? random(20, 40) : random(50, 90);
  }
  
  update() {
    if (this.type === 'spark') {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.92;
      this.vy *= 0.92;
      this.life -= 4;
      this.size *= 0.98;
    } else if (this.type === 'wave') {
      this.size += this.speed;
      this.life -= 3;
    } else if (this.type === 'lightning') {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= 5;
      this.size *= 0.98;
    } else if (this.type === 'smoke') {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.95;
      this.vy *= 0.95;
      this.life -= 2;
      this.size += 0.3;
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
      fill(this.hue, this.saturation, this.lightness, this.life / 255);
      for (let i = 0; i < 3; i++) {
        let alpha = this.life * (1 - i * 0.4);
        circle(this.x, this.y, this.size * (1 + i * 0.5));
      }
    } else if (this.type === 'wave') {
      noFill();
      stroke(this.hue, this.saturation, this.lightness, this.life / 255);
      strokeWeight(4);
      circle(this.x, this.y, this.size);
    } else if (this.type === 'lightning') {
      stroke(this.hue, this.saturation, this.lightness, this.life / 255);
      strokeWeight(3);
      line(this.x, this.y, this.x + random(-30, 30), this.y + random(-30, 30));
    } else if (this.type === 'smoke') {
      fill(this.hue, this.saturation, this.lightness, this.life / 255);
      circle(this.x, this.y, this.size);
    } else if (this.type === 'star') {
      fill(this.hue, this.saturation, this.lightness * this.twinkle, this.life / 255);
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
