function Button(x, y, w, h, txt, col1, col2) { //class for the buttons
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.txt = txt;
  this.col1 = col1; //color for the "false" state
  this.col2 = col2; //color for the "true" state
  this.state = false;

  this.show = function() {
    if (!this.state) {
      fill(this.col1);
    } else {
      fill(this.col2);
    }
    
    stroke(0, 0, 0, 0);
    rect(this.x, this.y, this.w, this.h);

    textAlign(CENTER, CENTER);
    textSize(0.0125*width);
    fill(255);
    text(this.txt, this.x + this.w/2, this.y + this.h/2);
  }
}