/**
 * HTML相关工具函数
 *
 * @module HTML
 */

import { requestAnimationFrame, cancelAnimationFrame } from "../tools";
import { isElement, isString } from "../type";

const body = document.documentElement || document.body;

/**
 * 获取元素
 *
 * @function
 * @param {Element|string} el 需要获取的元素
 * @param {boolean} root window是否转为body
 * @returns {Element|Null}
 */
export const getElement = (el, root = true) => {
  if (el instanceof Window) {
    return root ? body : window;
  } else if (isElement(el)) {
    return el;
  } else if (isString(el)) {
    const currentEl = document.querySelector(el);
    return isElement(currentEl) ? currentEl : null;
  }
  console.warn("当前元素不存在");
  return null;
};

/**
 * 获取元素的样式
 *
 * @export
 * @function
 * @param {HTMLElement|string|Window} el 元素
 * @param {string} style 指定要获取样式子段的样式值
 * @returns {*}
 */
export const getStyle = (el, style) => {
  const currentEl = getElement(el);
  if (!currentEl) return;
  return currentEl.currentStyle
    ? currentEl.currentStyle[style]
    : getComputedStyle(currentEl)[style];
};

/**
 * 判断一个元素是否为另一个元素的子元素
 *
 * @export
 * @function
 * @param {*} parent 容器元素
 * @param {*} child 子元素
 * @returns {boolean}
 */
export const elementContains = (parent, child) => {
  const childEl = getElement(child);
  const parentEl = getElement(parent);
  if (!childEl || !parentEl) return;
  return parentEl.contains(childEl);
};

/**
 * 获取元素相对父元素的距离
 *
 * @export
 * @function
 * @param {HTMLElement|string|Window} el 目标元素
 * @param {HTMLElement|string|Window} parent 目标元素比较的上级元素
 * @returns {number}
 */
export const getElementOffsetTop = (el, parent = body) => {
  const currentEl = getElement(el);
  const parentEl = getElement(parent);
  if (!currentEl || !parentEl) return;
  if (!elementContains(parentEl, currentEl)) {
    console.warn("目标元素属于提供元素的子元素");
    return;
  }
  let isSetPosition = false;
  if (getStyle(parentEl, "position") === "staic") {
    parentEl.style.position = "relative";
    isSetPosition = true;
  }
  let offsetTop = currentEl.offsetTop;
  let p = currentEl.offsetParent;
  while (p && p !== parentEl && parentEl.contains(p)) {
    if (navigator.userAgent.indexOf("MSIE 8.0") === -1) {
      offsetTop += p.clientTop;
    }
    offsetTop += p.offsetTop;
    p = p.offsetParent;
  }
  if (isSetPosition) {
    parentEl.style.position = "static";
  }
  return offsetTop;
};

/**
 * 设置元素滚动
 *
 * @export
 * @function
 * @param {HTMLElement|string|Window} [el=body] 滚动条所在元素
 * @param {number} position 目标位置
 * @param {boolean} [isAnimate=true] 是否使用动画
 */
export const scrollTo = (el = body, position, isAnimate = true) => {
  // offset > 0 => 目标位置再窗口顶部的上方
  // offset < 0 => 目标位置再窗口顶部的下方
  const currentEl = getElement(el);
  if (!currentEl) return;
  const step = position - currentEl.scrollTop > 0 ? 20 : -20;
  let requestId = null;
  function scrollHandler() {
    if (isAnimate && step * (position - currentEl.scrollTop) > 0) {
      if (step * (position - currentEl.scrollTop) > 0) {
        currentEl.scrollTop += step;
        requestId = requestAnimationFrame(scrollHandler);
      } else {
        cancelAnimationFrame(requestId);
      }
    } else {
      currentEl.scrollTop = position;
    }
  }
  scrollHandler();
};

/**
 * 让目标元素滚动到滚动元素的可视范围
 *
 * @export
 * @function
 * @param {HTMLElement|string|Window} target 要滚动到的目标元素
 * @param {HTMLElement|string|Window} [el=body] 滚动元素
 * @param {boolean} [isAnimate=true]
 */
export const scrollToTarget = (target, el = body, isAnimate = true) => {
  const currentEl = getElement(el);
  const targetEl = getElement(target);
  if (!currentEl || !targetEl) return;
  const offsetTop = getElementOffsetTop(targetEl, currentEl);
  if (offsetTop === null) {
    console.warn("目标元素属于提供元素的子元素");
  } else {
    scrollTo(currentEl, offsetTop, isAnimate);
  }
};

/**
 * 滚动到顶部
 *
 * @export
 * @function
 * @param {HTMLElement|string|Window} [el=body] 滚动元素
 * @param {boolean} [isAnimate=true] 是否启动动画
 */
export const scrollToTop = (el = body, isAnimate = true) => {
  const currentEl = getElement(el);
  if (!currentEl) return;
  scrollTo(currentEl, 0, isAnimate);
};

/**
 * 滚动到底部
 *
 * @export
 * @function
 * @param {HTMLElement|string|Window} [el=body] 滚动元素
 * @param {boolean} [isAnimate=true] 是否启动动画
 */
export const scrollToBottom = (el = body, isAnimate = true) => {
  const currentEl = getElement(el);
  if (!currentEl) return;
  scrollTo(currentEl, currentEl.scrollHeight, isAnimate);
};

/**
 * 判断className类型格式是否正确
 *
 * @function
 * @param {*} el 要校验元素
 * @param {*} className 类名称字符串
 * @return {*}
 */
const checkClassNameType = (el, className) => {
  const currentEl = getElement(el);
  if (!currentEl) return;
  if (className && !isString(className)) {
    console.warn("类名必须为字符串请不能为空");
    return;
  }
  const name = className.match(/\b\w+\b/g) || [];
  return name[0] || "";
};

/**
 * 为元素添加类名
 *
 * @export
 * @function
 * @param {HTMLElement|string|Window} el 要添加类的元素
 * @param {string} className 为指定元素添加的类名
 */
export const addClass = (el, className) => {
  const xlassName = checkClassNameType(el, className);
  if (!xlassName) return;
  if (el.classList) {
    el.classList.add(xlassName);
  } else {
    const list = el.className.match(/\b\w+\b/g) || [];
    list.push(xlassName);
    el.className = list.join(" ");
  }
};

/**
 * 移除元素的类名
 *
 * @export
 * @function
 * @param {HTMLElement|string|Window} el 要移除类的元素
 * @param {string} className 为指定元素移除的类名
 */
export const removeClass = (el, className) => {
  const xlassName = checkClassNameType(el, className);
  if (!xlassName) return;
  if (el.classList) {
    el.classList.remove(xlassName);
  } else {
    const list = el.className.match(/\b\w+\b/g) || [];
    el.className = list.filter((item) => item !== xlassName).join(" ");
  }
};

/**
 * 判断是否含有某个类
 *
 * @export
 * @function
 * @param {HTMLElement|string|Window} el 判断元素是否有某个类名
 * @param {string} className 要判断的类名
 * @returns {boolean}
 */
export const hasClass = (el, className) => {
  const xlassName = checkClassNameType(el, className);
  if (!xlassName) return false;
  if (el.classList) {
    return el.classList.contains(xlassName);
  }
  let list = el.className.match(/\b\w+\b/g) || [];
  return list.includes(xlassName);
};

export default {
  getElement,
  getStyle,
  getElementOffsetTop,
  elementContains,
  scrollTo,
  scrollToTop,
  scrollToBottom,
  scrollToTarget,
  addClass,
  removeClass,
  hasClass,
  loadJs,
};
