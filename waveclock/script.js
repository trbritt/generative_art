var _angnoise, _radiusnoise;
var _xnoise, _ynoise;
var _angle;
var _radius;
var _strokeCol;
var _strokeChange;

function setup(){
  createCanvas(500,300);
  background(255);
  smooth();
  frameRate(30);
  noFill();
  _angle = -90;
  _strokeCol = 254;
  _strokeChange = -1;
  _angnoise = random(10);
  _radiusnoise = random(10);
  _xnoise = random(10);
  _ynoise = random(10); 
  angleMode(DEGREES);
}

function draw() {
  push();
  stroke(1);
  _radiusnoise += 0.005;
  _radius = (noise(_radiusnoise) * 550) + 1;

  _angnoise += 0.005;
  _angle += (noise(_angnoise)*6) - 3;
  // _angle += 10;
  if (_angle > 360){_angle -= 360;}
  if (_angle < 0){_angle += 360;}

  _xnoise += 0.01;
  _ynoise += 0.01;

  let centerX = width/2  + noise(_xnoise)*100;
  let centerY = height/2  + noise(_ynoise)*100;

  translate(centerX, centerY);

  let x1 = _radius*cos(_angle);
  let y1 =  _radius*sin(_angle);
  // stroke(255, 0, 0);
  // ellipse(x1, y1, 5);
  let _oppang = (_angle + 180)%360;
  let x2 = _radius*cos(_oppang);
  let y2 = _radius*sin(_oppang);
  // ellipse(x2, y2, 5);
  _strokeCol += _strokeChange;
  if(_strokeCol > 254){_strokeChange = -1;}
  if(_strokeCol < 0){_strokeChange = 1;}
  stroke(_strokeCol, 60);
  strokeWeight(1);
  line(x1, y1, x2, y2);
  // ellipse(width/2, height/2, 50+_radius);
  // _radius += 1;
  pop();
}
