import { removeKeys } from "../object";

const Store = window.sessionStorage;
const storeMap = new Map();

/**
 * 创建指定命名空间的本地会话存储对象
 *
 * @param {string} [namespaced="ystore"] 命名空间字符串标识
 * @return {SessionStorage} SessionStorage工具类实例
 */
function sessionStore(namespaced = "ystore") {
  if (storeMap.has(namespaced)) {
    return storeMap.get(namespaced);
  }
  storeMap.set(namespaced, new SessionStorage(namespaced));
  return storeMap.get(namespaced);
}

/**
 * 提供命名空间的SessionStorage工具类
 *
 * @class
 */
class SessionStorage {
  constructor(namespaced) {
    this.namespaced = namespaced;
    this.state = {};
    this.init();
  }

  /**
   * 初始化本地会话存储
   *
   * @memberof SessionStorage
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
   * 保存数据到指定命名空间的本地会话存储
   *
   * @memberof SessionStorage
   */
  saveState() {
    Store.setItem(this.namespaced, JSON.stringify(this.state));
  }

  /**
   * 需要保存到当前命名空间下的本地会话存储数据
   *
   * @param {*} key 保存数据的key
   * @param {*} data 保存数据的内容
   * @return {*}
   * @memberof SessionStorage
   */
  setItem(key, data) {
    this.state[key] = data;
    this.saveState();
    return this.state;
  }

  /**
   * 获取当前命名空间下的指定的本地会话存储的数据
   *
   * @param {*} key 要获取数据的key
   * @return {*}
   * @memberof SessionStorage
   */
  getItem(key) {
    return this.state[key];
  }

  /**
   * 需要删除当前命名空间下的本地会话存储数据
   *
   * @param {*} key 需要删除数据的key
   * @return {*}
   * @memberof SessionStorage
   */
  removeItem(key) {
    this.state = removeKeys(this.state, [key]);
    this.saveState();
    return this.state;
  }

  /**
   * 清空当前命名空间下的所有本地会话存储数据
   *
   * @memberof SessionStorage
   */
  clear() {
    this.state = {};
    Store.removeItem(this.namespaced);
  }
}

export default sessionStore;
