let hitWall;

class avatar {
  //Avatar has position which is vector pos with direction
  constructor(x, y, animationSeq) {
    this.position = createVector(x, y);
    this.rand = 0;
    this.moveDirection = 0; // 0=horizantal, 1=vertical
    this.animationSeq = animationSeq;
    this.speed = 1;
    this.index = 0;
  }

  show() {
    let index = floor(this.index) % this.animationSeq.length;
    image(this.animationSeq[index], this.position.x - 15, this.position.y - 25); //further up in y to mimic 2.5d
    this.index += this.speed;
  }

  // hasHitWall() {
  //   if(hitWall == true){
  //     return true;
  //   }
  //     return false;
  // }

  //Denna funktion behöver utvecklas med ytterligare checks som kan hantera obstacles som overlappar
  intersect(obstacleArr) {
    let intersecting = false;
    wallIsHit = false;
    objectID = 0;

    //Maybe use collideRectRect()
    for (let i = 0; i < obstacleArr.length; i++) {
      if (
        this.position.x >= obstacleArr[i].x &&
        this.position.x <= obstacleArr[i].x + obstacleArr[i].w &&
        this.position.y >= obstacleArr[i].y &&
        this.position.y <= obstacleArr[i].y + obstacleArr[i].h
      ) {
        //console.log("i = " + i + "lenght = "  + (obstacleArr.length - 4))
        if(i >= (obstacleArr.length - 4)) {//last 4 are walls
          setTrue();
          console.log("we hit a wall")
        }
        intersecting = true;
        objectID = i;
      }
      // intersecting = collidePointRect(this.position.x, this.position.y,
      //   obstacleArr[i].x, obstacleArr[i].y, obstacleArr[i].w, obstacleArr[i].h);

      if (intersecting == true) {
        if (this.position.x <= obstacleArr[i].x + 1) {
          //Vertical left
          //console.log("Vertical left")
          this.moveDirection = 1;
        } else if (this.position.x >= obstacleArr[i].x + obstacleArr[i].w - 2) {
          //console.log("Vertical right")*
          this.moveDirection = 1;
        } else {
          //Move horizontal
          //console.log("Horizontal");
          this.moveDirection = 0;
        }
        return true;
      }
    }

    return false;
  }

  crash_and_turn(obstacleArr, directionMode) {
    let mode = 1; //mode 0 = random, 1 = based on initial trajectory

    let direction = createVector(
      endPos[0] - this.position.x,
      endPos[1] - this.position.y
    );
    direction.normalize();

    let nextPos = createVector(this.position.x, this.position.y);
    nextPos.add(direction);

    let aTemp = new avatar(nextPos.x, nextPos.y, images);

    let intersected = aTemp.intersect(obstacleArr);

    //If not intersecting->move towards point
    //

    if (!intersected) {
      //Can advance in a straight line towards endpoint
      console.log("Can advance in straight line");
      hasChangedDir = false;
      return direction;
    } else if (directionMode == 0) {
      //Random direction, currently not fleshed out
      if (hasChangedDir == false) {
        this.rand = Math.random();
        hasChangedDir = true;
      }
      if (aTemp.moveDirection == 0) {
        //Horizontal,
        if (this.rand <= 0.5) {
          //left
          direction.set(-1, 0);
          return direction;
        } else {
          //right
          direction.set(1, 0);
          return direction;
        }
      }
      if (aTemp.moveDirection == 1) {
        //Vertical
        if (this.rand <= 0.5) {
          //down
          //console.log("Moving avatar vertically")
          direction.set(0, 1);
          return direction;
        } else {
          //console.log("Moving avatar vertically")
          direction.set(0, -1);
          return direction;
        }
      }
    } else {
      console.log("Intersecting");
      //prefer initial trajectory
      if (aTemp.moveDirection == 0) {
        //Horizontal
        let leftVector = createVector(-1, 0);
        let rightVector = createVector(1, 0);

        //code for avatar already moving alongisde an object
        if (prevDirection.x == 1 && prevDirection.y == 0) {
          //(1,0)
          direction.set(1, 0);
          //console.log("Avatar is moving alongside an object already")
          return direction;
        } else if (prevDirection.x == -1 && prevDirection.y == 0) {
          //(-1,0)
          direction.set(-1, 0);
          //console.log("Avatar is moving alongside an object already")
          return direction;
        } else {
          //code for diagonal crash (horizontal). First crash
          if (direction.x > 0 && direction.y > 0) {
            //diagonal from left top --> go right
            direction.set(1, 0);
            //console.log("diagonal from left top")
            return direction;
          } else if (direction.x <= 0 && direction.y > 0) {
            //diagonal from right top--> go left
            direction.set(-1, 0);
            //console.log("diagonal from right top")
            return direction;
          } else if (direction.x < 0 && direction.y < 0) {
            //diagonal from right bottom --> go left
            direction.set(-1, 0);
            //console.log("diagonal from right bottom")
            return direction;
          } else {
            //diagonal from left bottom --> go right
            //console.log("diagonal from left bottom")
            direction.set(1, 0);
            return direction;
          }
        }
      }
      if (aTemp.moveDirection == 1) {
        console.log("Moving vertically");
        //Vertical
        let upVector = createVector(0, -1);
        let downVector = createVector(0, 1);
        if (
          direction.angleBetween(downVector) < direction.angleBetween(upVector)
        ) {
          //down
          //console.log("Moving avatar vertically")
          direction.set(0, 1);
          return direction;
        } else {
          //console.log("Moving avatar vertically")
          direction.set(0, -1);
          return direction;
        }
      }
    }
  }
}



//for vertical
// else if(((direction.x > -0.1 && direction.x < 0.1) && (direction.y > 0.99 && direction.y < 1.01))) { //(0,1)
//   direction.set(0, 1)
//   console.log("Avatar is moving alongside an object already")
//   return direction;
// }
// else if(((direction.x > -0.1 && direction.x < 0.1) && (direction.y > -1.01 && direction.y < -0.99))) { //(0,-1)
//   direction.set(0, 1)
//   console.log("Avatar is moving alongside an object already")
//   return direction;
// }
