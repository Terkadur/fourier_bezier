function busier(anchors) {
    this.anchors = anchors;

    this.eval = function (t) {
        let anchors_copy = [...this.anchors];
        while (anchors_copy.length > 1) {
            let new_anchors = [];
            for (let i = 1; i < anchors_copy.length; i++) {
                let new_x = lerp(anchors_copy[i - 1].x, anchors_copy[i].x, t);
                let new_y = lerp(anchors_copy[i - 1].y, anchors_copy[i].y, t);
                new_anchors.push({ x: new_x, y: new_y });
            }
            anchors_copy = new_anchors;
        }
        return anchors_copy[0];
    }

    this.addAnchor = function (anchor) {
        let index = this.anchors.length - 1;
        this.anchors = [...this.anchors.slice(0, index), anchor, ...this.anchors.slice(index)];
    }
}

function poynt(x, y) {
    this.x = x;
    this.y = y;
}