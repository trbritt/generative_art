var c, cd;
function setup() {
  createCanvas(2000, 2000, WEBGL);
  background(150);
  c = color(75, 140, 205, 150);
  cd = color(205, 75, 140, 150);

  strokeWeight(0.25);
  let xstart = random(10);
  let ynoise = random(10);
  for (let y = -(height/8); y <= (height/8); y+=3) {
    ynoise += 0.02;
    let xnoise = xstart;
    for (let x = -(width/8); x <= (width/8); x+=3) {
      xnoise += 0.02;
      drawPoint(x, y, noise(xnoise, ynoise));
    }
  }
}

function drawPoint( x,  y,  noiseFactor) {
  push();
  let interpc = lerpColor(c, cd, map(y, -(height/8), height/8, 0, 1));
  fill(interpc);
  stroke(interpc);
  translate(x * noiseFactor * 4, y * noiseFactor * 4, -y);
  // c.setAlpha(255*rad);
  let edgeSize = noiseFactor * 26;
  ellipse(0, 0, edgeSize, edgeSize);
  pop();
}
