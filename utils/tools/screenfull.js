import { camelize } from "../string";

const ScreenFullAPIList = [
  "exitFullscreen",
  "requestFullscreen",
  "fullscreenElement",
  "fullscreenEnabled",
  "fullscreenchange",
  "fullscreenerror",
];

const ScreenfullHash = (function () {
  const prefix = ["webkit", "", "moz", "ms"];
  for (let i = 0; i < prefix.length; i++) {
    if (
      camelize(`${prefix[i]}${prefix[i] ? "-" : ""}${ScreenFullAPIList[0]}`) in
      document
    ) {
      return ScreenFullAPIList.reduce((acc, val, index) => {
        acc[val] = camelize(`${prefix[i]}-${ScreenFullAPIList[index]}`);
        return acc;
      }, {});
    }
  }
})();

/**
 * 全屏功能
 *
 * @class Screenfull 全屏功能
 */
class Screenfull {
  /**
   * 当前是否为全屏
   *
   * @readonly
   * @memberof Screenfull
   */
  get isFullScreen() {
    return document[ScreenfullHash.fullscreenElement] || docunent.fullscreen;
  }

  /**
   * 当前是否支持全屏
   *
   * @readonly
   * @memberof Screenfull
   */
  get isEnabled() {
    document[ScreenfullHash.fullscreenEnabled];
  }

  /**
   * 退出全屏
   *
   * @return {*}
   * @memberof Screenfull
   */
  exit() {
    return new Promise((resolve, reject) => {
      if (!this.isFullScreen) {
        resolve();
        return;
      }
      const exitCallback = () => {
        this.off("fullscreenchange", exitCallback);
        resolve();
      };
      this.on("fullscreenchange", exitCallback);
      resolve(document[ScreenfullHash.exitFullscreen]()).catch(reject);
    });
  }

  /**
   * 触发全屏
   *
   * @param {*} el 触发全屏的元素
   * @return {*}
   * @memberof Screenfull
   */
  request(el) {
    const element = el || document.documentElement || document.body;
    return new Promise((resolve, reject) => {
      const requestCallback = () => {
        this.off("fullscreenchange", requestCallback);
        resolve();
      };
      this.on("fullscreenchange", requestCallback);
      resolve(element[ScreenfullHash.requestFullscreen]()).catch(reject);
    });
  }

  /**
   * 开启/退出全屏
   *
   * @param {*} el 当前触发全屏的元素
   * @return {*}
   * @memberof Screenfull
   */
  toggle(el) {
    return this.isFullscreen ? this.exit() : this.request(el);
  }

  /**
   * 绑定全屏事件
   *
   * @param {*} fn 事件回调函数
   * @memberof Screenfull
   */
  onChange(fn) {
    this.on("fullscreenchange", fn);
  }

  /**
   * 绑定全屏错误事件
   *
   * @param {*} fn 错误回调
   * @memberof Screenfull
   */
  onError(fn) {
    this.on("fullscreenerror", fn);
  }

  /**
   * 监听屏幕切换事件
   *
   * @param {*} eventName 事件名称
   * @param {*} fn 触发事件回调
   * @memberof Screenfull
   */
  on(eventName, fn) {
    document.addEventListener(ScreenfullHash[eventName], fn, false);
  }

  /**
   * 取消监听屏幕切换事件
   *
   * @param {*} eventName 要背取消的事件名称
   * @param {*} fn 监听事件时对应的回调
   * @memberof Screenfull
   */
  off(eventName, fn) {
    document.removeEventListener(ScreenfullHash[eventName], fn, false);
  }
}

export default new Screenfull();
