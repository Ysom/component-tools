import { removeKeys } from "../object";

const Store = window.localStorage;
const storeMap = new Map();

/**
 * 创建指定命名空间的本地存储对象
 *
 * @param {string} [namespaced="ystore"] 命名空间字符串标识
 * @return {Storage} Storage工具类实例
 */
function localStore(namespaced = "ystore") {
  if (storeMap.has(namespaced)) {
    return storeMap.get(namespaced);
  }
  storeMap.set(namespaced, new Storage(namespaced));
  return storeMap.get(namespaced);
}

/**
 * 提供命名空间的localStorage工具类
 *
 * @class
 */
class Storage {
  constructor(namespaced) {
    this.namespaced = namespaced;
    this.state = {};
    this.init();
  }

  /**
   * 初始化本地存储
   *
   * @memberof Storage
   */
  init() {
    try {
      const data = Store.getItem(this.namespaced);
      if (data) {
        this.state = JSON.parse(data);
      }
      this.saveState();
    } catch (err) {
      this.state = {};
      this.saveState();
    }
  }

  /**
   * 保存数据到指定命名空间的本地存储
   *
   * @memberof Storage
   */
  saveState() {
    Store.setItem(this.namespaced, JSON.stringify(this.state));
  }

  /**
   * 需要保存到当前命名空间下的本地存储数据
   *
   * @param {*} key 保存数据的key
   * @param {*} data 保存数据的内容
   * @return {*}
   * @memberof Storage
   */
  setItem(key, data) {
    this.state[key] = data;
    this.saveState();
    return this.state;
  }

  /**
   * 获取当前命名空间下的指定的本地存储的数据
   *
   * @param {*} key 要获取数据的key
   * @return {*}
   * @memberof Storage
   */
  getItem(key) {
    return this.state[key];
  }

  /**
   * 需要删除当前命名空间下的本地存储数据
   *
   * @param {*} key 需要删除数据的key
   * @return {*}
   * @memberof Storage
   */
  removeItem(key) {
    this.state = removeKeys(this.state, [key]);
    this.saveStatei();
    return this.state;
  }

  /**
   * 清空当前命名空间下的所有本地存储数据
   *
   * @memberof Storage
   */
  clear() {
    this.state = {};
    Store.removeItem(this.namespaced);
  }
}

export default localStore;
