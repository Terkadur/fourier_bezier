let fr = 50; //framerate
let cpt = 5; //calculations per tick (frame)
let c_n = {}; //lists coefficients
let chosen_func = step; //what function to draw
// let other_func = drawn; //for toggling functions
let prev_coord = false; //the previous coordinate (for drawing lines between points)
let t = 0; //time in the fourier drawing (full cycle ranges from 0 to 1)
let prev_mouse = false; //previous mouse coordinate to draw
let drawing; //graphics layer for sketch
let epicycles; //graphics layer for epicycles
let sketcher;
let panel;
let path = munif; //list of coordinates for drawing
let max_n = 5; //maximum value for n (corresponds to number of terms)
let download_button;
let n_sloider;
let alph_sloider;
let cpt_sloider;

function setup() {
  let width1 = windowWidth;
  let width2 = (windowHeight - 4)/0.4;
  createCanvas(min(width1, width2), 0.4*min(width1, width2));
  frameRate(fr);

  drawing = createGraphics(0.4*width, height);
  epicycles = createGraphics(0.4*width, height);
  sketcher = createGraphics(0.4*width, height);
  panel = createGraphics(0.2*width, height);

  download_button = new Button(0.825*width, 0.6*height, 0.15*width, 0.1*height, "Download path", color(128), color(96));

  n_sloider = new Sloider(0.825*width, 0.16*height, 0.15*width, 0.01*width, 0.05*height, 5, color(128), color(96));
  alph_sloider = new Sloider(0.825*width, 0.32*height, 0.15*width, 0.01*width, 0.05*height, 50, color(128), color(96));
  cpt_sloider = new Sloider(0.825*width, 0.48*height, 0.15*width, 0.01*width, 0.05*height, 50, color(128), color(96));

  epicycles.fill(0, 0, 0, 0);
  drawing.stroke(255);
  sketcher.background(0);
  panel.background(0);
  textAlign(CENTER, CENTER);
}

function draw() {
  cpt = round(0.1*cpt_sloider.val);
  epicycles.background(0);

  max_n = n_sloider.val;
  for (let i = 0; i < cpt - 1; i++) {
    renderFourier(t);
    t += 0.001;
  }
  renderFourier(t, 2.55*alph_sloider.val, 2.55*alph_sloider.val);
  t += 0.001;
  image(epicycles, 0, 0);
  if (Object.keys(c_n).length != 0) {
    image(drawing, 0, 0);
  }
  image(sketcher, 0.4*width, 0);
  image(panel, 0.8*width, 0);

  textSize(0.0125*width);
  stroke(255);
  text("Fourier approximation", 0.2*width, 0.06*height);
  text("Sketching pad", 0.6*width, 0.06*height);

  if (Object.keys(c_n).length == 0) {
    stroke(0, 0, 0, 0);
    textAlign(CENTER, CENTER);
    fill(255);
    text("Instructions:", 0.2*width, 0.16*height);
    textSize((7/640)*width);
    text("1. Draw your image on the Sketching pad using your mouse or\na stylus. Make sure the drawing is one continuous line that\nends in the same place it begins. To restart, simply let go\nand start drawing again.", 0.2*width, 0.26*height);
    text("2. Adjust the Number of epicycles slider to set the number\nof circles desired to approximate your drawing. Higher\nvalues correspond to higher accuracy while lower values\n correspond to more abstractness.", 0.2*width, 0.42*height);
    text("3. You may adjust the Epicycle opacity slider to change\nthe visibility of the circles, and the Speed slider to change\nthe speed of these circles.", 0.2*width, 0.56*height);
    text("4. To save your drawing for later use, press the\nDownload path button.", 0.2*width, 0.66*height);
  }

  download_button.show();
  n_sloider.show();
  alph_sloider.show();
  cpt_sloider.show();

  stroke(0, 0, 0, 0);
  textAlign(CENTER, CENTER);
  textSize(0.0125*width);
  fill(255);
  text("Number of epicycles: " + 2*n_sloider.val, 0.9*width, 0.10*height);
  text("Epicycle opacity: " + alph_sloider.val, 0.9*width, 0.26*height);
  text("Speed: " + cpt_sloider.val, 0.9*width, 0.42*height);

  stroke(255);
  line(0.4*width, 0, 0.4*width, height);
  line(0.8*width, 0, 0.8*width, height);
}

function mouseDragged() {
  if (mouseX > 0.4*width && mouseX < 0.8*width && mouseY < height && mouseY > 0) {
    sketcher.stroke(255);
    if (prev_mouse != false) {
      sketcher.line(prev_mouse.x, prev_mouse.y, mouseX - 0.4*width, mouseY);
    }
    prev_mouse = {x: mouseX - 0.4*width, y: mouseY};

    let x = map(mouseX, 0.4*width, 0.8*width, -1, 1);
    let y = map(mouseY, 0, height, 1, -1);
    path.push({x: x, y: y});
  }

  if (n_sloider.state) {
    n_sloider.pos = mouseX;
    if (n_sloider.pos < n_sloider.x) {
      n_sloider.pos = n_sloider.x;
    } else if (n_sloider.pos > n_sloider.x + n_sloider.w) {
      n_sloider.pos = n_sloider.x + n_sloider.w;
    }

    n_sloider.val = round(map(n_sloider.pos, n_sloider.x, n_sloider.x + n_sloider.w, 1, 100));
  }

  if (alph_sloider.state) {
    alph_sloider.pos = mouseX;
    if (alph_sloider.pos < alph_sloider.x) {
      alph_sloider.pos = alph_sloider.x;
    } else if (alph_sloider.pos > alph_sloider.x + alph_sloider.w) {
      alph_sloider.pos = alph_sloider.x + alph_sloider.w;
    }

    alph_sloider.val = round(map(alph_sloider.pos, alph_sloider.x, alph_sloider.x + alph_sloider.w, 1, 100));
  }

  if (cpt_sloider.state) {
    cpt_sloider.pos = mouseX;
    if (cpt_sloider.pos < cpt_sloider.x) {
      cpt_sloider.pos = cpt_sloider.x;
    } else if (cpt_sloider.pos > cpt_sloider.x + cpt_sloider.w) {
      cpt_sloider.pos = cpt_sloider.x + cpt_sloider.w;
    }

    cpt_sloider.val = round(map(cpt_sloider.pos, cpt_sloider.x, cpt_sloider.x + cpt_sloider.w, 1, 100));
  }
}

function mousePressed() {
  if (mouseX > 0.4*width && mouseX < 0.8*width && mouseY < height && mouseY > 0) {
    sketcher.background(0);
    prev_mouse = false;
    path = [];
  }

  if (mouseX > download_button.x && mouseX < download_button.x + download_button.w && mouseY > download_button.y && mouseY < download_button.y + download_button.h) {
    download_button.state = true;
  }


  if (mouseX > n_sloider.pos - n_sloider.l/2 && mouseX < n_sloider.pos + n_sloider.l/2 && mouseY > n_sloider.y - n_sloider.h/2 && mouseY < n_sloider.y + n_sloider.h/2) {
    n_sloider.state = true;
  }
  if (mouseX > alph_sloider.pos - alph_sloider.l/2 && mouseX < alph_sloider.pos + alph_sloider.l/2 && mouseY > alph_sloider.y - alph_sloider.h/2 && mouseY < alph_sloider.y + alph_sloider.h/2) {
    alph_sloider.state = true;
  }
  if (mouseX > cpt_sloider.pos - cpt_sloider.l/2 && mouseX < cpt_sloider.pos + cpt_sloider.l/2 && mouseY > cpt_sloider.y - cpt_sloider.h/2 && mouseY < cpt_sloider.y + cpt_sloider.h/2) {
    cpt_sloider.state = true;
  }
}

function mouseReleased() {
  if (download_button.state) {
    saveJSON(path, "path");
  }
  if (n_sloider.state || (mouseX > 0.4*width && mouseX < 0.8*width && mouseY > 0 && mouseY < height)) {
    c_n = {};
    prev_coord = false;
    t = 0;

    drawing = createGraphics(0.4*width, height);
    epicycles = createGraphics(0.4*width, height);
    c_n[0] = calcTerm(chosen_func, 0, 1000);
    for (let i = 1; i <= max_n; i++) {
      c_n[i] = calcTerm(chosen_func, i, 1000);
      c_n[-i] = calcTerm(chosen_func, -i, 1000);
    }
    epicycles.fill(0, 0, 0, 0);
    drawing.stroke(255);
  }

  download_button.state = false;
  n_sloider.state = false;
  alph_sloider.state = false;
  cpt_sloider.state = false;
}

function keyTyped() {
  if (key === " ") {
    // chosen_func = drawn;
    c_n = {};
    prev_coord = false;
    t = 0;

    drawing = createGraphics(0.4*width, height);
    epicycles = createGraphics(0.4*width, height);
    c_n[0] = calcTerm(chosen_func, 0, 1000);
    for (let i = 1; i <= max_n; i++) {
      c_n[i] = calcTerm(chosen_func, i, 1000);
      c_n[-i] = calcTerm(chosen_func, -i, 1000);
    }
    epicycles.fill(0, 0, 0, 0);
    drawing.stroke(255);
  }
}

// function windowResized() {
//   let width1 = windowWidth;
//   let width2 = (windowHeight - 4)/0.4;
//   resizeCanvas(min(width1, width2), 0.4*min(width1, width2));
// }