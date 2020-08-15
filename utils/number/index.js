/**
 * Number数字工具函数
 *
 * @module Number
 */

import { isNumber, isArray } from "../type";
import BigInt from "./big-integer";

/**
 * 将参数转为数组，如果参数本身为数组且第一个元素也为数组则返回第一个元素
 *
 */
const args2Array = (args) => {
  let params = args;
  if (args.length === 1 && isArray(args[0])) {
    params = args[0];
  }
  return params;
};

/**
 * 升降序
 *
 * @param {number} sign 升降序标识，1 -> 升序，-1 -> 降序
 * @param {Array} args 数字数组
 * @return {Array}
 */
function sort(sign, args) {
  return args.sort((a, b) => (a - b) * sign);
}

/**
 * 汇总
 *
 * @export
 * @function
 * @param {*} args 求和的数字
 * @returns {number}
 */
export const sum = (...args) => {
  const params = args2Array(args);
  return [...params].reduce((acc, val) => acc + val, 0);
};

/**
 * 取平均数
 *
 * @export
 * @function
 * @param {*} args 求平均数的数字
 * @returns {number}
 */
export const average = (...args) => {
  const params = args2Array(args);
  return sum(...params) / (params.length ? params.length : 1);
};

/**
 * 取最小值
 *
 * @export
 * @function
 * @param {*} args 数字集合
 * @returns {number}
 */
export const min = (...args) => {
  const params = args2Array(args);
  return Math.min.apply(null, params);
};

/**
 * 取最大值
 *
 * @export
 * @function
 * @param {*} args 数字集合
 * @returns {number}
 */
export const max = (...args) => {
  const params = args2Array(args);
  return Math.max.apply(null, params);
};

/**
 * 转化为货币形式
 *
 * @export
 * @function
 * @param {number} num 需要转化的数字
 * @returns {string}
 */
export const toCurrency = (num) =>
  String(num).replace(/(?!^)(?=(\d{3})+$)/g, ",");

/**
 * 截取小数点后几位
 *
 * @export
 * @function
 * @param {number} num 需要处理的数字
 * @param {number} [size=2] 保留小数点后的位数
 * @returns {string|number}
 */
export const toFixed = (num, size = 2) =>
  isNumber(num) ? num.toFixed(size) : num;

/**
 * 升序
 *
 * @export
 * @function
 * @param {*} args 数字集合
 * @returns {Array}
 */
export const sortAsc = (...args) => {
  const params = args2Array(args);
  return sort(1, params);
};

/**
 * 降序
 *
 * @export
 * @function
 * @param {*} args 数字集合
 * @returns {Array}
 */
export const sortDesc = (...args) => {
  const params = args2Array(args);
  return sort(-1, params);
};

// bigInteger类型处理
export const bigInt = BigInt;

export default {
  sum,
  average,
  min,
  max,
  toFixed,
  toCurrency,
  sortAsc,
  sortDesc,
  bigInt,
};
