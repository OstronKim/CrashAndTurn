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
    image(this.animationSeq[index], this.position.x, this.position.y);
    this.index += this.speed;
  }

  //Denna funktion behöver utvecklas med ytterligare checks som kan hantera obstacles som overlappar
  intersect(obstacleArr) {
    let x_intersect = false;
    let y_intersect = false;

    for (let i = 0; i < obstacleArr.length; i++) {
      if (
        this.position.x >= obstacleArr[i].x &&
        this.position.x <= obstacleArr[i].x + obstacleArr[i].w &&
        this.position.y >= obstacleArr[i].y &&
        this.position.y <= obstacleArr[i].y + obstacleArr[i].h
      ) {
        x_intersect = true;
        y_intersect = true;
      }

      if (x_intersect && y_intersect) {
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

    console.log(directionMode);

    let nextPos = createVector(this.position.x, this.position.y);
    nextPos.add(direction);

    let aTemp = new avatar(nextPos.x, nextPos.y, images);

    let intersected = aTemp.intersect(obstacleArr);

    if (!intersected) {
      //Can advance in a straight line towards endpoint
      hasChangedDir = false;
      return direction;
    } else if (directionMode == 0) {
      //Random direction
      if (hasChangedDir == false) {
        this.rand = Math.random();
        hasChangedDir = true;
      }
      if (aTemp.moveDirection == 0) {
        //Horizontal
        if (this.rand <= 0) {
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
      //prefer initial trajectory
      if (aTemp.moveDirection == 0) {
        //Horizontal
        let leftVector = createVector(-1, 0);
        let rightVector = createVector(1, 0);

        //left
        if (
          direction.angleBetween(leftVector) <
          direction.angleBetween(rightVector)
        ) {
          //console.log("Moving avatar horizontally")
          direction.set(-1, 0);
          return direction;
        } else {
          //right
          //console.log("Moving avatar horizontally")
          direction.set(1, 0);
          return direction;
        }
      }
      if (aTemp.moveDirection == 1) {
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

