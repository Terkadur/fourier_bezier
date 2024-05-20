function complex(a, b) {
  this.re = a;
  this.im = b;
  this.toString = function() {
    let re = round(1000*this.re)/1000;
    let im = round(1000*this.im)/1000;
    if (this.im >= 0) {
      return re + " + " + im + "i";
    } else {
      return re + " - " + abs(im) + "i";
    }
  };
  this.add = function(c) {
    let temp = cAdd(this, c);
    this.re = temp.re;
    this.im = temp.im;
  }
  this.mult = function(c) {
    let temp = cMult(this, c);
    this.re = temp.re;
    this.im = temp.im;
  }
  this.abs = function() {
    return sqrt(this.re**2 + this.im**2);
  }
  this.ang = function() {
    return atan2(this.im, this.re);
  }
}

function cAdd(c1, c2) {
  let a = c1.re + c2.re;
  let b = c1.im + c2.im;
  return new complex(a, b);
}

function cMult(c1, c2) {
  let a = c1.re*c2.re - c1.im*c2.im;
  let b = c1.re*c2.im + c1.im*c2.re;
  return new complex(a, b);
}

function cExp(theta) {
  let a = cos(theta);
  let b = sin(theta);
  return new complex(a, b);
}

function cIntegral(f, a, b, reimans) {
  let result = new complex(0, 0);
  let w = (b - a)/reimans;
  for (let i = a; i < b; i += w) {
    let area = cMult(f(i), new complex(w, 0));
    result.add(area);
  }
  return result;
}