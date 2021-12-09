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
    image(this.animationSeq[index], this.position.x - 15, this.position.y - 25);
    this.index += this.speed;
  }

  intersect(obstacleArr) {
    let intersecting = false;
    objectID = 0;

    for (let i = 0; i < obstacleArr.length; i++) {
      if (
        this.position.x >= obstacleArr[i].x &&
        this.position.x <= obstacleArr[i].x + obstacleArr[i].w &&
        this.position.y >= obstacleArr[i].y &&
        this.position.y <= obstacleArr[i].y + obstacleArr[i].h
      ) {
        intersecting = true;
        objectID = i;
      }

      if (intersecting == true) {
        if (this.position.x <= obstacleArr[i].x + 1) {
          //Vertical left
          this.moveDirection = 1;
        } else if (this.position.x >= obstacleArr[i].x + obstacleArr[i].w - 2) {
          this.moveDirection = 1;
        } else {
          //Move horizontal
          this.moveDirection = 0;
        }
        return true;
      }
    }

    return false;
  }
}
