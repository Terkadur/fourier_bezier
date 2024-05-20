function renderFourier(t, alph_l = 0, alph_e = 0) {
    let tip = new complex(0, 0);

    for (let i = 0; i < Object.keys(c_n).length; i++) {
        let n = floor(0.5 + i / 2) * (-1) ** (i - 1);
    // for (let i = 0; i < Object.keys(c_n).length/2; i++) {
    //     let n = -i;
        let term = cMult(c_n[n], cExp(n * TWO_PI * t));

        let x1, y1, rad, x2, y2;
        if (alph_l != 0 && alph_e != 0) {
            x1 = map(tip.re, -1, 1, 0, drawing.width);
            y1 = map(tip.im, -1, 1, drawing.height, 0);
            rad = map(term.abs(), 0, 1, 0, drawing.width);
        }

        tip.add(term);

        if (alph_l != 0 && alph_e != 0) {
            x2 = map(tip.re, -1, 1, 0, drawing.width);
            y2 = map(tip.im, -1, 1, drawing.height, 0);
            if (i != 0) {
                epicycles.stroke(255, 255, 255, alph_l);
                if (dist(x1, y1, x2, y2) > 0.5) {
                    epicycles.line(x1, y1, x2, y2);
                }
                epicycles.stroke(255, 255, 255, alph_e);
                if (rad > 0.5) {
                    epicycles.ellipse(x1, y1, rad);
                }
            }
        }

    }

    let x = map(tip.re, -1, 1, 0, drawing.width);
    let y = map(tip.im, -1, 1, drawing.height, 0);
    if (prev_coord != false) {
        drawing.line(prev_coord.x, prev_coord.y, x, y);
    }
    prev_coord = { x: x, y: y };
}