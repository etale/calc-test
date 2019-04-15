const kilo = new Arch(1000 .log)
const prefix = {
  k: kilo,
  M: kilo.pow(2),
  G: kilo.pow(3),
  T: kilo.pow(4),
  P: kilo.pow(5),
  E: kilo.pow(6),
  Z: kilo.pow(7),
  Y: kilo.pow(8),
  m: kilo.pow(-1),
  μ: kilo.pow(-2),
  n: kilo.pow(-3),
  p: kilo.pow(-4),
  f: kilo.pow(-5),
  a: kilo.pow(-6),
  z: kilo.pow(-7),
  y: kilo.pow(-8)
}
const unit = {
  g: prefix.m.mul(kg),
  m: m,
  s: s,
  K: K,
  Hz: s.inv,
  N: kg.mul(m).mul(s.inv).mul(s.inv),
  J: kg.mul(m).mul(m).mul(s.inv).mul(s.inv),
  A: kg.mul(m).mul(s.inv).mul(s.inv).mul(new Arch(μ0)).sqrt
}
unit.C  = unit.A.mul(unit.s)
unit.W  = unit.J.mul(unit.Hz)
unit.V  = unit.W.mul(unit.A.inv)
unit.Ω  = unit.V.mul(unit.A.inv)
unit.Pa  = unit.N.mul(unit.m.mul(unit.m).inv)
unit.F  = unit.C.mul(unit.V.inv)
unit.S  = unit.A.mul(unit.V.inv)
unit.Wb = unit.V.mul(unit.s)
unit.T  = unit.Wb.mul(unit.m.mul(unit.m).inv)
unit.H  = unit.Wb.mul(unit.A.inv)
const Ki = new Arch(1024 .log)
const bprefix = {
  Ki: Ki,
  Mi: Ki.pow(2),
  Gi: Ki.pow(3),
  Ti: Ki.pow(4),
  Pi: Ki.pow(5),
  Ei: Ki.pow(6),
  Zi: Ki.pow(7),
  Yi: Ki.pow(8)
}
const bunit = {
  B: B
}