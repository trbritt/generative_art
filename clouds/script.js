/* Below gives rolling clouds (fluffy) */
/*
var xstart, xnoise, ystart, ynoise;
function setup() {
  createCanvas(300, 300);
  smooth();
  background(0);
  frameRate(30);

  xstart = random(10);
  ystart = random(10);

  angleMode(DEGREES);
}

function draw() {
  background(0); //clear every time

  xstart += 0.01;
  ystart += 0.01;

  xnoise = xstart;
  ynoise = ystart;

  for (let y=0; y <= height; y+= 5){
    ynoise += 0.1;
    xnoise = xstart;
    for (let x=0; x<=width; x+=5){
      xnoise += 0.1;
      drawPoint(x, y, noise(xnoise, ynoise));
    }
  }
}

function drawPoint(x, y, noiseFactor){
  push();
  translate(x,y);
  rotate(noiseFactor * 540)
  noStroke();
  let edgeSize = noiseFactor * 35;
  let grey = 150 + (noiseFactor * 120);
  let alph = 150 + (noiseFactor * 120);

  fill(grey, alph);
  ellipse(0,0, edgeSize, edgeSize/2);
  pop();
}
*/
/* This gives a slighly different natural variation */
var xstart, xnoise, ystart, ynoise;
var xstartNoise, ystartNoise;
function setup() {
  createCanvas(300, 300);
  smooth();
  background(255);
  frameRate(30);

  xstartNoise = random(20);
  ystartNoise = random(20);

  xstart = random(10);
  ystart = random(10);

  angleMode(DEGREES);
}

function draw() {
  background(255); //clear every time

  xstartNoise += 0.01;
  ystartNoise += 0.01;

  xstart += (noise(xstartNoise)*0.5) - 0.25;
  ystart += (noise(ystartNoise)*0.5)-0.25;

  xnoise = xstart;
  ynoise = ystart;

  for (let y=0; y <= height; y+= 5){
    ynoise += 0.1;
    xnoise = xstart;
    for (let x=0; x<=width; x+=5){
      xnoise += 0.1;
      drawPoint(x, y, noise(xnoise, ynoise));
    }
  }
}

function drawPoint(x, y, noiseFactor){
  push();
  translate(x,y);
  rotate(noiseFactor * 360)
  stroke(0, 150);
  line(0,0,20,0);
  pop();
}
