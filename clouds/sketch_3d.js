// lone 3D sphere
/* function setup() {
  createCanvas(500, 300, WEBGL);

}

function draw() {
  background(220);
  // normalMaterial();
  translate(width/8, 0, 0);
  push();
  // rotateZ(frameCount * 0.01);
  // rotateX(frameCount * 0.01);
  // rotateY(frameCount * 0.01);
  sphere(70);
  pop();
} */
 // visualize 2d noise in 3d; rolling clouds

/* var xstart, xnoise, ystart, ynoise;

function setup(){
  createCanvas(500, 300, WEBGL);
  background(0);
  noStroke();

  xstart = random(10);
  ystart = random(10);

}
function draw(){
  background(0);

  xstart += 0.1;
  ystart += 0.1;

  xnoise = xstart;
  ynoise = ystart;

  for (let y=0; y<=height; y+=5){
    ynoise += 0.1;
    xnoise = xstart;
    for (let x=0; x<=width; x+=5){
      xnoise += 0.1;
      drawPoint(x,y, noise(xnoise, ynoise));
    }
  }
}
function drawPoint(x, y, noiseFactor){
  push();
  translate(250-x, 250-y, -y);
  let sphereSize = noiseFactor * 35;
  let grey = 150 + noiseFactor*120;
  let alph = 150 + noiseFactor*120;

  fill(grey, alph);
  sphere(sphereSize);
  pop();
} */

// now combine the two for cube with 3D noise (cloud in a box)
var xstart, ystart, zstart;
var xnoise, ynoise, znoise;

const sideLength = 200;
const spacing = 5;
function setup(){
  createCanvas(500, 300, WEBGL);
  background(0);
  noStroke();

  xstart = random(10);
  ystart = random(10);
  zstart = random(10);
}

function draw(){
  background(0);

  xstart += 0.01;
  ystart += 0.01;
  zstart += 0.01;

  xnoise = xstart;
  ynoise = ystart;
  znoise = zstart;

  translate(-100, -50, -150);
  // rotateZ(frameCount * 0.1);
  // rotateY(frameCount * 0.1);

  for (let z=0; z<=sideLength; z+= spacing){
    znoise += 0.1;
    ynoise = ystart;
    for (let y=0; y<=sideLength; y+= spacing){
      ynoise += 0.1;
      xnoise = xstart;
      for (let x=0; x<=sideLength; x+=spacing){
        xnoise += 0.1;
        drawPoint(x, y, z, noise(xnoise, ynoise, znoise));
      }
    }
  }
}

function drawPoint(x, y, z, noiseFactor){
  push();
  translate(x, y, z);
  fill(noiseFactor * 255, 10);
  box(spacing, spacing, spacing);
  pop();
}
