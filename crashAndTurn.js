function crashAndTurn() {
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

        randomDest.x *= 200;
        randomDest.y *= 200;

        dest.x = a1.position.x + randomDest.x;
        dest.y = a1.position.y + randomDest.y;
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

      //Check if zombie hits walls, return to chase player
      if (
        nextPos.x - 5 < 0 ||
        nextPos.x + 5 > width ||
        nextPos.y - 5 < 0 ||
        nextPos.y + 5 > height
      ) {
        direction.x = width / 2 - a1.position.x;
        direction.y = height / 2 - a1.position.y;
        direction.normalize();
        direction *= 10;
        nextPos.add(direction);
      }

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
    a1.show();
    noStroke();
    done = false;
  } else {
    done = true;
  }
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
  return dest;
}
