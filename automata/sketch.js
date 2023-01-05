let _cellSize;
let _numX;
let _numY;
let _cellArray;

function setup() {
  // Set simulation framerate to 10 to avoid flickering
  frameRate(10);
  createCanvas(720, 400);
  // createCanvas(3840, 2160);
  // createCanvas(1920, 1080);
  _cellSize = 1;
  // Calculate _numX and _numY
  _numX = floor(width / _cellSize);
  _numY = floor(height / _cellSize);
  // Wacky way to make a 2D array is JS
  _cellArray = new Array(_numX);
  for (let i = 0; i < _numX; i++) {
    _cellArray[i] = new Array(_numY);
  }
  restart();
  background(240);
}

function draw() {
  background(240);
  for ( let i = 0; i < _numX;i++) {
    for ( let j = 0; j < _numY;j++) {
      _cellArray[i][j].calcNextState();
    }
  }
  for ( let i = 0; i < _numX;i++) {
    for ( let j = 0; j < _numY;j++) {
      _cellArray[i][j].display();
    }
  }

}

// reset board when mouse is pressed
// function mousePressed() {
//   restart();
// }
function keyPressed(){
  if (keyCode === 69){
    save('render.png');
  } else if (keyCode === 82){
    restart();
  }
}
// Fill board randomly
function restart() {
  for (let i = 0; i < _numX; i++) {
    for (let j = 0; j < _numY; j++) {
      // _cellArray[i][j] = new Cell_Discrete(i,j);
      _cellArray[i][j] = new Cell(i,j);
    }
  }
  for (let i = 0; i < _numX; i++) {
    for (let j = 0; j < _numY; j++) {
      let above = int(j-1);
      let below = int(j+1);
      let left = int(i-1);
      let right = int(i+1);

      if (above < 0){above = _numY-1;}
      if (below == _numY){below = 0;}
      if (left < 0){left = _numX-1;}
      if (right == _numX){right = 0;}

      _cellArray[i][j].addNeighbour(_cellArray[left][above]);
      _cellArray[i][j].addNeighbour(_cellArray[left][j]);
      _cellArray[i][j].addNeighbour(_cellArray[left][below]);
      _cellArray[i][j].addNeighbour(_cellArray[i][below]);
      _cellArray[i][j].addNeighbour(_cellArray[right][below]);
      _cellArray[i][j].addNeighbour(_cellArray[right][j]);
      _cellArray[i][j].addNeighbour(_cellArray[right][above]);
      _cellArray[i][j].addNeighbour(_cellArray[i][above]); 
    }
  }
}
//================================================= object
class Cell_Discrete {

  constructor(ex, why){
    this.x = ex * _cellSize;
    this.y = why * _cellSize;

    if (random(2)>1){
      this.nextState = true;
    }else{
      this.nextState = false;
    }
    this.state = this.nextState;
    this.neighbours = [];
    
  }

  addNeighbour(cell){
    this.neighbours.push(cell);
  }

  calcNextState(){
    // GOL
    // let liveCount = 0;
    // for (let i=0; i < this.neighbours.length; i++) {
    // if (this.neighbours[i].state == true) {
    // liveCount++;
    // }
    // }
    // if (this.state == true) {
    // if ((liveCount == 2) || (liveCount == 3)) {
    // this.nextState = true;
    // } else {
    // this.nextState = false;
    // }
    // } else {
    // if (liveCount == 3) {
    // this.nextState = true;
    // } else {
    // this.nextState = false;
    // }
    // }
    // this.state = this.nextState
    // vichniac vote
    let liveCount = 0;
    if (this.state){liveCount++;}
    for (let i=0; i<this.neighbours.length; i++){
      if (this.neighbours[i].state == true){
        liveCount++;
      }
    }
    if (liveCount <= 4){
      this.nextState = false;
    } else if (liveCount > 4) {
      this.nextState = true;
    }
    if ((liveCount == 4) || (liveCount == 5)){
      this.nextState = ! this.nextState;
    }
    this.state = this.nextState;
  }
  display(){
    if ((this.state)) fill(0);
    else fill(255);
    // stroke(0);
    // rect(this.x, this.y, _cellSize-1, _cellSize-1);
    noStroke();
    rect(this.x, this.y, _cellSize, _cellSize);
  }
}

/* This is a continuous variant */

//================================================= object
class Cell {

  constructor(ex, why){
    this.x = ex * _cellSize;
    this.y = why * _cellSize;

    this.lastState = 0.;
    this.nextState = ((this.x/500) + (this.y/300))*14;
    this.state = this.nextState;
    this.neighbours = [];
    
  }

  addNeighbour(cell){
    this.neighbours.push(cell);
  }

  calcNextState(){
    let total = 0;
    for (let i=0; i<this.neighbours.length; i++){
      total += this.neighbours[i].state;
    }
    let average = int(total/8);

    if (average == 255){
      this.nextState = 0;
    } else if (average == 0){
      this.nextState = 255;
    } else {
      this.nextState = this.state + average;
      if (this.lastState > 0){this.nextState -= this.lastState;}
      if (this.nextState > 255){this.nextState = 255;}
      else if (this.nextState < 0){this.nextState = 0;}
    }
    this.lastState = this.state;
  }
  display(){
    this.state = this.nextState;
    noStroke();
    fill(53, 77, 155, this.state);
    // fill(this.state);
    rect(this.x, this.y, _cellSize, _cellSize);
  }
}
