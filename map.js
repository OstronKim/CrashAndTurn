function map1() {
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
  //Generic "kind" map, works well
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
  //Test map for concave construction
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
