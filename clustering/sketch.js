var n_vectors;
var noise_arr;
var acc_x, acc_y;
var start_c, end_c;
var accumulator;
var _cellSize;
var _numX, _numY;
var _noiseX, _noiseY, _startX, _startY;
var pointsArr;
var islandPoints;
var totalPoints;
var maxDist;

function setup() {
  createCanvas(1080, 1900);
  background(200); //white
  // noStroke();
  n_vectors = 90;
  acc_x = 0;
  acc_y = 0;
  start_c = color('#8360c3');
  end_c = color('#2ebf91');
  accumulator = 0;
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
  // noLoop();

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
      if (c < 0.40){
        c=1;
        // pointsArr.push(new PointObj(i*_cellSize,j*_cellSize));
      } else{
        c=0;
      }
      noise_arr[i][j] = c ;

      // fill(255 * c);
      // rect(i*_cellSize, j*_cellSize, _cellSize, _cellSize);
    }
  }

  // first compute the islands themselves and draw them to debug
  let n_islands = countIslands(noise_arr);
  console.log("Number of islands is: " + n_islands);

  let colors = [];
  for (let k=0; k<totalPoints.length;k++){
    colors[k] = color(random(255), random(255), random(255));
  }

  // then randomly populate 10_000 points across the image
  // verify if they are in an island, if so keep, else continue
  // if in island, deterine which island
  let rendered = 5000;
  let acc = 0;
  while (acc < rendered){
    let tx = random(0, width);
    let ty = random(0, height);
    if (noise_arr[int(tx/_cellSize)][int(ty/_cellSize)] != 1){
      pointsArr.push(new PointObj(tx,ty));
      acc++;
    }
    /* To connect all the points in the islands, use below */
    // if (noise_arr[int(tx/_cellSize)][int(ty/_cellSize)] == 1){
    //   // now verify which island
    //   let testx = int(tx/_cellSize);
    //   let testy = int(ty/_cellSize);
    //   for (let k=0; k<totalPoints.length;k++){
    //     let island = totalPoints[k];
    //     for (let m=0;m<island.length;m++){
    //       if ((testx == island[m].x) && (testy==island[m].y)){
    //         pointsArr.push(new PointObj(tx,ty, k));
    //       }
    //     }
    //   }
    //   acc++;
    // } 
  }
  // for (let k=0; k<pointsArr.length;k++){
  //   push();
  //   strokeWeight(1);
  //   // stroke(colors[pointsArr[k].island]);
  //   stroke(0);
  //   noFill();
  //   ellipse(pointsArr[k].x, pointsArr[k].y, _cellSize, _cellSize);
  //   pop();
  // }  
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
}

function draw() {
  background(200); //white
  for (let idp = 0; idp<pointsArr.length;idp++){
    pointsArr[idp].update();
    pointsArr[idp].display();
  }
  /* To connect all the points in the islands, use below */
  // let targets = new Array(totalPoints.length);
  // for (let idt=0; idt<totalPoints.length;idt++){ //num islands
  //   targets[idt] = [];
  // }
  // for (let k=0; k<pointsArr.length;k++){
  //   targets[pointsArr[k].island].push(pointsArr[k]);
  // }

  // for (let k=0; k<pointsArr.length;k++){
  //   let candidates = targets[pointsArr[k].island];
  //   if (candidates.length > 10 ){
  //     let n_connections = 20;
  //     let idc = 0;
  //     let p = createVector(pointsArr[k].x,pointsArr[k].y);
  //     while (idc < n_connections){
  //       let nextp = int(random(0, candidates.length));
  //       let pp = createVector(candidates[nextp].x,candidates[nextp].y);
  //       let dist = p5.Vector.dist(p, pp);
  //       dist = map(dist, 0, sqrt(width**2+height**2)/_cellSize, 0.2, 1);
  //       if (dist < maxDist){
  //         console.log(dist);
  //         push();
  //         stroke(0, alpha=255/dist**2);
  //         strokeWeight(0.1);
  //         line(p.x, p.y, pp.x, pp.y);
  //         pop();
  //       }
  //       idc++;
  //     }
  //   }
  // }
  console.log('done');
}

class PointObj {
  constructor(ex, why, island=-1){
    this.x = ex;
    this.y = why;
    if (island>=0){
      this.island = island;
    }
    this.connections = [];
    this.speed = random(0, 0.2);
  }
  addConnection(connector){
    this.connections.push(connector);
  }
  update(){
    this.y += _cellSize*random(-this.speed,this.speed);
    this.x += _cellSize*random(-this.speed, this.speed);
    _noiseX += 0.1;
    _noiseY += 0.1; 
  }
  display(){
    let p = createVector(this.x,this.y);
    for (let idc=0;idc<this.connections.length;idc++){
      let pp = createVector(this.connections[idc].x,this.connections[idc].y);
      let dist = p5.Vector.dist(p, pp);
      let alph = map(dist, 0, maxDist, 0, 1);
      push();
      strokeWeight(1*(1-alph));
      stroke(0,alpha=255*(1-alph**0.4));
      line(this.x,this.y,this.connections[idc].x,this.connections[idc].y);
      pop();
    }

  }
}

// A function to check if a given cell (row, col) can
// be included in DFS
function isSafe(M,row,col,visited){
  // row number is in range, column number is in range
  // and value is 1 and not yet visited
  return (row >= 0) && (row < _numX) && (col >= 0) && (col < _numY) && (M[row][col] == 1 && !visited[row][col]);
}
function DFS(M, row, col, visited){
  // These arrays are used to get row and column numbers
  // of 8 neighbors of a given cell
  let rowNbr = [-1, -1, -1, 0, 0, 1, 1, 1];
  let colNbr = [-1, 0, 1, -1, 1, -1, 0, 1];
    
  // Mark this cell as visited
  visited[row][col] = true;
    
  // Recur for all connected neighbours
  for (let k = 0; k < 8; ++k)
  {
      if (isSafe(M, row + rowNbr[k], col + colNbr[k], visited))
      {
          DFS(M, row + rowNbr[k], col + colNbr[k], visited);
          // console.log(row + rowNbr[k], col + colNbr[k]);
          islandPoints.push(new PointObj(row + rowNbr[k], col + colNbr[k]));
      }
  }
  
}
function countIslands(M){
  // Make a bool array to mark visited cells.
  // Initially all cells are unvisited
  let visited = new Array(_numX);

  for(let i = 0; i < _numX; i++)
  {
      visited[i] = new Array(_numY);
  }
  for(let i = 0; i < _numX; i++)
  {
      for(let j = 0; j < _numY; j++)
      {
          visited[i][j] = false;
      }
  }
  // Initialize count as 0 and traverse through the all cells
  // of given matrix
  let count = 0;
  for (let i = 0; i < _numX; ++i)
  {
      for (let j = 0; j < _numY; ++j)
      {
          if (M[i][j] == 1 && !visited[i][j])
          {
              totalPoints[count] = []; //init new island, fill it with DFS function
              // value 1 is not
              // visited yet, then new island found, Visit all
              // cells in this island and increment island count
              DFS(M, i, j, visited);
              totalPoints[count] = islandPoints;
              //now reinit islandPoints
              islandPoints = [];
              count++;
          }
      }
  }
  return count;
}
