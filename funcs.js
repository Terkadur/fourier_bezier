
function drawn(t) {
    let x, y;
    let i = t * busiers.length;
    let prop = i - floor(i);
    let point = busiers[floor(i)].eval(prop);
    return new complex(point.x, point.y);
}