class Algebraic {
  eql(a) { return }
  get zero() { return }
  get unity() { return }
  get neg() { return }
  get inv() { return }
  get unit() { return }
  get body() { return }
  get isZero() { return this.eql(this.zero) }
  get isUnity() { return this.eql(this.unity) }
  get isUnit() { return this.eql(this.unit) }
  get isBody() { return this.eql(this.body) }
  divmod(a) {
    return (
      ((_) => (
        a.isZero ? [a, _] : (
          ((r) => (
            r < 0 && (r += a),
            ((q) => (
              [q, r]
            ))((_ - r)/a)
          ))(_ % a)
        )
      ))(this.valueOf())
    )
  }
  div(a) { return this.divmod(a)[0] }
  mod(a) { return this.divmod(a)[1] }
  split(a) {
    return (
      (({ body }, arr) => {
        while (!body.isZero) {
          (([q, r]) => {
            body = q
            arr.push(r)
          })(body.divmod(a))
        }
        return arr.reverse()
      })(this, [])
    )
  }
  gcd(a) {
    return (
      (({ body }) => {
        while (!a.isZero) {
          [body, a] = [a, body.mod(a)]
        }
        return body
      })(this)
    )
  }
  ub(a) {
    return (
      (({ unit, body, unity }) => {
        if (body.isZero || a.isZero) {
          return [unit, body]
        }
        let d
        while (true) {
          d = body.gcd(a)
          if (d.isUnity) {
            break
          }
          body /= d; unity *= d
        }
        return [unit * body, unity]
      })(this)
    )
  }
  lcm(a) { return this * a / this.gcd(a) }
  _inv(a) {
    return (
      ((_, x, z, n) => {
        if (a.isZero && (-_).isUnity)
          return _
        while (!a.isZero) {
          (([q, r]) => {
            [_, a, x, z] = [a, r, z, x - q * z]
          })(_.divmod(a))
        }
        return x.mod(n)
      })(this.valueOf(), this.unity, this.zero, a)
    )
  }
  __inv(a) {
    return (
      (({ body, unity, zero }) => {
        while (!a.isZero) {
          (([q, r]) => {
            [body, a, unity, zero] = [a, r, zero, unity - q * zero]
          })(body.divmod(a))
        }
        return unity
      })(this)
    )
  }
  get factorize() {
    return (
      (({ body, zero, unity }, fs) => {
        while (!body.isUnity) {
          ((p) => {
            fs.has(p) || fs.set(p, zero)
            fs.set(p, fs.get(p) + unity)
            body /= p
          })(body.factor)
        }
        return fs
      })(this, new Map)
    )
  }
}

(({ ownKeys, defineProperty }) => (
  (({ prototype }) => (
    ownKeys(Math).forEach((p) => (
      ((f) => (
        typeof f === 'function' &&
        defineProperty(prototype, p, f.length < 2 ? {
          get() {
            return f(this)
          }
        } : {
          value(a) {
            return f(this, a)
          }
        })
      ))(Math[p])
    )),
    Object.defineProperties(prototype, {
      eql: {
        value(a) { return this.valueOf() === a }
      },
      zero: { value: 0 },
      unity: { value: 1 },
      neg: {
        get() { return this.isZero ? 0 : -this }
      },
      inv: {
        get() { return this.isZero ? undefined : 1/this }
      },
      unit: {
        get() { return this < 0 ? -1 : 1 }
      },
      body: {
        get() { return this < 0 ? this.neg : this.valueOf() }
      },
      ord: {
        get() { return this.isZero ? undefined : this.body.log }
      },
      arg: {
        get() { return this.isZero ? undefined : this > 0 ? 0 : 0.5 }
      },
      factor: {
        get() {
          return (
            !(this % 2) ? 2 :
            !(this % 3) ? 3 :
            !(this % 5) ? 5 :
            ((_, p) => {
              while (p * p <= _) {
                if (!(_ % p)) return p // 7
                p += 4
                if (!(_ % p)) return p // 11
                p += 2
                if (!(_ % p)) return p // 13
                p += 4
                if (!(_ % p)) return p // 17
                p += 2
                if (!(_ % p)) return p // 19
                p += 4
                if (!(_ % p)) return p // 23
                p += 6
                if (!(_ % p)) return p // 29
                p += 2
                if (!(_ % p)) return p // 1
                p += 6
              }
              return _
            })(this.valueOf(), 7)
          )
        }
      },
      toArch: {
        get() {
          return (
            this === 0 ? Arch.zero :
            new Arch(this.ord, this.arg)
          )
        }
      },
      toArray: {
        get() {
          return (
            (({ floor }) => (
              floor < 0 ? (
                floor.neg.toArray.map(a => floor + a)
              ) : (
                [...Array(floor).keys()]
              )
            ))(this)
          )
        }
      },
      ub2: {
        get() {
          return (
            (({ body, unit }, i) => {
              while (body > 2) {
                body /= 2
                i += 1
              }
              while (body < 1) {
                body *= 2
                i -= 1
              }
              return [unit * body * 2 ** 52, 2 ** (i - 52)]
            })(this, 0)
          )
        }
      },
      asString: {
        get() {
          return (
            (this < 0 ? '−' : '') +
            (({ body }, { isInteger, isLittle, precision, radix }) => (
              isInteger(body) ? (
                //Integer
                ((string)=>(
                  isLittle ? (
                    (([x, ...y]) => (
                      [x, '.'].concat(y).join('')
                    ))(
                      [...string].reverse()
                    )
                  ) : (
                    string
                  )
                ))(BigInt(body).toString(radix))
              ) : (
                //Not Integer
                radix === 10
                ? body.toFixed(precision)
                : (([x, y]) => (
                  x + '.' + y.slice(0, precision)
                ))((body + radix ** (- precision - 1)).toString(radix).split('.'))
              )
            ))(this, Number)
          )
        }
      }
    })
  ))(Number),
  (({ prototype }) => (
    Object.defineProperties(prototype, {
      eql: {
        value(a) { return this.valueOf() === a }
      },
      zero: { value: 0n },
      unity: { value: 1n },
      neg: {
        get() { return -this }
      },
      inv: {
        get() { return this.isZero ? undefined : new Adele(1n, this) }
      },
      unit: {
        get() { return this < 0 ? -1n : 1n }
      },
      body: {
        get() { return this < 0 ? this.neg : this.valueOf() }
      },
      factor: {
        get() {
          return (
            !(this % 2n) ? 2n :
            !(this % 3n) ? 3n :
            !(this % 5n) ? 5n :
            ((_, p) => {
              while (p * p <= _) {
                if (!(_ % p)) return p // 7
                p += 4n
                if (!(_ % p)) return p // 11
                p += 2n
                if (!(_ % p)) return p // 13
                p += 4n
                if (!(_ % p)) return p // 17
                p += 2n
                if (!(_ % p)) return p // 19
                p += 4n
                if (!(_ % p)) return p // 23
                p += 6n
                if (!(_ % p)) return p // 29
                p += 2n
                if (!(_ % p)) return p // 1
                p += 6n
              }
              return _
            })(this.valueOf(), 7n)
          )
        }
      },
      asString: {
        get() {
          return (
            (({ body }) => (
              (this < 0 ? '−' : '') + (
                ((_) => (
                  Number.isLittle
                  ? [_[0], '.'].concat(_.slice(1))
                  : _.reverse()
                ))(
                  [...body.toString(Number.radix)].reverse()
                )
              ).join('')
            ))(this)
          )
        }
      }
    })
  ))(BigInt)
))(Reflect)

Reflect.setPrototypeOf(Number.prototype, Algebraic.prototype)
Reflect.setPrototypeOf(BigInt.prototype, Algebraic.prototype)

// `a` should be unsigned.
const parseBigInt = (a, radix = 10) => (
  [...a].reduce(
    (prev, curr) => (
      prev * BigInt(radix) + BigInt(parseInt(curr, radix))
    ),
    0n
  )
)

const PI2 = Math.PI * 2

class Arch extends Algebraic {
  constructor(ord = 0, arg = 0) {
    super()
    arg %= 1; arg < 0 && (arg += 1)
    this.ord = ord; this.arg = arg
  }
  get _arg() {
    return (
      (({ isZero, arg }) => (
        isZero ? undefined :
        arg < 0.5 ? arg :
        arg - 1
      ))(this)
    )
  }
  get amp() {
    return (
      (({ isZero, _arg }) => (
        isZero ? undefined :
        _arg * PI2
      ))(this)
    )
  }
  eql(a) {
    return (
      (({ ord, arg }) => (
        ord === a.ord && arg === a.arg
      ))(this)
    )
  }
  get unit() {
    return (
      (({ isZero, unity, arg }) => (
        isZero ? unity : new Arch(0, arg)
      ))(this)
    )
  }
  get body() {
    return (
      (({ isZero, ord }) => (
        isZero ? this : new Arch(ord)
      ))(this)
    )
  }
  get shift() {
    return (
      (({ isZero, ord, arg }) => (
        isZero ? this : new Arch(ord + 1, arg)
      ))(this)
    )
  }
  get succ() { return this.exp.shift.log }
  get conj() {
    return (
      (({ isZero, ord, arg }) => (
        isZero ? this :
        new Arch(ord, arg.neg)
      ))(this)
    )
  }
  get inv() {
    return (
      (({ isZero, ord, arg }) => (
        isZero ? undefined :
        new Arch(ord.neg, arg.neg)
      ))(this)
    )
  }
  mul(a) {
    return (
      (({ isZero, zero, ord, arg }) => (
        isZero || a.isZero ? zero :
        new Arch(ord + a.ord, arg + a.arg)
      ))(this)
    )
  }
  get neg() {
    return (
      (({ isZero, ord, arg }) => (
        isZero ? this :
        new Arch(ord, arg + 0.5)
      ))(this)
    )
  }
  add(a) {
    return (
      (({ isZero, neg, zero, ord, inv }) => (
        isZero ? a :
        a.isZero ? this :
        neg.eql(a) ? zero :
        ord < a.ord ? a.add(this) :
        this.mul(inv.mul(a).succ)
      ))(this)
    )
  }
  get log() {
    return (
      (({ isZero, isUnity, zero, ord, amp }) => (
        isZero ? undefined :
        isUnity ? zero :
        new Arch(
          ((x, y) => (
            x < y && ([x, y] = [y, x]),
            y /= x,
            x.log + (1 + y**2).log / 2
          ))(ord.body, amp.body),
          amp.atan2(ord) / PI2
        )
      ))(this)
    )
  }
  get exp() {
    return (
      (({ isZero, unity, ord, amp }) => (
        isZero ? unity :
        (({ exp }, { cos, sin }) => (
          new Arch(exp * cos, exp * sin / PI2)
        ))(ord, amp)
      ))(this)
    )
  }
  pow(a) {
    return (
      (({ isZero, unity, zero, ord, _arg, log }) => (
        isZero ? (
          a.isZero ? unity : zero
        ) : (
          typeof a === 'number' ? (
            new Arch(ord * a, _arg * a)
          ) : (
            log.mul(a).exp
          )
        )
      ))(this)
    )
  }
  get sqrt() {
    return (
      (({ isZero }) => (
        isZero ? this : this.pow(0.5)
      ))(this)
    )
  }
  toString() {
    return (
      (({ isZero, ord, arg }, { precision }) => (
        isZero ? '0' :
        (([x, y], [, z]) => (
          x + '.' + y + '.' + z + 'X'
        ))(
          ord.toFixed(precision).split('.'),
          arg.toFixed(precision).split('.')
        )
      ))(this, Number)
    )
  }
  get asString() {
    return (
      (({ isZero, ord, arg }, { precision }) => (
        isZero ? '0' :
        (([x, y = ''], [, z = '']) => (
          (y += '0'.repeat(precision)),
          (z += '0'.repeat(precision)),
          x + '.' + y.slice(0, precision) + '.' + z.slice(0, precision) + 'X'
        ))(ord.asString.split('.'), arg.asString.split('.'))
      ))(this, Number)
    )
  }
}
Reflect.defineProperty(Arch, 'zero', { value: Object.create(Arch.prototype) })
Reflect.defineProperty(Arch, 'unity', { value: new Arch })
Reflect.defineProperty(Arch.prototype, 'zero', { value: Arch.zero })
Reflect.defineProperty(Arch.prototype, 'unity', { value: Arch.unity })

/*
Number.parse = (a) => (
  (([x, y = '']) => (
    ((i) => (
      parseInt(i, Number.radix) / Number.radix ** y.length
    ))([x, y].join(''))
  ))(a.split('.'))
)
*/
const num2float = (a) => (
  (({ radix }, [x, y = '']) => (
    radix || (radix = 10),
    ((i) => (
      parseInt(i, radix) / radix ** y.length
    ))(x + y)
  ))(Number, a.split('.'))
)
const parseArch = (a) => (
  (([x, y, z]) => (
    ((ord, arg) => (
      ((_) => (
        a.includes('X') ? _ : _.log
      ))(new Arch(ord, arg))
    ))(
      num2float((x || '0') + '.' + (y || '0')),
      num2float(            '0.' + (z || '0'))
    )
  ))(a.split('X').join('').split('.'))
)
Number.precision = 8
Number.constants = {
  _Cs  : 9192631770      .log,
  _c   : 299792458       .log,
  _G   : 6.67430e-11     .log,
  _h   : 6.62607015e-34  .log,
  _k   : 1.380649e-23    .log,
  _e   : 1.602176634e-19 .log,
  _NA  : 6.02214076e23   .log,
  _Kcd : 683             .log,
  _α   : 7.2973525693e-3 .log,
  _2   : 2               .log,
  _PI2 : PI2             .log,
  _10  : 10              .log,
  _B   : 256         .log.log
}

Number.units = (({ _c, _G, _h, _k, _Kcd, _e, _α, _2, _PI2, }) => ({
  _kg: (  -_c +_G -_h +_2)/2 +_PI2,
  _m : ( 3*_c -_G -_h -_2)/2,
  _s : ( 5*_c -_G -_h -_2)/2,
  _K : (-5*_c +_G -_h +_2)/2 +_PI2 +_k,
  _cd:  -5*_c +_G     +_2    +_PI2 -_Kcd,
  _C :    -_e + (_α   +_2    +_PI2)/2
}))(Number.constants)

Object.assign(Number.units, (({ _kg, _m, _s, _K, _cd, _C }) => ({
  _Hz:            -  _s,
  _N :  _kg +  _m -2*_s,
  _J :  _kg +2*_m -2*_s,
  _W :  _kg +2*_m -3*_s,
  _Pa:  _kg -  _m -2*_s,
  _A :            -  _s +  _C,
  _V :  _kg +2*_m -2*_s -  _C,
  _Ω :  _kg +2*_m -  _s -2*_C,
  _F : -_kg -2*_m +2*_s +2*_C,
  _S : -_kg -2*_m +  _s +2*_C,
  _Wb:  _kg +2*_m -  _s -  _C,
  _T :  _kg       -  _s -  _C,
  _H :  _kg +2*_m       -2*_C
}))(Number.units))

Arch.units = (({
  _kg, _m, _s, _K, _C, _cd,
  _Hz, _N, _J, _W, _Pa, _A, _V, _Ω, _F, _S, _Wb, _T, _H
}, {
  _NA, _e, _B
}) => ({
  kg : new Arch(_kg, 1/8),
  m  : new Arch(_m, 1/8),
  s  : new Arch(_s, 1/8),
  K  : new Arch(_K, 1/8),
  C  : new Arch(_C, 1/8),
  B  : new Arch(_B),
  mol: new Arch(_NA),
  cd : new Arch(_cd),
  e  : new Arch(_e +_C, 1/8),
  Hz : new Arch(_Hz, -1/8),
  N  : new Arch(_N),
  J  : new Arch(_J, 1/8),
  W  : new Arch(_W),
  Pa : new Arch(_Pa, -1/4),
  A  : new Arch(_A),
  V  : new Arch(_V),
  Ω  : new Arch(_Ω),
  F  : new Arch(_F, 1/8),
  S  : new Arch(_S),
  Wb : new Arch(_Wb, 1/8),
  T  : new Arch(_T, -1/8),
  H  : new Arch(_H, 1/8)
}))(Number.units, Number.constants)

class Adele extends Algebraic {
  constructor(r = 0n, s = 1n, n = 0n) {
    (([u, s]) => {
      super()
      this.r = (r * u._inv(n)).mod(n * s)
      this.s = s
      this.n = n
    })(s.ub(n))
  }
  get finalize() {
    return (
      (({ n, r, s }) => (
        n.isUnity || s.isZero ? nil :
        ((d) => (
          new Adele(r.div(d), s.div(d), n)
        ))(r.gcd(s))
      ))(this)
    )
  }
  coerce(a) {
    return (
      (({ n: _n, r: _r, s: _s }, { n: an, r: ar, s: as }) => (
        ((n) => (
          n.isUnity ? [nil, nil] :
          (([_u, _s], [au, as]) => (
            ((s) => (
              ((_r, ar) => (
                [new Adele(ar, s, n), new Adele(_r, s, n)]
              ))(_r * _u._inv(n) * s.div(_s), ar * au._inv(n) * s.div(as))
            ))(_s.lcm(as))
          ))(_s.ub(n), as.ub(n))
        ))(_n.gcd(an))
      ))(this, a)
    )
  }
  eql(a) { return this.n === a.n && this.r === a.r && this.s === a.s }
  get zero() { return new Adele(0n, this.s, this.n) }
  get neg() { return this.eql(nil) ? nil : new Adele(-this.r, this.s, this.n) }
  get res() { return (({ n, r, s }) => (
    (([u, n]) => (
      new Adele(0n, 1n, n)
    ))(r.ub(n))
  ))(this)}
  add(a) { return this._add(a).finalize }
  _add(a) { return (([_, a]) => _.__add(a))(this.coerce(a)) }
  __add(a) { return this.eql(nil) ? nil : new Adele(this.r + a.r, this.s, this.n) }
  get unity() { return (({ s, n }) => (
    new Adele(s, s, n)
  ))(this)}
  get inv() { return (({ r, s, n }) => (
    r.isZero ? nil :
    (([u, b]) => (
      new Adele(s * u._inv(n), b, n)
    ))(r.ub(n))
  ))(this) }
  mul(a) { return this._mul(a).finalize }
  _mul(a) { return (([_, a]) => (
    _.__mul(a)
  ))(this.coerce(a)) }
  __mul(a) { return this.eql(nil) ? nil : new Adele(
    this.r * a.r, this.s * a.s, this.n
  ) }
  pow(a) {
    let _ = this, __ = _.unity
    while (a) {
      a.mod(2n).isUnity && (__ = __.mul(_))
      _ = _.mul(_); a = a.div(2n)
    }
    return __
  }
  get unit() {
    return (
      (({ n, r, s }) => (
        (([u, b]) => (
          new Adele(u, 1n, n)
        ))(r.ub(n))
      ))(this)
    )
  }
  get body() {
    return (
      (({ n, r, s }) => (
        (([u, b]) => (
          new Adele(b, s, 0n)
        ))(r.ub(n))
      ))(this)
    )
  }
  get factor() {
    return (
      (({ n, r, s }) => (
        ((p) => (
          r % p
          ? [new Adele(1n, p), new Adele(r, s/p)]
          : [new Adele(p, 1n), new Adele(r/p, s)]
        ))((r * s).factor)
      ))(this)
    )
  }
  toString(a = 10) {
    return (
      this.eql(nil) ? 'nil' :
      (({ n, r, s }, _) => (
        (n.isZero  ? '' : (      n.asString + '\\')) +
        (                        r.asString        ) +
        (s.isUnity ? '' : ('/' + s.asString       ))
      ))(this)
    )
  }
  get asString() {
    return (
      this.eql(nil) ? 'nil' :
      (({ n, r, s }, _) => (
        (n.isZero  ? '' : (      n.asString + '\\')) +
        (                        r.asString        ) +
        (s.isUnity ? '' : ('/' + s.asString       ))
      ))(this)
    )
  }
}
const nil = new Adele(0n, 0n, 1n)
const num2adele = (a) => (
  (([x, y = '']) => {
    let _ = x + y
    let ord = y.length
    if (Number.isLittle) {
      _ = [..._].reverse().join('')
      ord = x.length - 1
    }
    return new Adele(
      parseBigInt(_, Number.radix),
      BigInt(Number.radix) ** BigInt(ord)
    ).finalize
  })(a.split('.'))
)

class BigNum extends Algebraic {
  constructor(r = 0n, precision = 0, radix = 10) {
    super()
    this.r = r
    this.precision = precision
    this.radix = radix
  }
  coerce(a) {
    return (
      (({ r, precision, radix }) => (
        precision === a.precision ? [this, a] :
        precision < a.precision ? (
          [this, new BigNum(a.r / (BigInt(radix) ** BigInt(a.precision - precision)), precision, radix)]
        ) : (
          [new BigNum(r / (BigInt(radix) ** BigInt(precision - a.precision)), precision, radix), a]
        )
      ))(this)
    )
  }
  eql(a) {
    return (
      (({ r, precision, radix }) => (
        r.eql(a.r) && precision.eql(a.precision) && radix.eql(a.radix)
      ))(this)
    )
  }
  get zero() {
    return (
      (({ r, precision, radix }) => (
        new BigNum(r.zero, precision, radix)
      ))(this)
    )
  }
  get unity() {
    return (
      (({ r, precision, radix }) => (
        new BigNum(BigInt(radix) ** BigInt(precision), precision, radix)
      ))(this)
    )
  }
  get unit() {
    return (
      (({ r, precision, radix }) => (
        new BigNum(r.unit * BigInt(radix) ** BigInt(precision), precision, radix)
      ))(this)
    )
  }
  get body() {
    return (
      (({ r, precision, radix }) => (
        new BigNum(r.body, precision, radix)
      ))(this)
    )
  }
  get neg() {
    return (
      (({ r, precision, radix }) => (
        new BigNum(r.neg, precision, radix)
      ))(this)
    )
  }
  add(a) {
    return (
      (([_, a]) => (
        _._add(a)
      ))(this.coerce(a))
    )
  }
  _add(a) {
    return (
      (({ r, precision, radix }) => (
        new BigNum(r + a.r, precision, radix)
      ))(this)
    )
  }
  get inv() {
    return (
      (({ r, precision, radix }) => (
        new BigNum(BigInt(radix) ** BigInt(precision * 2) / r, precision, radix)
      ))(this)
    )
  }
  mul(a) {
    return (
      (([_, a]) => (
        _._mul(a)
      ))(this.coerce(a))
    )
  }
  _mul(a) {
    return (
      (({ r, precision, radix }) => (
        new BigNum((r * a.r)/(BigInt(radix) ** BigInt(precision)), precision)
      ))(this)
    )
  }
  get asString() {
    return (
      (({ r, precision, radix }) => (
        ((_) => (
          ((l) => (
            l > 0 && (
              _ = Array(l).fill('0').join('') + _
            ),
            _.slice(0, _.length - precision) + '.' + _.slice(_.length - precision, -1)
          ))(precision - _.length)
        ))(r.toString(radix))
      ))(this)
    )
  }
}
;(typeof module === 'undefined' ? {} : module).exports = { Arch, Adele }
