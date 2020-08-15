/**
 * Type类型检验
 * @module Type
 */

/**
 * 获取各数据数据类型
 * @param {*} type 要检验的类型
 * @returns {function}
 */
export function isType(type) {
  return (val) => Object.prototype.toString.call(val) === `[object ${type}]`;
}

/**
 * 判断是否为对象
 *
 * @param {*} val 需要检验的数据
 * @returns {boolean}
 */
export function isObject(val) {
  return typeof val === "function" || (typeof val === "object" && !!val);
}

/**
 * 判断是否为null或undefined
 *
 * @param {*} val 需要检验的数据
 * @returns {boolean}
 */
export function isEmpty(val) {
  return isNull(val) || isUndefined(val);
}

/**
 * 判断是否为{}空对象
 *
 * @param {*} val 需要检验的数据
 * @returns {boolean}
 */
export function isEmptyObject(val) {
  isObject(val) && JSON.stringify(val) == "{}";
}

/**
 * 判断是否为数组
 *
 * @param {*} val 需要检验的数据
 * @returns {function}
 */
export function isArray(val) {
  return Array.isArray(val);
}

/**
 * 判断是否为参数列
 * @function
 * @param {*} type 要检验的类型
 * @returns {boolean}
 */
export const isArguments = isType("Arguments");

/**
 * 判断是否为Null类型
 * @function
 * @param {*} type 要检验的类型
 * @returns {boolean}
 */
export const isNull = isType("Null");

/**
 * 判断是否为Number类型
 * @function
 * @param {*} type 要检验的类型
 * @returns {boolean}
 */
export const isNumber = isType("Number");

/**
 * 判断是否为String类型
 * @function
 * @param {*} type 要检验的类型
 * @returns {boolean}
 */
export const isString = isType("String");

/**
 * 判断是否为Function类型
 * @function
 * @param {*} type 要检验的类型
 * @returns {boolean}
 */
export const isFunction = isType("Function");

/**
 * 判断是否为Promise类型
 * @function
 * @param {*} type 要检验的类型
 * @returns {boolean}
 */
export const isPromise = isType("Promise");

/**
 * 判断是否为Date类型
 * @function
 * @param {*} type 要检验的类型
 * @returns {boolean}
 */
export const isDate = isType("Date");

/**
 * 判断是否为RegExp类型
 * @function
 * @param {*} type 要检验的类型
 * @returns {boolean}
 */
export const isRegExp = isType("RegExp");

/**
 * 判断是否为Map类型
 * @function
 * @param {*} type 要检验的类型
 * @returns {boolean}
 */
export const isMap = isType("Map");

/**
 * 判断是否为Set类型
 * @function
 * @param {*} type 要检验的类型
 * @returns {boolean}
 */
export const isSet = isType("Set");

/**
 * 判断是否为Symbol类型
 * @function
 * @param {*} type 要检验的类型
 * @returns {boolean}
 */
export const isSymbol = isType("Symbol");

/**
 * 判断是否为Error类型
 * @function
 * @param {*} type 要检验的类型
 * @returns {boolean}
 */
export const isError = isType("Error");

/**
 * 判断是否为Undefined类型
 * @function
 * @param {*} type 要检验的类型
 * @returns {boolean}
 */
export const isUndefined = isType("Undefined");

/**
 * 判断是否为NaN
 * @function
 * @param {*} type 要检验的类型
 * @returns {boolean}
 */
export const isNaN = (val) => Number.isNaN(val);

/**
 * 判断是否为DOM元素
 * @function
 * @param {*} type 要检验的类型
 * @returns {boolean}
 */
export const isElement = (val) =>
  isObject(HTMLElement)
    ? val instanceof HTMLElement
    : isObject(val) && isString(val.nodeName) && val.nodeType === 1;

export default {
  isType,
  isObject,
  isEmptyObject,
  isEmpty,
  isArray,
  isNumber,
  isString,
  isNull,
  isUndefined,
  isNaN,
  isArguments,
  isSet,
  isMap,
  isSymbol,
  isPromise,
  isError,
  isDate,
  isRegExp,
  isElement,
};
