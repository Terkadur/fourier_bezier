function Sloider(x, y, w, l, h, val, col1, col2) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.l = l;
  this.h = h;
  this.val = val;
  this.pos = map(this.val, 1, 100, this.x, this.x + this.w); //converts the value to the x position of the slider piece
  this.col1 = col1;
  this.col2 = col2;
  this.state = false;

  this.show = function() {
    stroke(255);
    line(this.x, this.y, this.x + this.w, this.y);
    if (!this.state) {
      fill(this.col1);
    } else {
      fill(this.col2);
    }
    stroke(0, 0, 0, 0);
    rect(this.pos - this.l/2, this.y - this.h/2, this.l, this.h);
  }
}