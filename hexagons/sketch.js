var colors, colors_hex;
var r1, r2, directions;
var n_gons, n_reps;
var seed, rand;
var paused;
var current_angle;
var display_frame; 
let canvas, output;
let scaleOutput = 1;

function setup() {
  canvas = createCanvas(2160, 2160);
  // output = createGraphics(2160, 2160);
  colors_hex = [
    ['#f05f57', '#360940'], //good
    // ['#c33764', '#1d2671'], //similar to first, choose only one
    // ['#81ffef', '#f067b4'], //vaporwave, maybe dump
    // ['#b92b27', '#1565c0'], //no good
    ['#99f2c8', '#1f4037'], //green to black ish, looks nice
    ['#1a060e', '#104178'], //dark blue to purple, looks nice
    ['#f7a002', '#190b0c'], //yellow to black ish, not the best
    // ['#d20932', '#0c0d11'], //red, too many strong colors if you keep this
    ['#0a5969', '#100b0d'], //teal to black, use instead of green to black
  ];
  seed = cyrb128("Hexagon");
  rand = mulberry32(seed[0]);
  n_gons = colors_hex.length;
  n_reps = 10;
  directions = [];
  r1 = [];
  r2 = [];
  for (let k = 0; k < n_gons; k += 1) {
    directions[k] = Math.sign(map(10*rand(), 0, 10, -1, 1));
    r1[k] =  0.075*map(10*rand(), 0, 10, -1, 1);;
    r2[k] =  0.075*map(10*rand(), 0, 10, -1, 1);;
  }
  paused = true;
  display_frame = 0;
  current_angle = 39;
  // noLoop();
  // frameRate(2);
}

function draw() {
  // clear canvas
  background(0);
  // output.clear();
  // // set scale
  // output.push();
  // output.scale(scaleOutput);

  // output.pop();
  let decriment = [0.01, 0.008];
  for (let j = 0; j < n_gons; j += 1) {
    let start_ramp = color(colors_hex[j][0])
    let end_ramp = color(colors_hex[j][1])
    for (let i = 0; i <= n_reps; i += 1) {
      let inter = map(i, 0, n_reps, 0, 1);
      let interp_color = lerpColor(start_ramp, end_ramp, inter);
      let x = width * (0.5 + directions[j] * i * decriment[0] + j * r1[j]);
      let y =  height * (0.4  + directions[j] * i * decriment[1] + j * r2[j]) ;
      
      interp_color.setAlpha(255-15*i);
      stroke(interp_color);
      if (!paused){
        display_frame += 1;
        current_angle = display_frame / 2000.0 + 39 ;
      }
      // polygon(x, y, size=600, sides=6, rot=current_angle);
      polygon_rounded(x, y, size=600, sides=6, radius=50, res = 5, rot=current_angle);
    }
  }
}

function polygon(x, y, size, sides, rot=39) {
  let angle = TWO_PI / sides;
  push();
  translate(x,y);
  rotate(rot);
  strokeWeight(4);
  fill(0, alpha = 0);
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = cos(a) * size;
    let sy = sin(a) * size;
    vertex(sx, sy);
  }
  endShape(CLOSE);
  pop();
}

function polygon_rounded(x, y, size, sides = 3, radius = 0, res = 5, rot=0) {
  // Polygon is drawned inside a circle
  // Angle of 1 corner of polygon
  let apoly = (sides > 2 ? (sides - 2) * PI : TWO_PI) / sides;
  // Radius angle
  let aradius = sides > 2 ? PI - apoly : PI;
  // distance between vertex and radius center
  let r = 2 * radius * sin(HALF_PI - 0.5 * apoly); push();
  // debug log
  // console.log('Polygon : sides '+sides+', apoly:'+degrees(apoly).toPrecision(4)+', aradius:'+degrees(aradius).toPrecision(4)+',distance from vertex for radius:'+rproj.toPrecision(4))
  
  // Start drawing
  push();
  translate(x, y);
  rotate(rot);
  strokeWeight(4);
  fill(0, alpha = 0);
  beginShape();
  for (let a = 0; a < sides; a++) {
      // Rotation for polygon vertex
      let rot = a * TWO_PI / sides;
      if (radius) {
          // Vertex coordinates
          let cx = (size - r) * cos(rot);
          let cy = (size - r) * sin(rot);
          for (let i = 0; i < res; i++) {
              let rotrad = rot + i*aradius/(res-1) - 0.5*aradius;
              let px = radius * cos(rotrad);
              let py = radius * sin(rotrad);
              vertex(cx + px, cy + py);
              // circle(cx + px, cy + py, 0.15*i+2)
          }
          // circle(cx, cy, 0.15*a+2)
      } else {
          let dx = size * cos(rot);
          let dy = size * sin(rot);
          vertex(dx, dy);
          // circle(dx,dy, 0.15*a+2);
      }
  }
 endShape(CLOSE);
 pop();
}

// file export and input options
function keyTyped() {
  if (keyCode === 32) {
      paused = ! paused 
      console.log('space pressed');
  }
  else if (keyCode === 82){
    current_angle = 39;
  }
  else if (keyCode === 69){
    save('render.png');
  }
};

//see https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
// for more on random seeded number generation

function cyrb128(str) {
  let h1 = 1779033703, h2 = 3144134277,
      h3 = 1013904242, h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
      k = str.charCodeAt(i);
      h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
      h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
      h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
      h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
}

function mulberry32(a) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

