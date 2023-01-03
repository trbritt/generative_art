var n_vectors;
var noise_arr = [];
var acc_x, acc_y;
var start_c, end_c;
var accumulator;
function setup() {
  createCanvas(1200, 1200);
  background(0);
  // noStroke();
  n_vectors = 90;
  acc_x = 0;
  acc_y = 0;
  start_c = color('#8360c3');
  end_c = color('#2ebf91');
  accumulator = 0;
  angleMode(DEGREES);
  noLoop();
}

function draw() {
  //draw noise
  // push();
  // strokeWeight(0);
  for (var x = 0; x < width; x+=10) {
    acc_y = 0;
    noise_arr[acc_x] = [];
    for (var y = 0; y < height; y+=10) {
      var c = noise(0.01 * x, 0.01 * y);
      noise_arr[acc_x][acc_y] = c;
      // fill(255 * c);
      // rect(x, y, 10, 10);
      acc_y += 1;
    }		
    acc_x += 1;
  }
  // pop();
  stroke(255,0,0);
  strokeWeight(0.01);
  // line(0,0,100,100);
  let _nx = n_vectors;
  let _ny = n_vectors;
  let dx = 0.1*width / (_nx + 1);
  let dy = 0.1*height / (_ny + 1);
  let x_points = [];
  let y_points = [];
  for (let i=0; i<_nx; i += 1){
    x_points[i] = dx + i*dx;
  }
  for (let i=0; i<_ny; i += 1){
    y_points[i] = dy + i*dy;
  }
  push();
  scale(10);
  translate(1,1);
  // draw the arrows
  // for (let i=0; i<_nx; i += 1){
  //   let x = x_points[i];
  //   for (let j=0; j<_ny; j += 1){
  //     let y = y_points[j];
  //     let angle = 360*noise_arr[int(x)][int(y)];
      // angle = round(angle / (45)) * 45;
      // line(x, y, x+length*cos(angle), y-length*sin(angle));
      // draw_arrow(x, y, length=min(dx, dy), angle=angle);
      // rect();
  //   }
  // }
  // draw the flow field
  strokeWeight(0.050);
  let STEP_SIZE = 0.001 * max(width, height);
  let flow_length = 1000;
  let x_s = 0.;
  let y_s = 0.;
  let x_f = 0.;
  let y_f = 0.;
  let c_len = 0.;
  let angle = 0.;
  
  for (let idx=0; idx < _nx; idx++){
    let x = x_points[idx];
    let interx = map(idx, 0, _nx, 0, 1);
    for (let idy=0; idy < _ny; idy++){
      let y = y_points[idy];
      let intery = map(idy, 0, _ny, 0, 1);
      let ratio = 0.5;
      // let interxy = ratio*interx+(1-ratio)*intery;
      // let interxy = interx**0.5*intery**2;
      let interxy=interx;
      x_s = x;
      y_s = y;
      c_len = 0

      let c = lerpColor(start_c, end_c, interxy);

      while (c_len < flow_length){
        // if (accumulator < frameCount){
        //   console.log('breaking now');
        //   break;
        // }
        angle = 360*noise_arr[int(x_s)][int(y_s)];
        angle = 45 * round(angle/45);
        x_f = x_s + STEP_SIZE * cos(angle);
        y_f = y_s - STEP_SIZE * sin(angle);
        // fill(255 * noise_arr[int(x_s)][int(y_s)] )
        // rect(x_s, y_s, abs(x_f-x_s), abs(y_f-y_s));
        c.setAlpha(map(angle, 0, 360, 0, 255));
        stroke(c);
        line(x_s, y_s, x_f, y_f);
        c_len += sqrt((x_f-x_s)**2+(y_f-y_s)**2);
        accumulator ++;
        if ( (x_f < 0) || (x_f >= width) || (y_f < 0) || (y_f >= height) || c_len > flow_length ){
          break;
        }
        else{
          x_s = x_f;
          y_s = y_f;
        }

      }
    }
  }
  pop();
}

function draw_arrow(x_i, y_i, length=100, angle=0){
  // compute the second points and draw arrow body
  let x_f = x_i + length*cos(angle);
  let y_f = y_i - length*sin(angle);
  line(x_i, y_i, x_f, y_f);
  let a_angle1  = angle - 30;
  let a_angle2 = angle + 30;
  let x1 = x_f - (length/2)*cos(a_angle1);
  let y1 = y_f + (length/2)*sin(a_angle1);
  let x2 = x_f - (length/2)*cos(a_angle2);
  let y2 = y_f + (length/2)*sin(a_angle2);

  line(x_f, y_f, x1, y1);
  line(x_f, y_f, x2, y2);
}

function keyPressed(){
  if (keyCode === 69) {
    save('render.png');
  }
}

// let particles = [];
// let n = 100;
// let pal;
// let squiggliness = 1/500;
// let lineStroke = 1;

// let freq = 4;

// function setup(){
//   c = createCanvas(1100, 700);
//   // c.parent("sketch")
//   background(0)
  
//   noStroke();
//   pal = ["#04a3bd", "#f0be3d", "#931e18", "#da7901", "#247d3f", "#20235b"]//Lakota
//   updateParticles();
// }

// function draw(){
//   for (let p of particles) {
//     p.draw();
//     p.move();
//     p.stop();
//   }
// }

// function updateParticles(){
//   particles = [];
//   for(let x = 0; x<width; x+=freq){
//     let x_ = x;
//     let s_ = lineStroke;
//     let cNum = floor(random(pal.length))
//     let c_ = color(pal[cNum])
//     particles.push(new Particle(x_, 0, s_, c_));
//     particles.push(new Particle(x_, height, s_, c_));
//   }
//   for(let y = 0; y< height; y+=freq){
//     let y_ = y;
//     let s_ = lineStroke;
//     let cNum = floor(random(pal.length))
//     let c_ = color(pal[cNum])
//     particles.push(new Particle(0, y_, s_, c_));
//     particles.push(new Particle(width, y_, s_, c_));
//   }
// }

// class Particle {
//   constructor(x_, y_, s_, c_){
//     this.x = x_;
//     this.y = y_;
//     this.size = s_;
//     this.c = c_;

//     this.alpha = 70; 
//     this.dist = 0.75;
//   }
//   move(){
//     let theta = noise(this.x * squiggliness, this.y * squiggliness) * PI * 2;
//     // theta = round(theta / (PI/4)) * PI / 4;
//     let v = p5.Vector.fromAngle(theta, this.dist) 
//     this.x += v.x;
//     this.y += v.y;
//     this.alpha *= 1;

//   }
//   draw(){
//     fill(this.c)
//     ellipse(this.x, this.y, this.size)
//   }
//   stop(){
//     if(this.x>width || this.x<0){
//       this.dist = 0;
//     }
//     if(this.y>height || this.height<0){
//       this.dist = 0;
//     }
//   }
// }