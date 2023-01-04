let circles = []; // array of Jitter objects
let _num = 10;
let paused = false;

function setup() {
  createCanvas(710, 400);
  // Create objects
  background(220);
  addCircles();
}

function addCircles(){
  for (let i = 0; i < _num; i++) {
    circles.push(new Circle(linecol=color(0,0),fillcol=color(random(255),random(255),random(255))));
  }
}
function keyReleased(){
  if (keyCode === 32){
    paused = ! paused;
  }
}
function mouseReleased(){
  addCircles();
}
function draw() {
  background(220);
  // background(50, 89, 100);
    for (let i = 0; i < circles.length; i++) {
      if (!paused) {circles[i].move();}      
      circles[i].display();
    }
}

// Circle class
class Circle {
  constructor(linecol=color(0), fillcol=color(255)) {
    this.x = random(width);
    this.y = random(height);

    this.touching = false;
    this.xmove = random(10)-5;
    this.ymove = random(10)-5;

    this.speed = 1;

    this.radius = random(100) + 10;
    this.linecol = linecol;
    this.fillcol = fillcol;
    this.alph = random(255);
  }

  move() {
    this.x += this.xmove;
    this.y += this.ymove;

    if (this.x > width + this.radius){this.x = - this.radius;}
    if (this.x < -this.radius){this.x = width + this.radius;}
    if (this.y > height + this.radius){this.y = - this.radius;}
    if (this.y < -this.radius){this.y = height + this.radius;}
  }

  display() {
    this.fillcol.setAlpha(this.alph);
    fill(this.fillcol);
    stroke(this.linecol);
    ellipse(this.x, this.y, this.radius*2, this.radius*2);
    for (let i=0; i<circles.length; i++) {
      let otherCirc = circles[i];
      if (otherCirc != this){
        let dis = dist(this.x, this.y, otherCirc.x, otherCirc.y);
        let overlap = dis - this.radius - otherCirc.radius;
        if (overlap < 0){
          let midx = 0.5*(this.x+otherCirc.x);
          let midy = 0.5*(this.y+otherCirc.y);
          stroke(0,100);
          noFill();
          overlap *= -1;
          ellipse(midx, midy, overlap, overlap);
        }
      }
    }
  }
}
