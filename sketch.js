let fr = 50; //framerate
let cpt = 5; //calculations per tick (frame)
let c_n = {}; //lists coefficients
let chosen_func = drawn; //what function to draw
let prev_coord = false; //the previous coordinate (for drawing lines between points)
let t = 0; //time in the fourier drawing (full cycle ranges from 0 to 1)

let drawing; //graphics layer for sketch
let epicycles; //graphics layer for epicycles
let sketcher;
let panel;

let max_n = 5; //maximum value for n (corresponds to number of terms)
let download_button;
let n_sloider;
let alph_sloider;
let cpt_sloider;

let points = [];
let busiers = [];
let dragged_point = -1;
let dragged_anchor = -1;
let selected_points = [];
let selected_busier = -1;

let lines = 100;

function setup() {
    let width1 = windowWidth;
    let width2 = (windowHeight - 4) / 0.4;
    createCanvas(min(width1, width2), 0.4 * min(width1, width2));
    frameRate(fr);

    drawing = createGraphics(0.4 * width, height);
    epicycles = createGraphics(0.4 * width, height);
    sketcher = createGraphics(0.4 * width, height);
    panel = createGraphics(0.2 * width, height);

    download_button = new Button(0.825 * width, 0.6 * height, 0.15 * width, 0.1 * height, "WIP", color(128), color(96));

    n_sloider = new Sloider(0.825 * width, 0.16 * height, 0.15 * width, 0.01 * width, 0.05 * height, 5, color(128), color(96));
    alph_sloider = new Sloider(0.825 * width, 0.32 * height, 0.15 * width, 0.01 * width, 0.05 * height, 50, color(128), color(96));
    cpt_sloider = new Sloider(0.825 * width, 0.48 * height, 0.15 * width, 0.01 * width, 0.05 * height, 50, color(128), color(96));

    epicycles.fill(0, 0, 0, 0);
    drawing.stroke(255);
    sketcher.background(0);
    panel.background(0);
    textAlign(CENTER, CENTER);
}

function draw() {
    cpt = round(0.1 * cpt_sloider.val);
    epicycles.background(0);

    max_n = n_sloider.val;
    for (let i = 0; i < cpt - 1; i++) {
        renderFourier(t);
        t += 0.001;
    }
    renderFourier(t, 2.55 * alph_sloider.val, 2.55 * alph_sloider.val);
    t += 0.001;
    image(epicycles, 0, 0);
    if (Object.keys(c_n).length != 0) {
        image(drawing, 0, 0);
    }
    image(sketcher, 0.4 * width, 0);
    image(panel, 0.8 * width, 0);

    textSize(0.0125 * width);
    stroke(255);
    text("Fourier approximation", 0.2 * width, 0.06 * height);
    text("Bezier pad", 0.6 * width, 0.06 * height);

    if (Object.keys(c_n).length == 0) {
        stroke(0, 0, 0, 0);
        textAlign(CENTER, CENTER);
        fill(255);
        text("Instructions:", 0.2 * width, 0.16 * height);
        textSize((7 / 640) * width);
        text("1. Draw your image on the Bezier pad using your mouse. Use ctrl\nand click to create a new vertex. Use shift and click to\nselect two consecutive vertices, then shift and click\nagain to add anchors between the vertices. Click and drag to\nmove vertices and anchors. Use click and hold and\nbackspace to delete a vertex or anchor. Make sure the\nlast point overlaps with the first.", 0.2 * width, 0.30 * height);
        text("2. Adjust the Number of epicycles slider to set the number\nof circles desired to approximate your drawing. Higher\nvalues correspond to higher accuracy while lower values\n correspond to more abstractness.", 0.2 * width, 0.51 * height);
        text("3. You may adjust the Epicycle opacity slider to change\nthe visibility of the circles, and the Speed slider to change\nthe speed of these circles.", 0.2 * width, 0.65 * height);
        text("4. To save your drawing for later use, press the\nDownload path button.", 0.2 * width, 0.75 * height);
    }

    download_button.show();
    n_sloider.show();
    alph_sloider.show();
    cpt_sloider.show();

    stroke(0, 0, 0, 0);
    textAlign(CENTER, CENTER);
    textSize(0.0125 * width);
    fill(255);
    text("Number of epicycles: " + 2 * n_sloider.val, 0.9 * width, 0.10 * height);
    text("Epicycle opacity: " + alph_sloider.val, 0.9 * width, 0.26 * height);
    text("Speed: " + cpt_sloider.val, 0.9 * width, 0.42 * height);

    stroke(255);
    line(0.4 * width, 0, 0.4 * width, height);
    line(0.8 * width, 0, 0.8 * width, height);
}

function keyPressed() {
    if (keyIsDown(8)) {
        if (dragged_point == 0) {
            busiers.splice(0, 1);
            points.splice(0, 1);
        } else if (dragged_point == points.length - 1) {
            busiers.splice(busiers.length - 1, 1);
            points.splice(points.length - 1, 1);
        } else if (dragged_point != -1) {
            let new_busier = new busier([points[dragged_point - 1], points[dragged_point + 1]]);
            busiers.splice(dragged_point - 1, 2, new_busier);
            points.splice(dragged_point, 1);
        }

        if (selected_busier != -1 && dragged_anchor != -1) {
            busiers[selected_busier].anchors.splice(dragged_anchor + 1, 1);
        }

        sketcher.background(0);
        sketcher.stroke(255);
        sketcher.strokeWeight(1);
        for (let i = 0; i < busiers.length; i++) {
            let prev_x = map(busiers[i].anchors[0].x, -1, 1, 0, 0.4 * width);
            let prev_y = map(busiers[i].anchors[0].y, 1, -1, 0, height);
            for (let prop = 0; prop <= 1; prop += 1 / lines) {
                let new_point = busiers[i].eval(prop);
                let new_x = map(new_point.x, -1, 1, 0, 0.4 * width);
                let new_y = map(new_point.y, 1, -1, 0, height);
                sketcher.line(prev_x, prev_y, new_x, new_y);
                prev_x = new_x;
                prev_y = new_y;
            }
        }

        sketcher.noStroke();
        sketcher.fill(255);
        for (let i = 0; i < points.length; i++) {
            let point_screen_x = map(points[i].x, -1, 1, 0, 0.4 * width);
            let point_screen_y = map(points[i].y, 1, -1, 0, height);
            sketcher.ellipse(point_screen_x, point_screen_y, 8);

            if (selected_points.includes(i)) {
                sketcher.fill(0);
                sketcher.ellipse(point_screen_x, point_screen_y, 4);
                sketcher.fill(255);
            }
        }

        if (selected_busier != -1) {
            let anchors = busiers[selected_busier].anchors.slice(1, busiers[selected_busier].anchors.length - 1);
            for (let i = 0; i < anchors.length; i++) {
                let point_screen_x = map(anchors[i].x, -1, 1, 0, 0.4 * width);
                let point_screen_y = map(anchors[i].y, 1, -1, 0, height);

                sketcher.fill(255);
                sketcher.ellipse(point_screen_x, point_screen_y, 8);
                sketcher.fill(0);
                sketcher.ellipse(point_screen_x, point_screen_y, 6);
                sketcher.fill(255);
                sketcher.ellipse(point_screen_x, point_screen_y, 4);
            }
        }
    }
}

function mouseDragged() {
    if (mouseX > 0.4 * width && mouseX < 0.8 * width && mouseY < height && mouseY > 0) {
        let x = map(mouseX, 0.4 * width, 0.8 * width, -1, 1);
        let y = map(mouseY, 0, height, 1, -1);


        if (dragged_point != -1) {
            points[dragged_point].x = x;
            points[dragged_point].y = y;
        } else if (dragged_anchor != -1 && selected_busier != -1) {
            busiers[selected_busier].anchors[dragged_anchor + 1].x = x;
            busiers[selected_busier].anchors[dragged_anchor + 1].y = y;
        }

        sketcher.background(0);
        sketcher.stroke(255);
        sketcher.strokeWeight(1);
        for (let i = 0; i < busiers.length; i++) {
            let prev_x = map(busiers[i].anchors[0].x, -1, 1, 0, 0.4 * width);
            let prev_y = map(busiers[i].anchors[0].y, 1, -1, 0, height);
            for (let prop = 0; prop <= 1; prop += 1 / lines) {
                let new_point = busiers[i].eval(prop);
                let new_x = map(new_point.x, -1, 1, 0, 0.4 * width);
                let new_y = map(new_point.y, 1, -1, 0, height);
                sketcher.line(prev_x, prev_y, new_x, new_y);
                prev_x = new_x;
                prev_y = new_y;
            }
        }

        sketcher.noStroke();
        sketcher.fill(255);
        for (let i = 0; i < points.length; i++) {
            let point_screen_x = map(points[i].x, -1, 1, 0, 0.4 * width);
            let point_screen_y = map(points[i].y, 1, -1, 0, height);
            sketcher.ellipse(point_screen_x, point_screen_y, 8);

            if (selected_points.includes(i)) {
                sketcher.fill(0);
                sketcher.ellipse(point_screen_x, point_screen_y, 4);
                sketcher.fill(255);
            }
        }

        if (selected_busier != -1) {
            let anchors = busiers[selected_busier].anchors.slice(1, busiers[selected_busier].anchors.length - 1);
            for (let i = 0; i < anchors.length; i++) {
                let point_screen_x = map(anchors[i].x, -1, 1, 0, 0.4 * width);
                let point_screen_y = map(anchors[i].y, 1, -1, 0, height);

                sketcher.fill(255);
                sketcher.ellipse(point_screen_x, point_screen_y, 8);
                sketcher.fill(0);
                sketcher.ellipse(point_screen_x, point_screen_y, 6);
                sketcher.fill(255);
                sketcher.ellipse(point_screen_x, point_screen_y, 4);
            }
        }
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
    if (mouseX > 0.4 * width && mouseX < 0.8 * width && mouseY < height && mouseY > 0) {
        if (keyIsDown(17)) {
            let x = map(mouseX, 0.4 * width, 0.8 * width, -1, 1);
            let y = map(mouseY, 0, height, 1, -1);
            points.push(new poynt(x, y));
            if (points.length > 1) {
                busiers.push(new busier([points[points.length - 2], points[points.length - 1]]));
            }
        } else if (keyIsDown(16)) {
            let selecting = false;
            for (let i = 0; i < points.length; i++) {
                let point_screen_x = map(points[i].x, -1, 1, 0.4 * width, 0.8 * width);
                let point_screen_y = map(points[i].y, 1, -1, 0, height);

                if (dist(mouseX, mouseY, point_screen_x, point_screen_y) <= 8) {
                    if (selected_points.length == 2) {
                        selected_points = [];
                        selected_busier = -1;
                    } else if (selected_points.length == 1 && abs(i - selected_points[0]) != 1) {
                        selected_points = [i];
                    } else {
                        selected_points.push(i);
                        if (selected_points.length == 2) {
                            selected_busier = min(selected_points);
                        }
                    }
                    selecting = true;
                    break;
                }
            }

            if (!selecting && selected_busier != -1) {
                let x = map(mouseX, 0.4 * width, 0.8 * width, -1, 1);
                let y = map(mouseY, 0, height, 1, -1);
                busiers[selected_busier].addAnchor(new poynt(x, y));
            }
        } else {
            let selected = false;
            for (let i = 0; i < points.length; i++) {
                let point_screen_x = map(points[i].x, -1, 1, 0.4 * width, 0.8 * width);
                let point_screen_y = map(points[i].y, 1, -1, 0, height);

                if (dist(mouseX, mouseY, point_screen_x, point_screen_y) <= 8) {
                    dragged_point = i;
                    selected = true;
                    break;
                }
            }

            if (!selected && selected_busier != -1) {
                let anchors = busiers[selected_busier].anchors.slice(1, busiers[selected_busier].anchors.length - 1);

                for (let i = 0; i < anchors.length; i++) {
                    let point_screen_x = map(anchors[i].x, -1, 1, 0.4 * width, 0.8 * width);
                    let point_screen_y = map(anchors[i].y, 1, -1, 0, height);

                    if (dist(mouseX, mouseY, point_screen_x, point_screen_y) <= 8) {
                        dragged_anchor = i;
                        break;
                    }
                }
            }
        }

        sketcher.background(0);
        sketcher.stroke(255);
        sketcher.strokeWeight(1);
        for (let i = 0; i < busiers.length; i++) {
            let prev_x = map(busiers[i].anchors[0].x, -1, 1, 0, 0.4 * width);
            let prev_y = map(busiers[i].anchors[0].y, 1, -1, 0, height);
            for (let prop = 0; prop <= 1; prop += 1 / lines) {
                let new_point = busiers[i].eval(prop);
                let new_x = map(new_point.x, -1, 1, 0, 0.4 * width);
                let new_y = map(new_point.y, 1, -1, 0, height);
                sketcher.line(prev_x, prev_y, new_x, new_y);
                prev_x = new_x;
                prev_y = new_y;
            }
        }

        sketcher.noStroke();
        sketcher.fill(255);
        for (let i = 0; i < points.length; i++) {
            let point_screen_x = map(points[i].x, -1, 1, 0, 0.4 * width);
            let point_screen_y = map(points[i].y, 1, -1, 0, height);
            sketcher.ellipse(point_screen_x, point_screen_y, 8);

            if (selected_points.includes(i)) {
                sketcher.fill(0);
                sketcher.ellipse(point_screen_x, point_screen_y, 4);
                sketcher.fill(255);
            }
        }

        if (selected_busier != -1) {
            let anchors = busiers[selected_busier].anchors.slice(1, busiers[selected_busier].anchors.length - 1);
            for (let i = 0; i < anchors.length; i++) {
                let point_screen_x = map(anchors[i].x, -1, 1, 0, 0.4 * width);
                let point_screen_y = map(anchors[i].y, 1, -1, 0, height);

                sketcher.fill(255);
                sketcher.ellipse(point_screen_x, point_screen_y, 8);
                sketcher.fill(0);
                sketcher.ellipse(point_screen_x, point_screen_y, 6);
                sketcher.fill(255);
                sketcher.ellipse(point_screen_x, point_screen_y, 4);
            }
        }
    }

    if (mouseX > download_button.x && mouseX < download_button.x + download_button.w && mouseY > download_button.y && mouseY < download_button.y + download_button.h) {
        download_button.state = true;
    }


    if (mouseX > n_sloider.pos - n_sloider.l / 2 && mouseX < n_sloider.pos + n_sloider.l / 2 && mouseY > n_sloider.y - n_sloider.h / 2 && mouseY < n_sloider.y + n_sloider.h / 2) {
        n_sloider.state = true;
    }
    if (mouseX > alph_sloider.pos - alph_sloider.l / 2 && mouseX < alph_sloider.pos + alph_sloider.l / 2 && mouseY > alph_sloider.y - alph_sloider.h / 2 && mouseY < alph_sloider.y + alph_sloider.h / 2) {
        alph_sloider.state = true;
    }
    if (mouseX > cpt_sloider.pos - cpt_sloider.l / 2 && mouseX < cpt_sloider.pos + cpt_sloider.l / 2 && mouseY > cpt_sloider.y - cpt_sloider.h / 2 && mouseY < cpt_sloider.y + cpt_sloider.h / 2) {
        cpt_sloider.state = true;
    }
}

function mouseReleased() {
    if (download_button.state) {
        saveJSON(c_n, "path");
    }

    if ((n_sloider.state || (mouseX > 0.4 * width && mouseX < 0.8 * width && mouseY > 0 && mouseY < height)) && busiers.length > 0) {
        c_n = {};
        prev_coord = false;
        t = 0;

        drawing = createGraphics(0.4 * width, height);
        epicycles = createGraphics(0.4 * width, height);
        c_n[0] = calcTerm(chosen_func, 0, 1000, false);
        for (let i = 1; i <= max_n; i++) {
            c_n[i] = calcTerm(chosen_func, i, 1000, false);
            c_n[-i] = calcTerm(chosen_func, -i, 1000, false);
        }
        epicycles.fill(0, 0, 0, 0);
        drawing.stroke(255);
    }

    download_button.state = false;
    n_sloider.state = false;
    alph_sloider.state = false;
    cpt_sloider.state = false;
    dragged_point = -1;
    dragged_anchor = -1;
}

function keyTyped() {
    if (key === " ") {
        chosen_func = drawn;
        c_n = {};
        prev_coord = false;
        t = 0;

        drawing = createGraphics(0.4 * width, height);
        epicycles = createGraphics(0.4 * width, height);
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
