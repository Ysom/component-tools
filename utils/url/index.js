/**
 * Url链接处理工具
 * @module Url
 */

import { removeKeys } from "../object";

/**
 * 将链接参数转为JSON格式返回
 *
 * @export
 * @function
 * @param {string} url URL链接
 * @returns {object}
 */
export const getParam2Json = (url = location.href) => {
  const search = url.substring(url.lastIndexOf("?") + 1);
  const result = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (res, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    result[name] = val;
    return res;
  });
  return result;
};

/**
 * 获取链接指定字段名的值
 *
 * @export
 * @function
 * @param {Array|string} key 指定获取的字段名
 * @param {string} url URL链接
 * @returns {*} 如果参数key为数组则返回对象
 */
export const getUrlParam = (key, url = location.href) => {
  const params = getParam2Json(url);
  if (Array.isArray(key)) {
    let res = {};
    key.forEach((item) => {
      res[item] = params[item];
    });
    return res;
  } else if (typeof key === "string") {
    return params[key];
  }
  return void 0;
};

/**
 * 转换JSON为链接参数字符串
 *
 * @function
 * @param {object} json JSON格式数据
 * @returns {string}
 */
export const getJson2Param = (json) => {
  if (!json) return "";
  return Object.keys(json)
    .map((key) => {
      if (json[key] === void 0) return "";
      return `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`;
    })
    .join("&");
};

/**
 * 添加参数到链接上
 *
 * @export
 * @function
 * @param {object} [params={}] 需要添加的参数
 * @param {string} [url=location.href] 需要添加参数的URL链接
 * @returns {string}
 */
export const addParam2Url = (params = {}, url = location.href) => {
  const path = url.split("?")[0];
  let json = getParam2Json(url);
  const paramStr = getJson2Param({ ...json, ...params });
  return `${path}?${paramStr}`;
};

/**
 * 删除链接指定的参数
 *
 * @export
 * @function
 * @param {string} [url=location.href] 需要删除参数的URL链接
 * @param {string|Array} [params=""] 需要删除的参数
 * 如果为字符串时，多个参数需要用英文','分割，如果不传或者传的时空字符串或者空数组则删除全部参数
 * @returns {string}
 */
export const removeParamFromUrl = (url = location.href, params = "") => {
  const path = url.split("?")[0];
  if (!params || (Array.isArray(params) && !params.length)) return path;
  let json = getParam2Json(url);
  json = removeKeys(
    json,
    Array.isArray(params) ? params : params.match(/\b\w+\b/g)
  );
  const paramStr = getJson2Param(json);
  return paramStr ? `${path}?${paramStr}` : path;
};

export default {
  getParam2Json,
  getJson2Param,
  getUrlParam,
  addParam2Url,
  removeParamFromUrl,
};
