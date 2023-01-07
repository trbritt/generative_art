var n_vectors;
var noise_arr;
var acc_x, acc_y;
var top_c, bottom_c;
var _cellSize;
var _numX, _numY;
var _noiseX, _noiseY, _startX, _startY;
var pointsArr;
var maxDist;

function setup() {
  createCanvas(1900, 1080);
  background('#f5efdc');
  // pixelDensity(4);
  n_vectors = 90;
  acc_x = 0;
  acc_y = 0;

  top_c = color('#8360c3');
  bottom_c = color('#2ebf91');
  left_c = color('#eb5757');
  right_c = color('#000000');

  _cellSize = 10;
  _numX = floor(width/_cellSize);
  _numY = floor(height/_cellSize);
  
  maxDist = 100;

  noise_arr = [];
  _startX = random(10);
  _startY = random(10);
  pointsArr = [];

  islandPoints = [];
  totalPoints = [];

  angleMode(DEGREES);

  //draw noise
  strokeWeight(0);
  _startX += 0.01;
  _startY += 0.01;

  _noiseX = _startX;
  _noiseY = _startY;

  for (var i = 0; i < _numX; i++){
    noise_arr[i] = [];
    _noiseX += 0.1;
    _noiseY = _startY;
    for (var j=0; j<_numY; j++){
      _noiseY += 0.1;
      let c = noise(_noiseX, _noiseY);
      if (c < 0.40){c=1;} else{c=0;}
      noise_arr[i][j] = c ;
    }
  }
  let rendered = 10000;
  let acc = 0;
  while (acc < rendered){
    let tx = random(0, width);
    let ty = random(0, height);
    if (noise_arr[int(tx/_cellSize)][int(ty/_cellSize)] != 1){
      pointsArr.push(new PointObj(tx,ty));
      acc++;
    }
  }
  let n_connections = 20;
  for (let idp = 0; idp<pointsArr.length;idp++){
    let idc = 0;
    let p = createVector(pointsArr[idp].x,pointsArr[idp].y);
    while(idc<n_connections){
      let nextp = int(random(0, pointsArr.length));
      let pp = createVector(pointsArr[nextp].x,pointsArr[nextp].y);
      let dist = p5.Vector.dist(p, pp);
      if (dist<maxDist){
        pointsArr[idp].addConnection(pointsArr[nextp]);
        idc++;
      }
    }
  }
  for (let idp = 0; idp<pointsArr.length;idp++){
    pointsArr[idp].updateColors();
    pointsArr[idp].display();
  }
  noLoop();
}
class PointObj {
  constructor(ex, why){
    this.x = ex;
    this.y = why;

    this.connections = [];
    this.connection_colors = [];
  }
  addConnection(connector){
    this.connections.push(connector);
  }
  updateColors(){
    let linecol;
    let lr_col;
    let tb_col;

    let p = createVector(this.x,this.y);
    for (let idc=0;idc<this.connections.length;idc++){
      let pp = createVector(this.connections[idc].x,this.connections[idc].y);
      push();
      let dist = p5.Vector.dist(p, pp);
      let alph = map(dist, 0, maxDist, 0, 1);
      tb_col = lerpColor(top_c, bottom_c, 0.5*(this.y+this.connections[idc].y)/height);
      lr_col = lerpColor(left_c, right_c, 0.5*(this.x+this.connections[idc].x)/width);
      linecol = lerpColor(tb_col,lr_col,0.5);
      linecol.setAlpha(alpha(linecol)*(1-alph**0.4));
      this.connection_colors.push(linecol);
      pop();
    }
  }
  display(){
    let p = createVector(this.x,this.y);
    for (let idc=0;idc<this.connections.length;idc++){
      let pp = createVector(this.connections[idc].x,this.connections[idc].y);
      let dist = p5.Vector.dist(p, pp);
      let alph = map(dist, 0, maxDist, 0, 1);
      push();
      strokeWeight(1*(1-alph));
      stroke(this.connection_colors[idc]);
      line(this.x,this.y,this.connections[idc].x,this.connections[idc].y);
      pop();
    }

  }
}
