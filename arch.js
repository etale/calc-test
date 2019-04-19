var calc = function () {
  Number.radix = parseInt(location.hash.slice(1)) || 10
  document.body.appendChild(calc.display)
  document.body.appendChild(calc.keypad)
}

!function () {

Number.radix || Reflect.set(Number, 'radix', 10)

Number.parse = (a) => (
  (([x, y]) => (
    ((i) => (
      parseInt(i, Number.radix) / Number.radix ** y.length
    ))([x, y].join(''))
  ))(a.split('.'))
)

const html = {};

['tr', 'td', 'input', 'div', 'table'].forEach((a) => {
  Reflect.defineProperty(html, a, {
    get() {
      return document.createElement(a)
    }
  })
})

Arch.precision = 6

let e, touch
//const isFixed = () => (
//  e.hasOwnProperty('value')
//)
const fix = () => {
  e.value || set(parseArch(e.data.textContent))
}
const fixAsIs = () => {
  set(e.value ? e.value.exp : parseArch(e.data.textContent + 'X'))
}
const moveFocus = function() {
  e.classList.remove('focus')
  e = this.cell
  e.classList.add('focus')
}
const makeCell = function() {
  const { tr: cell, td: label, input, td: data } = html

  label.appendChild(input)
  cell.appendChild(label)
  cell.appendChild(data)

  /*
  <tr class="focus"> cell
    <td>             label
      <input>        input
    </td>
    <td>0</td>       data
  </tr>
  */

  cell.label = input
  cell.data = data

  input.cell = cell
  input.onchange = function() {
    if (this.value === '') {
      this.cell.data[touch] = moveFocus
      while (this.cell.previousSibling.label.value !== '') {
        calc.display.insertBefore(this.cell, this.cell.previousSibling)
      }
      this.cell.classList.remove('button')
    } else
    {
      this.cell.data[touch] = function() {
        fix(); e.value.isZero || push(); set(this.cell.value)
      }
      if (e === this.cell) {
        fix()
        e.previousSibling ? e.previousSibling.data[touch]() : push()
      }
      this.cell.classList.add('button')
      while (this.cell.nextSibling && this.cell.nextSibling.label.value === '') {
        calc.display.insertBefore(this.cell, this.cell.nextSibling.nextSibling)
      }
      while (this.cell.nextSibling && this.cell.nextSibling.value.ord < this.cell.value.ord) {
        calc.display.insertBefore(this.cell, this.cell.nextSibling.nextSibling)
      }
    }
  }
  data.cell = cell
  data.textContent = '0'
  data[touch] = moveFocus

  return cell
}
const refresh = () => {
  var _ = calc.display.firstChild

  while (_) {
    _.value && (_.data.textContent = _.value.asString)
    _ = _.nextSibling
  }
}
const push = () => {
  calc.display.insertBefore(makeCell(), e.nextSibling)
  e.nextSibling.data[touch]()
}
const pop = () => (
  (({ value, previousSibling }) => (
    previousSibling && (
      previousSibling.data[touch](),
      calc.display.removeChild(e.nextSibling)
    ),
    value
  ))(e)
)
/*
const set = (a) => {
  e.value = a; e.data.textContent = a.toString()
}
*/
const set = (a) => {
  e.value = a; e.data.textContent = a.asString
}
const numeric = function() {
  e.value && push()
  e.data.textContent = (e.data.textContent === '0' ? '' : e.data.textContent) + this.textContent
}
const keys = {
  '0': numeric,
  '1': numeric,
  '2': numeric, '3': numeric, '4': numeric, '5': numeric,
  '6': numeric, '7': numeric, '8': numeric, '9': numeric,
  '.': function() {
    e.value && push()
    e.data.textContent += '.'
  },
  '↑': function() {
    if (e.value) {
      push(); set(e.previousSibling.value)
    } else
    {
      set(parseArch(e.data.textContent))
    }
  },
  '↓': function() {
    if (e.previousSibling) {
      pop()
    } else
    {
      delete e.value
      e.data.textContent = '0'
    }
  },
  '←': function() {
    var _ = e.data

    if (e.value) {
      delete e.value
      _.textContent = '0'
    } else
    {
      _.textContent = _.textContent.slice(0, -1)
      _.textContent === '' && (_.textContent = '0')
    }
  },
  'kg': function() {
    fix(); e.value.isZero || push(); set(kg)
  },
  'm': function() {
    fix(); e.value.isZero || push(); set(m)
  },
  's': function() {
    fix(); e.value.isZero || push(); set(s)
  },
  'exp': function() {
    fixAsIs()
  },
  'log': function() {
    e.value || set(parseArch(e.data.textContent)); e.value.isZero || set(e.value.log)
  },
  '/': function() {
    fix(); e.value.isZero || set(e.value.inv)
  },
  '−': function() {
    fix(); e.value.isZero || set(e.value.neg)
  },
  '†': function() {
    fix(); e.value.isZero || set(e.value.conj)
  },
  ' ': function() {
    var _
    if (e.previousSibling) {
      fix(); _ = pop()
      if (e.value) {
        set(e.value.mul(_))
      } else
      {
        set(0)
      }
    }
  },
  '+': function() {
    var _
    if (e.previousSibling) {
      fix(); _ = pop()
      if (e.value) {
        set(e.value.add(_))
      } else
      {
        set(_)
      }
    }
  }
}

touch = html.div.hasOwnProperty('ontouchend') ? 'ontouchend' : 'onmouseup';

calc.display = html.table
calc.keypad  = html.table

e = makeCell()
calc.display.appendChild(e)
calc.display.classList.add('display');

[ ['↑'  , '↓', '←', '7', '8', '9'],
  ['kg' , 'm', 's', '4', '5', '6'],
  ['log', ' ', '/', '1', '2', '3'],
  ['exp', '+', '−', '0', '.', '†'] ].forEach(function (tds) {
  var tr = html.tr

  tds.forEach(function (td) {
    var _ = html.td

    _.textContent = td
    _[touch] = keys[td]
    tr.appendChild(_)
  })
  calc.keypad.appendChild(tr)
})
calc.keypad.classList.add('keypad')

}()

onload = calc
