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

let prevDirection;

let collide;
let objectID;
let step;

function preload() {
  for (let i = 0; i < 10; i++) {
    images[i] = loadImage("assets/zombie/male/Walk(" + (i + 1) + ").png");
  }
}

function setup() {
  canvas = createCanvas(700, 700);
  canvas.position(610, 120); //adjusted for 1920x1080 chrome maximised
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
  directionRadio.option(0, "Random");
  directionRadio.option(1, "Trajectory").checked = true;

  hasChangedDir = false;
  speed = 0.3;
  index = 0;
  prevDirection = createVector(0, 0);
  step = createVector(0, 0);

  collide = false;
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
    //Testa intersect
    if (collide == true) {
      //dest = moveTo(objectID);
      a1.position.add(step);
      if (abs(a1.position.x - dest.x) < 1 && abs(a1.position.y - dest.y) < 1) {
        //vi har rört oss till positionen (I x led just nu)
        collide = false;
      }
    } else {
      let direction = createVector(
        endPos[0] - a1.position.x,
        endPos[1] - a1.position.y
      );
      direction.normalize();
      let nextPos = createVector(a1.position.x, a1.position.y);
      nextPos.add(direction);
      //console.log(nextPos);

      let aTemp = new avatar(nextPos.x, nextPos.y, images);
      collide = aTemp.intersect(obstacleArray);
      if (!collide) {
        a1.position.add(direction);
      } else {
        dest = moveTo(objectID, aTemp.moveDirection);
      }
    }

    //console.log("from main: " + prevDirection);
    // a1.position.add(a1.crash_and_turn(obstacleArray, directionMode));
    // prevDirection = a1.crash_and_turn(obstacleArray, directionMode);

    stroke("purple"); // Change the color
    strokeWeight(10); // Make the points 10 pixels in
    point(a1.position.x, a1.position.y);
    a1.show();
    noStroke();
    done = false;
  } else {
    done = true;
  }

  function moveTo(objectID, moveDirection) {
    let direction = createVector(
      endPos[0] - a1.position.x,
      endPos[1] - a1.position.y
    );

    if (moveDirection == 0) {
      //code for diagonal crash (horizontal). First crash
      if (direction.x > 0 && direction.y > 0) {
        //diagonal from left top --> go right
        step.set(1, 0);
        dest = createVector(
          obstacleArray[objectID].x + obstacleArray[objectID].w + 5,
          a1.position.y
        );
      } else if (direction.x <= 0 && direction.y > 0) {
        //diagonal from right top--> go left
        step.set(-1, 0);
        dest = createVector(obstacleArray[objectID].x - 5, a1.position.y);
      } else if (direction.x < 0 && direction.y < 0) {
        //diagonal from right bottom --> go left
        dest = createVector(obstacleArray[objectID].x - 5, a1.position.y);
        step.set(-1, 0);
      } else {
        //diagonal from left bottom --> go right
        dest = createVector(
          obstacleArray[objectID].x + obstacleArray[objectID].w + 5,
          a1.position.y
        );
        step.set(1, 0);
      }
    } else {
      //code for diagonal crash (vertical). First crash
      if (direction.x > 0 && direction.y > 0) {
        //diagonal from left top --> go down
        step.set(0, 1);
        dest = createVector(
          a1.position.x,
          obstacleArray[objectID].y + obstacleArray[objectID].h + 5
        );
      } else if (direction.x <= 0 && direction.y > 0) {
        //diagonal from right top--> go down
        step.set(0, 1);
        dest = createVector(
          a1.position.x,
          obstacleArray[objectID].y + obstacleArray[objectID].h + 5
        );
      } else if (direction.x < 0 && direction.y < 0) {
        //diagonal from right bottom --> go up
        dest = createVector(a1.position.x, obstacleArray[objectID].y - 5);
        step.set(0, -1);
      } else {
        //diagonal from left bottom --> go up
        dest = createVector(a1.position.x, obstacleArray[objectID].y - 5);
        step.set(0, -1);
      }
    }

    return dest;
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

function mapH() {
  //Test map for horizontal troubleshooting
  let obstacle1 = new obstacle(120, 70, 150, 76);

  let wallTop = new obstacle(0, 1, 700, 2);
  let wallRight = new obstacle(698, 0, 2, 700);
  let wallBottom = new obstacle(1, 698, 700, 2);
  let wallLeft = new obstacle(1, 0, 2, 700);

  let obstacleArray = [obstacle1, wallTop, wallRight, wallBottom, wallLeft];

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
