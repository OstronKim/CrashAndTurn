var canvas;
var startpt;
var endpt;
var position;
var endPos;

let done;
let posVec;

let obstacleArray;

let a1;
let hasChangedDir;

let images = [];

let index;
let speed;

function preload() {
  for (let i = 0; i < 10; i++) {
    images[i] = loadImage("assets/zombie/male/Walk(" + (i + 1) + ").png");
  }
}

function setup() {
  canvas = createCanvas(700, 700);
  canvas.position(610,120); //adjusted for 1920x1080 chrome maximised
  bgcolor = color("white");
  background(bgcolor);

  startStop();

  position = [80, 30];
  endPos = [600, 600];

  for (let i = 0; i < images.length; i++) {
    images[i].resize(30, 0);
  }

  a1 = new avatar(position[0], position[1], images);

  obstacleArray = map2();

  
  directionRadio = createRadio();
  directionRadio.option(0, "Random").checked = true;
  directionRadio.option(1, "Trajectory");

  hasChangedDir = false;
  speed = 0.3;
  index = 0;
  frameRate(60);
}

function draw() {
  background("white");

  if (done) {
    text("Goal reached!", 400, 500, 200, 200);
    noLoop();
  }

  //Define end point
  stroke("purple"); // Change the color
  strokeWeight(10); // Make the points 10 pixels in
  endpt = point(mouseX, mouseY);

  endPos = [mouseX, mouseY];

  obstacleArray.forEach((element) => element.draw());

  let directionMode = directionRadio.value();

  //Keep moving while not on end point
  if (
    !(abs(a1.position.x - endPos[0]) < 1 && abs(a1.position.y - endPos[1]) < 1)
  ) {
    a1.position.add(a1.crash_and_turn(obstacleArray, directionMode));
    stroke("purple"); // Change the color
    strokeWeight(10); // Make the points 10 pixels in
    point(a1.position.x, a1.position.y);
    //a1.show();
    noStroke();
    //text(a1.position.toString(), 100, 5, 400, 75);
    //fill(255, 255, 255);
    done = false;
  } else {
    done = true;
  }

  //animate
  // let xOffset = 20;
  // let yOffset = 20;
  // if (index < images.length) {
  //   let roundIndex = floor(index % images.length);
  //   image(images[roundIndex], a1.position.x - xOffset, a1.position.y - yOffset);
  //   index += speed;
  // } else {
  //   index = 0;
  //   image(images[0], a1.position.x - xOffset, a1.position.y - yOffset);
  //   index += speed;
  // }
}

//Ide till en "smartare" agent
// - Hela tiden beräkna avståndet till slutpunkt
// - Ha en itererande timer som kollar ifall agenten under de senaste x sekunderna har kommit närmare målet
// - Om inte, randomiza åt något diagonalt håll för att försöka ett håll agenten inte provat.
// - Hårdkoda någon toleranstid som ifall den uppnås, agenten identifierar världen som omöjlig att nå målet i. typ(60 sek)

function map1() {
  //Convex construction. Fails horribly
  let obstacle1 = new obstacle(100, 70, 20, 100);
  let obstacle2 = new obstacle(220, 100, 30, 100);
  let obstacle3 = new obstacle(120, 160, 100, 20); //bottom panel
  let obstacle4 = new obstacle(200, 61, 200, 41); //Big horizontla block

  let wallTop = new obstacle(0, 1, 700, 2);
  let wallRight = new obstacle(698, 0, 2, 700);
  let wallBottom = new obstacle(1, 698, 700, 2);
  let wallLeft = new obstacle(1, 0, 2, 700);

  let obstacleArray = [
    obstacle2,
    obstacle1,
    obstacle4,
    obstacle3,
    wallTop,
    wallRight,
    wallBottom,
    wallLeft,
  ];

  return obstacleArray;
}

function map2() {
  let obstacle1 = new obstacle(100, 70, 20, 100);
  let obstacle2 = new obstacle(320, 100, 30, 100);
  let obstacle3 = new obstacle(420, 360, 100, 20);
  let obstacle4 = new obstacle(500, 461, 150, 41);
  let obstacle5 = new obstacle(50, 461, 60, 65);
  let obstacle6 = new obstacle(230, 240, 100, 100);

  let wallTop = new obstacle(0, 1, 700, 2);
  let wallRight = new obstacle(698, 0, 2, 700);
  let wallBottom = new obstacle(1, 698, 700, 2);
  let wallLeft = new obstacle(1, 0, 2, 700);

  let obstacleArray = [
    obstacle1,
    obstacle2,
    obstacle3,
    obstacle4,
    obstacle5,
    obstacle6,
    wallTop,
    wallRight,
    wallBottom,
    wallLeft,
  ];

  return obstacleArray;
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
//Easy map
// obstacle1 = new obstacle(70, 70, 100, 100);
// obstacle2 = new obstacle(300, 250, 30, 100);
// obstacle3 = new obstacle(400, 450, 100, 20);
// obstacle4 = new obstacle(425, 520, 200, 40);
