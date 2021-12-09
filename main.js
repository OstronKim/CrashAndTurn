//Authors: Arvid magnusson, arvma, Viktor Sjögren, viksj950
//Date: 2021-12-08
//Implementation of crash and turn algorithm in p5.js for the course TSBK03

//Globals
var canvas;
var startpt;
var endpt;
var position;
var endPos;

let done;
let dest;
let hasChangedDir;

let a1;

let images = [];
let lastDestinations = [];
let obstacleArray;

let collide;
let objectID;
let step;

let randomDir;
let randomPos;
let randomDest;
let randomDestReached = true;

let brainIMG;
let background1;
let obstacleIMG;

let soundtrack;
let soundRadio;
let font;

let offsetX, offsetY;

function preload() {
  for (let i = 0; i < 10; i++) {
    images[i] = loadImage("assets/zombie/male/Walk(" + (i + 1) + ").png");
  }
  brainIMG = loadImage("assets/brain.png");
  background1 = loadImage("assets/background1.png");
  obstacleIMG = loadImage("assets/stone.png");

  //audio
  soundtrack = loadSound("assets/8bitBanger.mp3");

  font = loadFont("assets/upheavtt.ttf");
}

function setup() {
  canvas = createCanvas(700, 700, WEBGL);
  canvas.position(610, 120); //adjusted for 1920x1080 chrome maximised
  bgcolor = color(138, 138, 138);
  background(bgcolor);

  startStop();

  //startpos for zombie, and player
  position = [380, 330];
  endPos = createVector(600, 600);

  for (let i = 0; i < images.length; i++) {
    images[i].resize(30, 0);
  }
  brainIMG.resize(50, 0);

  a1 = new avatar(position[0], position[1], images);

  obstacleArray = map2();

  soundRadio = createRadio();
  soundRadio.option(0, "Sound");
  soundRadio.option(1, "No sound").checked = true;

  hasChangedDir = false;
  speed = 0.3;
  index = 0;

  step = createVector(0, 0);
  dest = createVector(0, 0);
  randomDest = 0;
  offsetX = 15;
  offsetY = 15;

  collide = false;
  frameRate(60);
  noCursor();
}

function draw() {
  translate(-width / 2, -height / 2);
  background(bgcolor);
  if (soundRadio.value() == 0) {
    if (!soundtrack.isPlaying()) {
      soundtrack.play();
      soundtrack.setVolume(0.03);
    }
  } else {
    soundtrack.stop();
  }

  endpt = point(mouseX, mouseY);

  endPos.set(mouseX, mouseY);
  image(brainIMG, endPos.x - 15, endPos.y - 15);

  obstacleArray.forEach((element) => element.draw());

  crashAndTurn();

  if (done) {
    textFont(font);
    textSize(76);
    fill("red");
    text("Game Over", 170, 324, 700, 400);
    noLoop();
  }
}

function startStop() {
  noLoop();
  var button = createButton("Start");
  var button2 = createButton("Stop");

  button.mousePressed(startSketch);

  button2.mousePressed(stopSketch);

  function stopSketch() {
    noLoop();
  }

  function startSketch() {
    loop();
  }
}
