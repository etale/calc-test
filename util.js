const _ = (a, b = 0) => new Arch(a.log, b)
const kilo = _(1000)
const prefix = {
 '': kilo.pow(0),
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
  m,
  s,
  K,
  C,
  Hz: s.inv,
  N: kg.mul(m).mul(s.pow(-2)),
  J: kg.mul(m.pow(2)).mul(s.pow(-2)),
  A: C.mul(s.inv),
  W: kg.mul(m.pow(2)).mul(s.pow(-3)),
  V: kg.mul(m.pow(2)).mul(s.pow(-2)).mul(C.pow(-1)),
  Ω: kg.mul(m.pow(2)).mul(s.pow(-1)).mul(C.pow(-2)),
  Pa: kg.mul(m.pow(-1)).mul(s.pow(-2))
}
unit.eV  = e.mul(unit.V)

//unit.F  = unit.C.mul(unit.V.inv)
//unit.S  = unit.A.mul(unit.V.inv)
//unit.Wb = unit.V.mul(unit.s)
//unit.T  = unit.Wb.mul(unit.m.mul(unit.m).inv)
//unit.H  = unit.Wb.mul(unit.A.inv)
const Ki = new Arch(1024 .log)
const bprefix = {
  '': Ki.pow(0),
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
let vals = {}
Reflect.ownKeys(prefix).forEach((p) => {
  Reflect.ownKeys(unit).forEach((u) => {
    vals[p + u] = prefix[p].mul(unit[u])
  })
})
Reflect.ownKeys(bprefix).forEach((p) => {
  Reflect.ownKeys(bunit).forEach((u) => {
    vals[p + u] = bprefix[p].mul(bunit[u])
  })
})

_vals = {
  atm: _(101325).mul(unit.Pa),
  min: _(60).mul(s),
  hour: _(60 * 60).mul(s),
  day: _(60 * 60 * 24).mul(s),
  week: _(60 * 60 * 24 * 7).mul(s),
  year: _(60 * 60 * 24 * 7 * 365.25).mul(s),
  '0 °C': _(273.15).mul(K),
  '100 °C': _(373.15).mul(K),
  e: _(nu_e).mul(C),
  'mass electron': _(9.10938356e-31).mul(kg),
  'mass proton': _(1.672621898e-27).mul(kg),
  'mass u': _(2.3e6).mul(unit.eV),
  'mass c': _(1.275e9).mul(unit.eV),
  'mass t': _(173.07e9).mul(unit.eV),
  'mass W': _(80.4e9).mul(unit.eV),
  'mass Higgs': _(126e9).mul(unit.eV),
}
_vals['Thousand years']= kilo.mul(_vals.year)
_vals['Million years'] = prefix.M.mul(_vals.year)
_vals['Billion years'] = prefix.G.mul(_vals.year)

, km = prefix.k.mul(unit.m)
//, e = _(1.6021766208e-19).mul(unit.C)
, vals = Object.keys(unit).reduce(function (prev, u) {
  return prev.concat(Object.keys(prefix).map(function (p) {
    return [prefix[p].mul(unit[u]), p + u]
  }))
}, []).concat([
, [two.log, 'b' ], [B, 'B' ]
, [KiB, 'KiB'], [MiB, 'MiB'], [GiB, 'GiB'], [TiB, 'TiB']
, [PiB, 'PiB'], [EiB, 'EiB'], [ZiB, 'ZiB'], [YiB, 'YiB']
, [_(1.65).mul(eV), 'IR'], [_(3.26).mul(eV), 'UV']
, [e, 'e']
, [unit.m.mul(unit.Hz), 'm/s']
, [prefix.k.mul(unit.m).mul(hour.inv), 'km/hour']
, [_(7.347673e22).mul(kg), 'mass Moon']
, [_(4*Math.PI * 4.9048695e12).mul(unit.m.pow(3)).mul(unit.s.pow(-2)), 'mass Moon']
, [_(4*Math.PI * 3.986004418e14).mul(unit.m.pow(3)).mul(unit.s.pow(-2)), 'mass Earth']
, [_(4*Math.PI * 3.7931187e16).mul(unit.m.pow(3)).mul(unit.s.pow(-2)), 'mass Saturn']
, [_(4*Math.PI * 1.26686534e17).mul(unit.m.pow(3)).mul(unit.s.pow(-2)), 'mass Jupiter']
, [_(4*Math.PI * 1.32712442099e20).mul(unit.m.pow(3)).mul(unit.s.pow(-2)), 'mass Sun']
, [_(3474.3).mul(km), 'radius Moon']
, [_(6378.137).mul(km), 'radius Earth']
, [_(695800).mul(km), 'radius Sun' ]
, [_(384400).mul(km), 'orbit Moon']
, [_(149597870700).mul(unit.m), 'au']
, [_(39.445 * 149600000).mul(km), 'orbit Plute']
, [_(13.799e9).mul(year), 'age Universe']
, [me, 'mass electron']
, [mp, 'mass proton']
, [_(12 * 1.660539040e-27).mul(kg), 'mass C12']
, [_(4.39).mul(year), 'distance α Centauri']
, [_(643).mul(year), 'distance Betelgeuse']
, [_(162.98e3).mul(year), 'distance Large Magellanic']
, [_(2.54e6).mul(year), 'distance Andromeda']
, [_(0.52917721067e-10).mul(unit.m), 'Bohr radius']
, [_(2.72548).mul(unit.K), 'CMB']
, [_(6.022140857e23), 'Avogadro constant']
, [new Arch, '4πG = c = ε₀ = μ₀ = k']
, [tau, 'h']
