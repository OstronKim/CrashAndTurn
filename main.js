var canvas;
var startpt;
var endpt;
var position;
var endPos;

let done;
let posVec;
let dest;

let obstacleArray;

let a1;
let hasChangedDir;

let images = [];
let lastDestinations = [];

let index;
let speed;

let prevDirection;

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
}

function setup() {
  canvas = createCanvas(700, 700, WEBGL);
  canvas.position(610, 120); //adjusted for 1920x1080 chrome maximised
  bgcolor = color(138, 138, 138);
  background(bgcolor);

  soundtrack.play();

  startStop();

  position = [380, 330];
  endPos = createVector(600, 600);

  for (let i = 0; i < images.length; i++) {
    images[i].resize(30, 0);
  }
  brainIMG.resize(50, 0);

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
  //background("white");
  soundtrack.setVolume(0.05);

  if (done) {
    text("Goal reached!", 400, 500, 200, 200);
    noLoop();
  }

  //Define end point
  stroke("green"); // Change the color
  strokeWeight(10); // Make the points 10 pixels in
  //endpt = point(400, 80);
  endpt = point(mouseX, mouseY);

  //endPos = [400, 70];
  endPos.set(mouseX, mouseY);
  image(brainIMG, endPos.x - 15, endPos.y - 15);
  //cursor(brainIMG, 16, 16);
  //cursor("https://avatars0.githubusercontent.com/u/1617169?s=16");

  obstacleArray.forEach((element) => element.draw());

  let directionMode = directionRadio.value();

  //Keep moving while not on end point
  if (
    !(abs(a1.position.x - endPos.x) < 1 && abs(a1.position.y - endPos.y) < 1)
  ) {
    //Testa intersect
    if (collide == true) {
      a1.position.add(step);
      if (abs(a1.position.x - dest.x) < 1 && abs(a1.position.y - dest.y) < 1) {
        //vi har rört oss till positionen
        collide = false;
        randomDir = false;
        randomDestReached = true;
      }
    } else {
      let unique = [];
      for (let i = 0; i < lastDestinations.length; i++) {
        let sum = lastDestinations[i].x + lastDestinations[i].y;
        unique[i] = floor(sum);
      }
      unique = [...new Set(unique)];
      //Check if stuck
      if (lastDestinations.length == 5 && unique.length <= 2 && !randomDir) {
        randomDir = true;
        randomDestReached = false;
        randomDest = createVector(
          -(endPos.x - a1.position.x),
          -(endPos.y - a1.position.y)
        );
        randomDest.normalize();
        //console.log("short randomDest vector: " + randomDest);
        randomDest.x *= 200;
        randomDest.y *= 200;
        //console.log("randomDest vector: " + randomDest);
        dest.x = a1.position.x + randomDest.x;
        dest.y = a1.position.y + randomDest.y;
        //console.log("Dest: " + dest);
        //dest.set(85, 80);
        lastDestinations = [];
      }

      let direction;
      if (randomDir) {
        direction = createVector(
          dest.x - a1.position.x,
          dest.y - a1.position.y
        );
      } else {
        direction = createVector(
          endPos.x - a1.position.x,
          endPos.y - a1.position.y
        );
      }

      direction.normalize();
      let nextPos = createVector(a1.position.x, a1.position.y);
      nextPos.add(direction);
      //console.log(nextPos);

      let aTemp = new avatar(nextPos.x, nextPos.y, images);
      collide = aTemp.intersect(obstacleArray);
      if (!collide) {
        if (
          abs(a1.position.x - dest.x) < 1 &&
          abs(a1.position.y - dest.y) < 1
        ) {
          randomDir = false;
        }
        a1.position.add(direction);
      } else {
        //Check if it has reached the random destination
        randomDir = false;
        dest = moveTo(objectID, aTemp.moveDirection, endPos);
      }
    }

    stroke("purple"); // Change the color
    strokeWeight(10); // Make the points 10 pixels in
    point(a1.position.x, a1.position.y);

    stroke("blue"); // Change the color
    strokeWeight(10); // Make the points 10  in
    point(dest.x, dest.y);

    a1.show();
    noStroke();
    done = false;
  } else {
    done = true;
  }

  function moveTo(objectID, moveDirection, destination) {
    let direction = createVector(
      destination.x - a1.position.x,
      destination.y - a1.position.y
    );

    if (moveDirection == 0) {
      //code for diagonal crash (horizontal). First crash
      if (direction.x > 0 && direction.y > 0) {
        //diagonal from left top --> go right
        dest = createVector(
          obstacleArray[objectID].x + obstacleArray[objectID].w + offsetX,
          a1.position.y - offsetY
        );
        let tempAvatar = new avatar(dest.x, dest.y, images);
        if (tempAvatar.intersect(obstacleArray)) {
          //moveTo dest is blocked
          dest = createVector(
            obstacleArray[objectID].x + obstacleArray[objectID].w - offsetX,
            a1.position.y - offsetY
          );
        }
        let v = createVector(dest.x - a1.position.x, dest.y - a1.position.y);
        v.normalize();
        step.set(v.x, v.y);
      } else if (direction.x <= 0 && direction.y > 0) {
        //diagonal from right top--> go left
        //step.set(-1, 0);
        //dest = createVector(obstacleArray[objectID].x - 5, a1.position.y);

        dest = createVector(
          obstacleArray[objectID].x - offsetX,
          a1.position.y - offsetY
        );
        let tempAvatar = new avatar(dest.x, dest.y, images);
        if (tempAvatar.intersect(obstacleArray)) {
          //moveTo dest is blocked
          dest = createVector(
            obstacleArray[objectID].x + offsetX,
            a1.position.y - offsetY
          );
        }
        let v = createVector(dest.x - a1.position.x, dest.y - a1.position.y);
        v.normalize();
        step.set(v.x, v.y);
      } else if (direction.x < 0 && direction.y < 0) {
        //diagonal from right bottom --> go left
        dest = createVector(
          obstacleArray[objectID].x - offsetX,
          a1.position.y + offsetY
        );

        let tempAvatar = new avatar(dest.x, dest.y, images);
        if (tempAvatar.intersect(obstacleArray)) {
          //moveTo dest is blocked
          dest = createVector(
            obstacleArray[objectID].x + offsetX,
            a1.position.y + offsetY
          );
        }
        let v = createVector(dest.x - a1.position.x, dest.y - a1.position.y);
        v.normalize();
        step.set(v.x, v.y);
      } else {
        //diagonal from left bottom --> go right
        dest = createVector(
          obstacleArray[objectID].x + obstacleArray[objectID].w + offsetX,
          a1.position.y + 5
        );

        let tempAvatar = new avatar(dest.x, dest.y, images);
        if (tempAvatar.intersect(obstacleArray)) {
          //moveTo dest is blocked
          dest = createVector(
            obstacleArray[objectID].x + obstacleArray[objectID].w - offsetX,
            a1.position.y + offsetY
          );
        }
        let v = createVector(dest.x - a1.position.x, dest.y - a1.position.y);
        v.normalize();
        step.set(v.x, v.y);
      }
    } else {
      //code for diagonal crash (vertical). First crash
      if (direction.x > 0 && direction.y > 0) {
        //diagonal from left top --> go down
        //calcDest(objectID, -5, 5);
        //step.set(0, 1);
        dest = createVector(
          a1.position.x - offsetX,
          obstacleArray[objectID].y + obstacleArray[objectID].h + offsetY
        );
        //Check if dest is blocked
        let tempAvatar = new avatar(dest.x, dest.y, images);
        if (tempAvatar.intersect(obstacleArray)) {
          dest = createVector(
            obstacleArray[objectID].x - offsetX,
            obstacleArray[objectID].y + obstacleArray[objectID].h - offsetY
          );
        }

        let v = createVector(dest.x - a1.position.x, dest.y - a1.position.y);
        v.normalize();
        step.set(v.x, v.y);
      } else if (direction.x <= 0 && direction.y > 0) {
        //diagonal from right top--> go down
        dest = createVector(
          a1.position.x + 5,
          obstacleArray[objectID].y + obstacleArray[objectID].h + offsetY
        );
        let tempAvatar = new avatar(dest.x, dest.y, images);
        if (tempAvatar.intersect(obstacleArray)) {
          //moveTo dest is blocked
          dest = createVector(
            a1.position.x + offsetX,
            obstacleArray[objectID].y + obstacleArray[objectID].h - offsetY
          );
        }
        let v = createVector(dest.x - a1.position.x, dest.y - a1.position.y);
        v.normalize();
        step.set(v.x, v.y);
      } else if (direction.x < 0 && direction.y < 0) {
        //diagonal from right bottom --> go up
        dest = createVector(
          a1.position.x + offsetX,
          obstacleArray[objectID].y - offsetY
        );

        let tempAvatar = new avatar(dest.x, dest.y, images);
        if (tempAvatar.intersect(obstacleArray)) {
          //moveTo dest is blocked
          dest = createVector(
            a1.position.x + offsetX,
            obstacleArray[objectID].y + offsetY
          );
        }
        let v = createVector(dest.x - a1.position.x, dest.y - a1.position.y);
        v.normalize();
        step.set(v.x, v.y);
      } else {
        //diagonal from left bottom --> go up
        dest = createVector(
          a1.position.x - offsetX,
          obstacleArray[objectID].y - offsetY
        );

        //Check if dest is blocked
        let tempAvatar = new avatar(dest.x, dest.y, images);
        if (tempAvatar.intersect(obstacleArray)) {
          dest = createVector(
            a1.position.x - offsetX,
            obstacleArray[objectID].y + offsetY
          );
        }
        let v = createVector(dest.x - a1.position.x, dest.y - a1.position.y);
        v.normalize();
        step.set(v.x, v.y);
      }
    }
    //unshift, pushes item to front of array
    lastDestinations.unshift(dest);
    if (lastDestinations.length > 5) {
      lastDestinations.pop();
    }
    //console.log(lastDestinations);
    return dest;
  }
  //not in use, too many different cases
  // function calcDest(objectID, offsetX, offsetY) {
  //   dest = createVector(
  //     a1.position.x + offsetX,
  //     obstacleArray[objectID].y + obstacleArray[objectID].h + offsetY
  //   );
  //   let v = createVector(dest.x - a1.position.x, dest.y - a1.position.y);
  //   v.normalize();
  //   step.set(v.x, v.y);
  //   //Check if dest is blocked
  //   let tempAvatar = new avatar(dest.x, dest.y, images);
  //   if (tempAvatar.intersect(obstacleArray)) {
  //     dest = createVector(
  //       obstacleArray[objectID].x + offsetX,
  //       obstacleArray[objectID].y + obstacleArray[objectID].h + offsetY
  //     );
  //   }
  // }

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

function mapConcave() {
  //Test map for horizontal troubleshooting
  let obstacle1 = new obstacle(320, 400, 75, 20);
  let obstacle2 = new obstacle(395, 310, 25, 90);
  let obstacle3 = new obstacle(320, 290, 75, 20);

  let wallTop = new obstacle(0, 1, 700, 2);
  let wallRight = new obstacle(698, 0, 2, 700);
  let wallBottom = new obstacle(1, 698, 700, 2);
  let wallLeft = new obstacle(1, 0, 2, 700);

  let obstacleArray = [
    obstacle1,
    obstacle2,
    obstacle3,
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
