export function isArray(target) {
  return Object.prototype.toString.apply(target).slice(8, -1) === 'Array'
}

export function isString(target) {
  return Object.prototype.toString.apply(target).slice(8, -1) === 'String'
}

export function isObject(target) {
  return Object.prototype.toString.apply(target).slice(8, -1) === 'Object'
}

export function isFunction(target) {
  return Object.prototype.toString.apply(target).slice(8, -1) === 'Function'
}

export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0
}

// 伪数组转为真数组
export function realArray(target) {
  const tempArr = Object.keys(target)
  return tempArr.map(key => target[key])
}

function ceil(num) {
  return num < 10 ? `0${num}` : num
}

// 日期转字符串
export function dateToString(format, ...needles) {
  const target = needles.length ? new Date(needles[0]) : new Date()
  const rule = {
    y: target.getFullYear(),
    m: ceil(target.getMonth() + 1),
    d: ceil(target.getDate()),
    h: ceil(target.getHours()),
    i: ceil(target.getMinutes()),
    s: ceil(target.getSeconds()),
    w: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][target.getDay()]
  }

  return format
    .replace('y', rule.y)
    .replace('m', rule.m)
    .replace('d', rule.d)
    .replace('h', rule.h)
    .replace('i', rule.i)
    .replace('s', rule.s)
    .replace('w', rule.w)
}

// 字符串转时间
export function stringToDate(format, ...needles) {
  const now = new Date()
  if (!needles.length) {
    return ''
  }
  const str = needles[0]
  const symbolReg = new RegExp('([0-9]|[ymdhis])+', 'g')
  const formatArr = format.match(symbolReg)
  const targetArr = str.match(symbolReg)

  let year = now.getFullYear()
  let month = now.getMonth()
  let day = now.getDate()
  let hour = now.getHours()
  let minute = now.getMinutes()
  let second = now.getSeconds()
  formatArr.forEach((symbol, index) => {
    switch (symbol) {
      case 'h':
        hour = parseInt(targetArr[index], 10)
        break
      case 'i':
        minute = parseInt(targetArr[index], 10)
        break
      case 's':
        second = parseInt(targetArr[index], 10)
        break
      case 'y':
        year = parseInt(targetArr[index], 10)
        break
      case 'm':
        month = parseInt(targetArr[index], 10) - 1
        break
      case 'd':
        day = parseInt(targetArr[index], 10)
        break
      default:
        break
    }
  })
  return new Date(year, month, day, hour, minute, second)
}

export function filterParams(obj) {
  let newPar = {}
  for (let key in obj) {
    if ((obj[key] === 0 || obj[key]) && obj[key].toString().replace(/(^\s*)|(\s*$)/g, '') !== '') {
      newPar[key] = obj[key]
    }
  }
  return newPar
}

// 小写金额转大写
export function digitUppercase(n) {
  const fraction = ['角', '分']
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']]
  const head = n < 0 ? '欠' : ''
  n = Math.abs(n)
  let s = ''
  for (let i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
  }
  s = s || '整'
  n = Math.floor(n)
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = ''
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      n = Math.floor(n / 10)
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
  }
  return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整')
}

const exportDefault = {
  isArray,
  isString,
  isObject,
  isFunction,
  isEmptyObject,
  dateToString,
  stringToDate,
  realArray,
  filterParams,
  digitUppercase
}

function install(Vue) {
  const vue = Vue
  if (vue.prototype.$utils) {
    return
  }
  vue.prototype.$utils = exportDefault
}


export default {
  install,
  ...exportDefault
}
