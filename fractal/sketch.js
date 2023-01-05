let _numChildren;
let _maxLevels;
let _trunk;

function setup() {
  createCanvas(750, 500);
  background(255);
  _numChildren = 4;
  _maxLevels = 7;
  noFill();
  smooth();
  angleMode(DEGREES);
  newTree();
}

function newTree(){
  _trunk = new Branch(1,0,width/2, 50);
  _trunk.display();
}

function draw() {
  background(255);
  _trunk.update(width/2, height/2);
  _trunk.display()
}

class Branch {
  constructor(lev, ind, ex, why){
    this.level = lev;
    this.index = ind;
    this.x;
    this.y;
    this.endx;
    this.endy;
    this.children = [];

    this.strokeW = 10/this.level;
    this.alph = 255 / this.level;
    this.len = random(200)/this.level;
    this.rot = random(360);
    this.lenChange = random(10)-5;
    this.rotChange = random(10)-5;

    this.update(ex, why);

    if (this.level < _maxLevels){
      for (let i=0; i<_numChildren; i++){
        this.children[i] = new Branch(this.level+1, this.x, this.endx, this.endy);
      }
    }
  }
  update(ex, why){
    this.x = ex;
    this.y = why;

    this.rot += this.rotChange;
    this.rot = this.rot%360;
    
    this.len -= this.lenChange;
    if(this.len<0){this.lenChange *= -1;}
    else if (this.len > 200){this.lenChange *= -1;}

    this.endx = this.x + this.len*cos(this.rot);
    this.endy = this.y + this.len*sin(this.rot);

    for (let i=0; i<this.children.length;i++){
      this.children[i].update(this.endx, this.endy);
    }
    // this.endx = this.x + this.level*(random(100)-50);
    // this.endy = this.y + 50+this.level*random(50);
  }
  display(){
    // strokeWeight(_maxLevels-this.level+1);
    strokeWeight(this.strokeW);
    stroke(0,this.alph);
    fill(255,this.alph);
    line(this.x, this.y, this.endx, this.endy);
    ellipse(this.x, this.y, this.len/12, this.len/12);
    for (let i=0; i<this.children.length; i++){
      this.children[i].display();
    }
  }
}

