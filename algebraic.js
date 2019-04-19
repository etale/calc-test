class Algebraic {
  eql(a) { return this.valueOf() === a }
  get zero() { return 0 }
  get unity() { return 1 }
  get neg() { return this.isZero ? this : -this }
  get inv() {
    return (
      this.isZero ? undefined :
      1/this
    )
  }
  get unit() { return this < 0 ? -this.unity : this.unity }
  get body() { return this < 0 ? -this : this.valueOf() }
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
  gcd(a) {
    return (
      ((_) => {
        while (!a.isZero) {
          [_, a] = [a, _.mod(a)]
        }
        return _
      })(this.valueOf())
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
  lcm(a) {　return this * a / this.gcd(a)　}
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
    defineProperty(prototype, 'factor', {
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
    }),
    defineProperty(prototype, 'toArch', {
      get() {
        return (
          this > 0 ? new Arch(this.log) :
          this < 0 ? new Arch(this.neg.log, 0.5) :
          Arch.zero
        )
      }
    }),
    defineProperty(prototype, 'asString', {
      get() {
        return (
          (({ body }) => (
            (this < 0 ? '-' : '') + (
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
    })
  ))(Number),
  (({ prototype }) => (
    defineProperty(prototype, 'zero', { value: 0n }),
    defineProperty(prototype, 'unity', { value: 1n }),
    defineProperty(prototype, 'factor', {
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
    }),
    defineProperty(prototype, 'asString', {
      get() {
        return (
          (({ body }) => (
            (this < 0 ? '-' : '') + (
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
        isZero ? unity :
        new Arch(0, arg)
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
        new Arch((ord ** 2 + amp ** 2).log * 0.5, amp.atan2(ord) / PI2)
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
      ))(this, Arch)
    )
  }
  get asString() {
    return (
      (({ isZero, ord, arg }, { precision }) => (
        isZero ? '0' :
        (([x, y], [, z]) => (
          y || (y = ''),
          z || (z = ''),
          (y += '00000000'),
          (z += '00000000'),
          x + '.' + y.slice(0, precision) + '.' + z.slice(0, precision) + 'X'
        ))(ord.asString.split('.'), arg.asString.split('.'))
      ))(this, Arch)
    )
  }
}
Reflect.defineProperty(Arch, 'zero', { value: Object.create(Arch.prototype) })
Reflect.defineProperty(Arch, 'unity', { value: new Arch })
Reflect.defineProperty(Arch.prototype, 'zero', { value: Arch.zero })
Reflect.defineProperty(Arch.prototype, 'unity', { value: Arch.unity })

const parseArch = (a) => (
  (([x, y, z]) => (
    ((ord, arg) => (
      ((_) => (
        a.includes('X') ? _ : _.log
      ))(new Arch(ord, arg))
    ))(
      parseFloat((x || '0') + '.' + (y || '0')),
      parseFloat(            '0.' + (z || '0'))
    )
  ))(a.split('.'))
)
Arch.precision = 8
const _Cs  = 9192631770      .log
const _c   = 299792458       .log
const _G   = 6.67408e-11     .log
const _h   = 6.62607015e-34  .log
const _k   = 1.380649e-23    .log
const _e   = 1.602176634e-19 .log
const _NA  = 6.02214076e23   .log
const _Kcd = 683             .log
const b  = 2    .log
const pi2 = PI2 .log
const μ0 = b + pi2 - 7 * 10 .log

const kg = new Arch((-  _c + _G - _h + b) / 2 + pi2     , 0.125)
const m  = new Arch(( 3*_c - _G - _h - b) / 2           , 0.125)
const s  = new Arch(( 5*_c - _G - _h - b) / 2           , 0.125)
const K  = new Arch((-5*_c + _G - _h + b) / 2 + pi2 + _k, 0.125)
const C  = new Arch((   _c      - _h + b - 7 * 10 .log
                                        ) / 2 + pi2     , 0.125)
const B  = new Arch((3*b + b.log))
const mol = new Arch(_NA)
const cd = new Arch(- _Kcd).mul(kg).mul(m.pow(2)).mul(s.pow(-3))
const e = new Arch(_e).mul(C)

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
