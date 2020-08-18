/**
 * Array工具函数
 * @module Array
 */

import { isFunction } from "../type";
import { removeKeys } from "../object";

/**
 * 从前后遍历数组
 *
 * @param {string} [type="left"] 遍历的方向类型，left/right
 */
function forEachType(type = "left") {
  return (arr, cb) => {
    const list = type === "left" ? arr : [...arr].reverse();
    list.forEach(cb);
  };
}

/**
 * 判断是否为类数组
 *
 * @export
 * @param {*} val 需要判断的值
 * @returns {boolean}
 */
export function isArrayLike(val) {
  return "length" in val;
}

/**
 * 拉平数组
 *
 * @export
 * @param {Array} arr 需要拉平的数组
 * @param {number} [depth=1] 主要拉平的层级
 * @returns {Array} 已拉平的数组
 */
export function flatten(arr, depth = 1) {
  return arr.reduce(
    (a, v) =>
      a.concat(depth > 1 && Array.isArray(v) ? flatten(v, depth - 1) : v),
    []
  );
}

/**
 * 深度拉平数组
 *
 * @param {*} arr  需要深度拉平的数组
 * @returns {Array} 处理后的数组
 */
export function deepFlatten(arr) {
  return [].concat(...arr.map((v) => (Array.isArray(v) ? deepFlatten(v) : v)));
}

/**
 * 数组去重
 *
 * @export
 * @param {Array} arr 需要去重的数组
 * @returns {Array} 返回结果
 */
export function unique(arr) {
  return [...new Set(arr)];
}

/**
 * 取两个数组的交集
 *
 * @export
 * @param {Array} arr1 第一个数组
 * @param {Array} arr2 第二个数组
 * @returns {Array}
 */
export function intersection(arr1, arr2) {
  const arr = new Set(arr1);
  return arr2.filter((item) => arr.has(item));
}

/**
 * 取多个数组的交集
 *
 * @export
 * @param {*} args 参与数组集合
 * @returns {Array}
 * @example
 * intersectionAll(arr1, arr2, arr3, ...)
 */
export function intersectionAll(...args) {
  return args.reduce((acc, val) => intersection(val, acc));
}

/**
 * 多个元素的并集
 *
 * @export
 * @param {*} args 参与数组集合
 * @returns {Array}
 * @example
 * union(arr1, arr2, arr3, ...)
 */
export function union(...args) {
  return unique(flatten(args, 2));
}

/**
 * 两个数组的差集
 *
 * @export
 * @param {Array} arr1 第一个数组
 * @param {Array} arr2 第二个数组
 * @returns {Array}
 */
export function difference(arr1, arr2) {
  const allList = union(arr1, arr2);
  const intersectionList = intersection(arr1, arr2);
  return allList.filter((item) => !intersectionList.includes(item));
}

/**
 * 多个数组的差集
 *
 * @export
 * @param {*} args 参与数组集合
 * @returns {Array}
 * @example
 * differenceAll(arr1, arr2, arr3, ...)
 */
export function differenceAll(...args) {
  return args.reduce((acc, val) => difference(val, acc));
}

/**
 * 将单层级数组转化为树形结构
 * 说明：parentId为父元素的唯一标识，id为元素的唯一标识，默认为'id', pid为元素的父元素标识，默认为'pid'，children为要生成多层级子元素的字段名，默认为'children'
 * @export
 * @param {*} arr 一维数组
 * @param {number} [parentId=0] 父元素ID
 * @param {*} [{ id = "id", pid = "pid", children = "children" }={}]
 * @returns {Array} 返回树状结构数组
 */
export function array2Tree(
  arr,
  parentId = 0,
  { id = "id", pid = "pid", children = "children" } = {}
) {
  return arr
    .filter((item) => item[pid] === parentId)
    .map((item) => ({
      ...item,
      [children]: array2Tree(arr, item[id], { id, pid, children }),
    }));
}

/**
 * 树状结构转为一维数组
 * 说明：id为每个元素的唯一标识，默认为'id'，children为多层级的子元素列表字段，默认为'children'
 * @export
 * @param {Array} tree 树状结构
 * @param {*} [{ id = "id", pid = "pid", children = "children" }={}]
 * @returns {Array} 返回处理后的一维数组
 */
export function tree2Array(tree, { id = "id", children = "children" } = {}) {
  let list = tree.reduce((acc, item) => {
    if (Array.isArray(item[children]) && item[children].length) {
      return [...acc, item, ...tree2Array(item[children], { id, children })];
    }
    return [...acc, item];
  }, []);
  return list.map((item) => {
    return removeKeys(item, [children]);
  });
}

/**
 * 根据标识获取树状结构的数据链
 *
 * @param {*} [{
 *   id,
 *   tree = [],
 *   filter = ['id'],
 *   options = {}
 * }={}]
 * @returns {Array}
 */
export function getTreeChains({ id, tree, filter = ["id"], options = {} }) {
  let opts = {
    id: "id",
    pId: "pId",
    children: "children",
  };
  opts = { ...opts, ...options };
  let list = tree2Array(tree, {
    id: opts.id,
    children: opts.children,
  }).reverse();
  let currentId = id;
  list = list.reduce((acc, item) => {
    if (currentId === item[opts.id]) {
      const chainItem = filter.reduce((subject, key) => {
        subject[key] = item[key];
        return subject;
      }, {});
      acc.unshift(chainItem);
      currentId = item[opts.pId];
    }
    return acc;
  }, []);
  if (filter.length === 1) {
    list = list.map((item) => item[filter[0]]);
  }
  return list;
}

/**
 * 数组转为对象
 * 说明：如果数组元素为对象时指定对象的某个唯一字段为key值，没有指定则默认为下标索引值
 * @export
 * @param {Array} arr 一维数组
 * @param {string} key 作为生成对象的唯一标识key值
 * @returns {object}
 */
export function array2Object(arr, key) {
  if (!arr.length) {
    console.warn("传入数组为空");
    return null;
  }
  return arr.reduce((acc, val, index) => {
    acc[key && val[key] ? val[key] : index] = val;
    return acc;
  }, {});
}

/**
 * 类数组转为数组
 *
 * @export
 * @param {*} obj 类数组
 * @returns {Array}
 */
export function arrayLike2Array(obj) {
  if (!isArrayLike(obj)) {
    console.warn("当前传入数据不是类数组");
    return [];
  }
  return Array.from(obj);
}

/**
 * forEach 元素由 左->右 执行
 *
 * @function
 * @param {Array} arr 需要处理的数组
 * @param {Array} cb 处理子元素的回调
 */
const forEach = forEachType();

/**
 * forEach 元素由 右->左 执行
 *
 * @function
 * @param {Array} arr 需要处理的数组
 * @param {Array} cb 处理子元素的回调
 */
const forEachRight = forEachType("right");

/**
 * 根据给定长度进行分组
 *
 * @export
 * @param {Array} arr 需要分组的数组
 * @param {number} size 每组最大长度
 * @returns {Array}
 */
export function chunk(arr, size) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (item, index) =>
    arr.slice(size * index, size * (index + 1))
  );
}

/**
 * 过滤列表中的空数据
 *
 * @export
 * @param {Array} arr 需要过滤的数组
 * @returns {Array}
 */
export function compact(arr) {
  return arr.filter(Boolean);
}

/**
 * 根据条件获取元素的出现次数
 *
 * @export
 * @param {Array} arr 需要统计的数组
 * @param {function} fn 需要对元素处理的回调
 * @returns {object}
 */
export function countBy(arr, fn = (item) => item) {
  return arr
    .map((item) => (isFunction(fn) ? fn(item) : item))
    .reduce((acc, item) => {
      acc[item] = acc[item] ? ++acc[item] : 1;
      return acc;
    }, {});
}

/**
 * 获取元素的出现次数
 *
 * @export
 * @param {Array} arr 需要统计的数组
 * @param {*} val 需要统计的元素值
 * @returns {number}
 */
export function countByValue(arr, val) {
  return countBy(arr)[val];
}

/**
 * 获取指定元素的下标值
 *
 * @export
 * @param {Array} arr 需要分析的数组
 * @param {*} val 需要分析的元素值
 * @returns {Array} 包含符合的下标组成的数组
 */
export function indexOfAll(arr, val) {
  return arr.reduce(
    (acc, item, index) => (item === val ? [...acc, index] : acc),
    []
  );
}

/**
 * 随机排序
 *
 * @export
 * @param {*} arr 需要随机排序的数组
 * @returns {Array}
 */
export function shuffe(arr) {
  const list = [...arr];
  let len = list.length;
  while (len) {
    const i = Math.floor(Math.random() * len--);
    [list[len], list[i]] = [list[i], list[len]];
  }
  return list;
}

/**
 * 随机取数组中数据
 *
 * @export
 * @param {Array} arr 数组
 * @param {number} [size=1] 需要随机获取元素的个数
 * @returns {Array}
 */
export function sample(arr, size = 1) {
  const list = shuffe(arr);
  return list.slice(0, size);
}

export default {
  isArrayLike,
  flatten,
  deepFlatten,
  intersection,
  intersectionAll,
  union,
  difference,
  differenceAll,
  array2Tree,
  array2Object,
  arrayLike2Array,
  unique,
  forEach,
  forEachRight,
  chunk,
  countBy,
  countByValue,
  indexOfAll,
  shuffe,
  sample,
  getTreeChains,
};
