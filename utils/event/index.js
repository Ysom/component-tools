/**
 * Event 事件工具函数，目前只支持resize事件
 *
 * @module Event
 */

import ResizeObserver from "resize-observer-polyfill";
import { getElement } from "../html";

const resizeHandler = function (entries) {
  for (let entry of entries) {
    const listeners = entry.target.__resizeListeners__ || [];
    if (listeners.length) {
      listeners.forEach((fn) => {
        fn();
      });
    }
  }
};

/**
 * 添加resize事件
 *
 * @export
 * @param {HTMLElment|string|Window} element 指定需要添加resize事件监听的元素
 * @param {Function} fn 监听resize事件的回调
 */
export function addResizeListener(element, fn) {
  const el = getElement(element, false);
  if (!el) return;
  if (!el.__resizeListeners__) {
    el.__resizeListeners__ = [];
    el.__ro__ = new ResizeObserver(resizeHandler);
    el.__ro__.observe(el);
  }
  el.__resizeListeners__.push(fn);
}

/**
 * 销毁resize事件
 *
 * @export
 * @param {HTMLElment|string|Window} element 指定需要取消resize事件监听的元素
 * @param {Function} fn 监听resize事件的回调
 */
export function removeResizeListener(element, fn) {
  const el = getElement(element, false);
  if (!el || !el.__resizeListeners__) return;
  el.__resizeListeners__.splice(el.__resizeListeners__.indexOf(fn), 1);
  if (!el.__resizeListeners__.length) {
    el.__ro__.disconnect();
  }
}

export default {
  addResizeListener,
  removeResizeListener,
};
