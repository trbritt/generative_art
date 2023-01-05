let pentagon;
let _maxLevels;
let _strutFactor;
let _strutNoise;
let displayFrame;
let paused;
let _angleNoise;
let _angleNoiseAmplitude;
let _sideNoise;
let _sideNoiseAmplitude;

function setup() {
  createCanvas(1000, 1000);

  _maxLevels = 6;

  _strutFactor = 0.2;
  _strutNoise = random(10);

  _angleNoise = random(10);
  _angleNoiseAmplitude = 0; //in degrees

  _sideNoise = random(10);
  _sideNoiseAmplitude = 10;

  displayFrame = 0;
  paused = false;

  smooth();
  angleMode(DEGREES);

}

function keyTyped(){
  if (keyCode === 32){
    paused = !paused;
  } else if (keyCode === 69){
    save('render.png');
  }
}
function draw(){
  background(255);
  

  pentagon = new FractalRoot(3, displayFrame);
  pentagon.drawShape();
  if (!paused){
    _strutNoise += 0.01;
    // _angleNoise += 0.01;
    _sideNoise += 0.01;
    _strutFactor = noise(_strutNoise)*2;
    displayFrame++;
  }
}
class PointObj {
  constructor(ex, why){
    this.x = ex;
    this.y = why;
  }
}

class FractalRoot{
  constructor(sides, rot){
    this.centX = width/2;
    this.centY = height/2;
    this.pointArr = [];

    let n_sides = sides+int(_sideNoiseAmplitude*noise(_sideNoise));
    this.angle = int(360/n_sides) + _angleNoiseAmplitude*noise(_angleNoise);
    let acc = 0;
    for (let i=0; i<360;i+=this.angle){
      let x = this.centX + 400*cos(i+rot);
      let y = this.centY + 400*sin(i+rot);
      this.pointArr[acc] = new PointObj(x,y);
      acc++;
    }
    this.rootBranch = new Branch(0,0,this.pointArr);
  }
  drawShape(){
    this.rootBranch.display();
  }
}

class Branch {
  constructor(lev, n, points){
    this.level = lev;
    this.num = n;
    this.outerPoints = points;

    this.calcMidPoints();
    this.calcStrutPoints();

    this.myBranches = [];
    if ( (this.level+1) < _maxLevels ){
      //below adds recursion for the center pentagon
      this.myBranches.push(new Branch(this.level+1,0,this.projPoints));
      //now we need to include the other 5 voided regions with the same schema
      for (let k=0; k<this.outerPoints.length;k++){
        let nextk = k-1;
        if (nextk < 0){nextk += this.outerPoints.length;}
        let newPoints = [this.projPoints[k],this.midPoints[k],this.outerPoints[k],this.midPoints[nextk],this.projPoints[nextk]];
        this.myBranches.push(new Branch(this.level+1,k+1,newPoints));
      }
    }

  }
  display(){
    strokeWeight(5-this.level);
    // draw outer shape
    for (let i=0; i<this.outerPoints.length; i++){
      let nexti = (i+1)%this.outerPoints.length;
      line(this.outerPoints[i].x,this.outerPoints[i].y,this.outerPoints[nexti].x, this.outerPoints[nexti].y);
    }
    //draw midpoints
    strokeWeight(0.5);
    fill(255,150);
    for (let j=0; j<this.midPoints.length;j++){
      // ellipse(this.midPoints[j].x, this.midPoints[j].y,15,15);
      //projected points for the struts
      if (this.level != _maxLevels - 1){
        line(this.midPoints[j].x,this.midPoints[j].y,this.projPoints[j].x,this.projPoints[j].y);
      }
      // ellipse(this.projPoints[j].x,this.projPoints[j].y,15,15);
    }
    //render children
    for (let k=0;k<this.myBranches.length;k++){
      this.myBranches[k].display();
    }

  }

  calcMidPoints(){
    this.midPoints = [];
    for (let i=0; i<this.outerPoints.length;i++){
      let nexti = (i+1)%this.outerPoints.length;
      this.midPoints[i] = this.calcMidPoint(this.outerPoints[i],this.outerPoints[nexti]);
    }
  
  }

  calcMidPoint(end1, end2){
    let mx, my;
    if (end1.x>end2.x){
      mx = end2.x + 0.5*(end1.x - end2.x);
    } else {
      mx = end1.x + 0.5*(end2.x - end1.x);
    }
    if (end1.y>end2.y){
      my = end2.y + 0.5*(end1.y - end2.y);
    } else {
      my = end1.y + 0.5*(end2.y - end1.y);
    }
    return new PointObj(mx,my);
  }

  //now calculate projected structs to form vertices of interior pentagon
  calcStrutPoints(){
    this.projPoints = [];
    for (let i=0; i<this.midPoints.length;i++){
      let nexti = i+3;
      if (nexti >= this.midPoints.length){nexti -= this.midPoints.length;}
      this.projPoints[i] = this.calcProjPoint(this.midPoints[i],this.outerPoints[nexti]);
    }
  }
  calcProjPoint(mp, op){
    let px, py, adj, opp;

    if (op.x > mp.x) {
      opp = op.x - mp.x;
    } else {
      opp = mp.x - op.x;
    }

    if (op.y > mp.y) {
      adj = op.y - mp.y;
    } else {
      adj = mp.y - op.y;
    }

    if (op.x > mp.x) {
      px = mp.x + (opp * _strutFactor);
    } else {
      px = mp.x - (opp * _strutFactor);
    }

    if (op.y > mp.y) {
      py = mp.y + (adj * _strutFactor);
    } else {
      py = mp.y - (adj * _strutFactor);
    } 
    return new PointObj(px,py);
  }
}
// function draw() {
//   background(220);
// }
