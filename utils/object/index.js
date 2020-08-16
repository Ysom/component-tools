/**
 * Object对象工具函数
 *
 * @module Object
 */

import { isObject } from "../type";

/**
 * 克隆对象
 *
 * @export
 * @function
 * @param {*} origin 需要克隆的原对象
 * @param {*} result 克隆结果
 * @returns {*}
 */
export const clone = (origin, result = {}) => {
  for (let prop in origin) {
    if (origin.hasOwnProperty(prop)) {
      result[prop] = origin[prop];
    }
  }
  return result;
};

/**
 * 深克隆对象
 *
 * @export
 * @function
 * @param {*} obj 需要克隆的原对象
 * @param {*} [weak=new WeakMap()]
 * @returns {*}
 */
export const deepClone = (data, weak = new WeakMap()) => {
  if (typeof data !== "object" || data === null) return data;
  let result;
  const Constructor = data.constructor;
  switch (Constructor) {
    case RegExp:
      result = new Constructor(data);
      break;
    case Date:
      result = new Constructor(data.getTime());
      break;
    default:
      if (weak.has(data)) return weak.get(data);
      result = new Constructor();
      weak.set(data, result);
  }
  for (let key in data) {
    result[key] = isObject(data[key]) ? deepClone(data[key], weak) : data[key];
  }
  return result;
};

/**
 * 合并对象
 *
 * @export
 * @function
 * @param {*} target 合并的目标对象
 * @param {*} args 其余对象
 */
export const extend = (target, ...args) => Object.assign(target, ...args);

/**
 * 根据保留/删除类型过滤字段
 *
 * @function
 * @param {*} type 过滤类型，keep/remove
 * @returns {object}
 */
const filterKeys = (type) => (obj, keys = []) =>
  Object.keys(obj).reduce((acc, key) => {
    if (type === "keep" ? keys.includes(key) : !keys.includes(key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});

/**
 * 保留给定字段
 *
 * @export
 * @function
 * @param {object} obj 目标对象
 * @param {*} [keys=[]] 需要保持的子段key列表
 * @returns {object}
 */
export const keepKeys = filterKeys("keep");

/**
 * 删除给定字段
 *
 * @export
 * @function
 * @param {object} obj 目标对象
 * @param {*} [keys=[]] 需要移除的子段key列表
 * @returns {object}
 */
export const removeKeys = filterKeys("remove");

/**
 * 替换对象字段名
 *
 * @export
 * @function
 * @param {*} obj 目标对象
 * @param {*} [rule={}] 键值对，key 为 原字段，value为替换字段
 * @returns {object}
 */
export const replaceKeys = (obj, rules = {}) => {
  const keys = Object.keys(rules);
  return Object.keys(obj).reduce((acc, key) => {
    acc[keys.includes(key) ? rules[key] : key] = obj[key];
    return acc;
  }, {});
};

export default {
  clone,
  deepClone,
  extend,
  keepKeys,
  removeKeys,
  replaceKeys,
};
