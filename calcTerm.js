function calcTerm(f, n, reimans, show = false) {
  let F = function(t) {return cMult(f(t), cExp(-n*TWO_PI*t));};
  let coef = cIntegral(F, 0, 1, reimans);
  if (show) {
    print("c" + n + " = " + String(coef));
  }
  return coef;
}