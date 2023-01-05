let flock;
let desiredseparation;
let neighbourdist;
let _numBoids;

var img;

//vars for water in background
let _cellSize;
let _numX, _numY;
let flying;
function preload(){
  img = loadImage('whale.png');
}

function setup() {
  createCanvas(640, 360);
  frameRate(22);
  desiredseparation = 25.0;
  neighbourdist = 30;
  _numBoids = 10;

  flock = new Flock();
  // init set of boids
  for (let i=0; i < _numBoids; i++){
    flock.addBoid(new Boid(width/2,height/2));
    flock.addBoid(new Boid(random(0,width),random(0,height)));
  }

  //for bg
  _cellSize = 5;
  _numX = width / _cellSize;
  _numY = height / _cellSize;
  flying = 0;

  createLoop({duration:30,gif:true});
}

function draw() {
  background(190);
  push();
  flying += 0.2;
  let yoff = flying;
  for (let j=0; j < _numY; j++){
    let xoff = 0.0;
    for (let i=0; i < _numX; i++){
      let c = map(noise(xoff,yoff), 0, 1, -1, 4);
      fill(c*25, c*91, c*214, 180);
      noStroke();
      xoff+=0.6;
      rect(i*_cellSize, j*_cellSize, _cellSize, _cellSize);
    }
    yoff += 0.6;
  }
  pop();
  flock.run();
}

function mouseDragged(){
  flock.addBoid(new Boid(mouseX, mouseY));
}

class Flock {
  constructor(){
    this.boids = [];
  }
  run(){
    for (let i=0; i<this.boids.length;i++){
      this.boids[i].run(this.boids); //pass all boids to each boid
    }
  }
  addBoid(b){
    this.boids.push(b);
  }
}

class Boid {
  constructor(x,y){
    this.acceleration = createVector(0,0);
    this.velocity = createVector(random(-1,1),random(-1,1));
    this.position = createVector(x,y);

    this.r = 3.0;
    this.maxspeed = 3;
    this.maxforce = 0.05; //max steering force
  }
  run(boids){
    this.flock(boids);
    this.update();
    this.borders();
    this.display();
  }
  applyForce(force){
    this.acceleration.add(force);
  }
  flock(boids){
    let sep = this.separate(boids); //separation
    let ali = this.align(boids); //alignment
    let coh = this.cohesion(boids); //cohesion

    //weight these forces arbitrarily
    sep.mult(1.5);
    ali.mult(1.0);
    coh.mult(1.0);

    //add forces to accel
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);

  }
  update(){
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    //rest accel to zero each cycle
    this.acceleration.mult(0);
  }
  //calculates and applies steering force towards a target
  // STEER = DESIRED - VELOCITY
  seek(target){
    let desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxspeed);
    
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  }
  display(){
    let theta = this.velocity.heading();
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);
    imageMode(CENTER);
    image(img,0,0,60,20);
    pop()

    // fill(127);
    // stroke(200);
    // push();
    // translate(this.position.x,this.position.y);
    // rotate(theta);
    // beginShape();
    // vertex(0, -this.r*2);
    // vertex(-this.r, this.r*2);
    // vertex(this.r, this.r*2);
    // endShape(CLOSE);
    // pop();
  }
  // wrap things around 
  borders(){
    if (this.position.x < -this.r)  this.position.x = width + this.r;
    if (this.position.y < -this.r)  this.position.y = height + this.r;
    if (this.position.x > width + this.r) this.position.x = -this.r;
    if (this.position.y > height + this.r) this.position.y = -this.r;  
  }

  //method to check for nearby boids and steer away
  separate(boids){

    let steer = createVector(0,0);
    let count = 0;

    //check if each boid is too close
    for (let i=0; i<boids.length;i++){
      let d = p5.Vector.dist(this.position,boids[i].position);
      if ((d> 0) && (d < desiredseparation)){
        let diff = p5.Vector.sub(this.position, boids[i].position);
        diff.normalize();
        diff.div(d); // weight by distance
        steer.add(diff);
        count++;
      }
    }
    if (count > 0){steer.div(count);}
    if (steer.mag() > 0){
      //implement reynolds: steering = desired-velocity
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  }
  //alignemnt, for each nearby boid in system, calc averag velocity
  align(boids){
    let sum = createVector(0,0);
    let count = 0;
    for (let i=0;i<boids.length;i++){
      let d = p5.Vector.dist(this.position,boids[i].position);
      if ((d>0)&&(d<neighbourdist)){
        sum.add(boids[i].velocity);
        count++;
      }
    }
    if(count>0){
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxspeed);
      let steer = p5.Vector.sub(sum, this.velocity);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return createVector(0,0);
    }
  }
  // cohesion, for the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
  cohesion(boids){
    let sum = createVector(0,0);
    let count = 0;
    for (let i=0; i<boids.length;i++){
      let d = p5.Vector.dist(this.position, boids[i].position);
      if ((d>0) && (d < neighbourdist)){
        sum.add(boids[i].position);
        count++;
      }
    }
    if (count > 0){
      sum.div(count);
      return this.seek(sum);
    } else{
      return createVector(0,0);
    }
  }
}