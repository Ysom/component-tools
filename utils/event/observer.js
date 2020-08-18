/**
 * Observer发布-订阅模式类
 *
 * @class
 */
class Observer {
  constructor() {
    this.list = {};
  }

  /**
   * 添加订阅
   *
   * @param {*} key 订阅的事件
   * @param {*} fn 触发订阅事件的回调
   * @memberof Observer
   */
  on(key, fn) {
    if (!this.list[key]) {
      this.list[key] = [];
    }
    this.list[key].push(fn);
  }

  /**
   * 触发订阅的事件
   *
   * @param {*} key 触发的事件
   * @param {*} params 传入订阅事件回调的参数
   * @return {*}
   * @memberof Observer
   */
  emit(key, ...params) {
    const fns = this.list[key];
    if (!fns || !fns.length) return;
    fns.forEach((fn) => {
      fn.call(this, ...params);
    });
  }

  /**
   * 销毁事件的订阅
   *
   * @param {*} key 需要销毁的事件
   * @param {*} fn 触发订阅事件的回调
   * @return {*}
   * @memberof Observer
   */
  remove(key, fn) {
    const fns = this.list[key];
    if (!fns || !fns.length) return;
    if (!fn) {
      fns = [];
    } else {
      fns = fns.filter((cb) => cb !== fn);
    }
  }
}

export default new Observer();
