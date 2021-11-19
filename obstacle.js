class obstacle {
  //start pos x,y with widht and height
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw() {
    stroke("red"); // Change the color
    strokeWeight(2); // Make the points 10 pixels in
    rect(this.x, this.y, this.w, this.h);
  }
}
