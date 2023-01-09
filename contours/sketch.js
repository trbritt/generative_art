// var fxrand = sfc32(2047640294, 1852368387, -990459541, 1673650456)
// var stringSeed = cyrb128("apples");
var stringSeed = "emma";
var stringSeedHash = cyrb128(stringSeed);
var fxrand = sfc32(...stringSeedHash);
let colorsarray  = [ 
  [["1"] , ["2b2d42","8d99ae","ef233c","d90429"]],
  [["2"] , ["0A3A4A","196674","33A6B2","9AC836"]],
  [["3"] , ["91D9CC","F2C48D","593520"]],
  [["4"] , ["F24968","D984A3","BDDEF2","DCEAF2","A61212"]],
  [["5"] , ["BAD9D9","7BA692","344023","AFBF34"]],
  [["6"] , ["A62940","D90B42","591E3A","D8D9C5","D98484"]],
  [["7"] , ["F2C438","F27B13","D9C7B8","8C6C5A","F26D3D"]],
  [["8"] , ["F20544","8C2656","3F618C","012340","011826"]],
  [["9"] , ["BF567D","8C4D70","435C73","6FA8BF","539DA6"]],
  [["10"] , ["F2711B","B7C093","97A275"]],
  [["11"] , ["593E40","F2D5C4","F2785C","F2594B","A66F6F"]],
  [["12"] , ["D8E3CF","F0A36F","C5557B","4F2C62"]],
  [["13"] , ["1C2747","EC6508","1375BB","E9483B","D8DDE5"]],
  [["14"] , ["8C2354","F2CB05","F29F05","F27405"]],
  [["15"] , ["64C5F5","2484BF","4DA60D","2A5908"]],
  [["16"] , ["04ADBF","04BFBF","025959","A0A603"]],
  [["17"] , ["5B98A6","026873","32D9D9","0D0D0D"]],
  [["18"] , ["26261C","595843","A6A485","0D0D0D"]],
  [["19"] , ["3D5A73","4F6F8C","F2E2CE","F24130","8C0303"]],
  [["20"] , ["111440","144E73","1F80A6","469CA6","F2F2F2"]],
  [["21"] , ["26261C","595843","A6A485","0D0D0D"]],
  [["22"] , ["4C291E","FFB632","D2430C","872018"]],
  [["23"] , ["8AB0BF","61888C","17261E","3B593F","467339"]],
  [["24"] , ["592040","733462","2A708C","50ABBF","0D0D0D"]],
]
let colorarray = randomarray(colorsarray);
let colors = colorarray[1];
let colorsshuffle = shufflearr(colors);
let pointarray = [];
let pixeld = 3;
let bgc ;
let _noiseCounter = 9999;
let _noiseFloor = 0.1;
let _width = 2000;
let _height = 2800;
let _singleWidth = _singleHeight = rndint(15, 60);
let _singleWidthDiv = 1/_singleWidth;
let _minDist = rndint(_singleWidth*0.4, _singleWidth*1.8);
let _maxLen = rndint(_singleWidth*1.5, _singleWidth*4);
let _numColors = rndint(5, 15);
let colorsgrid = chroma.scale([colorsshuffle[0], colorsshuffle[1]]).mode('lch').colors(_numColors);
if(fxrand() > 0.95 ) {
  colorsgrid = chroma.scale([colorsshuffle[0], colorsshuffle[0]]).mode('lch').colors(_numColors);
}
let positiverand = rndint(1, 25);
let _noiseAmplitude = rndint(30, 200);
let _noiseCol = rndint(30, 80)/10000;
let _noisePos = rndint(1, 4)/1000;
let _fontSize = 60;
let border;

function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  font = loadFont('libraries/Despairs-X3Wxo.ttf');
}

function setup() {
  textFont(font);
  textSize(_fontSize);

  
  colorMode(HSB, 360, 100, 100, 100)
  // pixeld = 3;
  // console.log("pixelDensity: " + pixeld);
  pixelDensity(pixeld);
  angleMode(DEGREES);
  noLoop()
  noStroke()
  rectMode(CENTER);
  seed = int(fxrand()*9999999);
  noiseSeed(seed);
  drawcanvas = createCanvas(_width, _height);
  // drawcanvas.parent("fulllscreen");
  background('#f3f3e7');
  bgc =  chroma("#" + colorsshuffle[0]).darken(1).alpha(0.03).hex();
  fill(bgc);
  rect(_width/2, _height/2, _width, _height);
  border = rndint(150, 250)
  let _numX = Math.round((_width-border) / _singleWidth)
  let _numY = Math.round((_height-border) / _singleHeight)
  noiseSeed(seed+_noiseCounter)
  let colornoise = []
  let posx = [];
  let posy = [];
  for (var j = 0; j < _numY; j++) {
    for (var i = 0; i < _numX; i++) {
      posx.push((i*_singleWidth) + (noise(i*_noisePos, j*_noisePos)*_noiseAmplitude) + rndint(-positiverand, positiverand))
      posy.push((j*_singleHeight) + (noise(i*_noisePos, j*_noisePos)*_noiseAmplitude) + rndint(-positiverand, positiverand))
      colornoise.push(noise(i*_noiseCol, j*_noiseCol))
    }
  }

  let xstart = (_width-posx.max()-posx.min())/2
  let ystart = (_height-posy.max()-posy.min())/2
  let idp = 0;
  for (var j = 0; j < _numY; j++) {
    for (var i = 0; i < _numX; i++) {
      pointarray.push(
        [
          xstart + posx[idp],
          ystart + posy[idp], 
          idp,
          Math.round(map(noise(i*_noiseCol, j*_noiseCol), _noiseFloor, 1, 1, 100)),
          Math.round(map(colornoise[idp], colornoise.min(), colornoise.max(), 0, _numColors-1)) 
        ]
      );
      idp++
    }
  }
}

function draw() {  
  ww = width / 2;
  hh = height / 2;
  blendMode(MULTIPLY )
  let y_min = height;
  let id_y_min = pointarray.length-1;
  for(let idp = 0; idp < pointarray.length; idp++) {
    let v1 = createVector(pointarray[idp][0], pointarray[idp][1]);
    if (v1.y < y_min){y_min = v1.y;id_y_min=idp;}
    for(let idpp = 0; idpp < pointarray.length; idpp++) {
      if(fxrand() > _noiseFloor) {
        if(pointarray[idp][2] != pointarray[idpp][2] && pointarray[idp][3] == pointarray[idpp][3]) {
          if( fxrand() > _singleWidthDiv ) {
            let v2 = createVector(pointarray[idpp][0], pointarray[idpp][1]);
            let dist = v1.dist(v2);
            if(dist > _minDist && dist < _minDist+_maxLen && v1.y > 1.5*border ) {
              strokeWeight(rndint(_singleWidth/2, _singleWidth)/40);
              stroke(chroma(colorsgrid[pointarray[idp][4]]).alpha(rndint(5, 8)/10).hex())
              line(v1.x,v1.y, v2.x, v2.y);
            }
          }
        }
      }
    }
  }
  push();
  let write_col = chroma(colorsgrid[pointarray[id_y_min][4]]).alpha(rndint(5, 8)/10).hex();
  fill(write_col);
  textAlign(CENTER, BOTTOM);
  text(stringSeed.split("").join(" "), width/2,border/2);
  pop();
  save(stringSeed+'.png');
  console.log("done")
}
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

function rndint(min, max) {
  return Math.floor(fxrand() * (max - min + 1) + min)
}
function randomarray(inputarray) {
  return inputarray[Math.floor(fxrand()*inputarray.length)];
}
function shufflearr(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(fxrand() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
// function exportPNG() {
//   saveCanvas(fxhash + '_intertwine', "png");
// }
// function keyReleased() {
//     if (key == 's' || key == 'S' || key == 'e' || key == 'E') exportPNG();
// }
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
