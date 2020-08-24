/**
 * Utils通用工具类
 * @module Utils
 */

/**
 * 节流：用于有连续事件响应，每间隔一定时间触发一次
 *
 * @param {Function} func
 * @param {number} wait 触发长度间隔时间
 * @param {boolean} leading  leading=false首次不会触发(如果触发了多次)
 * @returns {function}
 */
export const throttle = (func, interval, leading) => {
  let previous = 0;
  let timer = null;
  const handler = function (context, args) {
    func.apply(context, args);
  };
  return function () {
    const now = Date.now();
    if (!previous && leading === false) {
      previous = now;
    }
    const remaining = interval - (now - previous);
    timer && clearTimeout(timer);
    if (remaining <= 0) {
      previous = now;
      handler(this, arguments);
    } else {
      timer = setTimeout(handler, remaining, this, arguments);
    }
  };
};

/**
 * 防抖：用于连续事件触发结束后只触发一次
 *
 * @param {Func} func
 * @param {number} wait
 * @param {boolean} immediate 是否立即执行
 * @returns {function}
 */
export function debounce(func, wait, immediate) {
  let timer = null;
  const handler = function (context, args) {
    func.apply(context, args);
  };
  return function () {
    if (immediate && !timer) {
      handler(this, arguments);
    }
    timer && clearTimeout(timer);
    timer = setTimeout(handler, wait, this, arguments);
  };
}

/**
 * 拦截Promise处理结果以数组形式返回信息，主要用于async/await
 * 如果成功则返回的第一个元素（错误信息）为null，否则为错误信息
 *
 * @example
 * async function () {
 *    const [err, res] = await syncPromise(promiseFunc)
 *    if (!err) {
 *      // 成功
 *    } else {
 *      // 失败
 *    }
 * }
 *
 * @export
 * @param {Promise} promise 需要二次处理的Promise
 * @param {any} error 自定义错误信息
 * @returns {Array} 第一个元素为错误信息，第二个元素为返回结果
 */
export function to(promise, error) {
  return promise
    .then((data) => [null, data])
    .catch((err) => {
      if (error) {
        Object.assign(err, error);
      }
      return [err, undefined];
    });
}

/**
 * requestAnimationFrame和cancelAnimationFrame兼容封装
 * @function
 * @param {function} callback 回调函数
 */
export const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function (callback) {
    animationTimer = setTimeout(callback, 1000 / 60);
  };

/**
 * 取消requestAnimationFrame
 *
 * @function
 */
export const cancelAnimationFrame =
  window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  function () {
    clearTimeout(animationTimer);
  };

/**
 * 延时函数
 *
 * @export
 * @param {*} time 延时时长
 * @returns {Promise}
 */
export function delay(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

/**
 * 组合函数
 *
 * @export
 * @param {*} args 函数列表
 * @returns {Function}
 */
export function compose(...args) {
  const start = args.length - 1; // 倒序调用
  return function () {
    let i = start;
    let result = args[start].apply(this, arguments);
    while (i--) result = args[i].call(this, result);
    return result;
  };
}

/**
 * 复制到剪切板
 *
 * @export
 * @param {string} str 需要复制的文本
 * @returns {Promise}
 */
export function copy(str) {
  return new Promise((resolve, reject) => {
    const el = document.createElement("textarea");
    el.value = str;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    const selected =
      document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false;
    el.select();
    let isSuccess = false;
    if (document.execCommand && document.execCommand("copy")) {
      document.execCommand("copy");
      document.body.removeChild(el);
      isSuccess = true;
    }
    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }
    isSuccess ? resolve() : reject("当前浏览器不支持复制API");
  });
}

/**
 * 动态加载js文件
 *
 * @export
 * @function
 * @param {string} url 动态加载的js url地址
 * @returns {Promise}
 */
export const loadJs = (url) =>
  new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    if (script.readyState) {
      script.onreadystatechange = function () {
        if (
          script.readyState === "loaded" ||
          script.readyState === "complete"
        ) {
          script.onreadystatechange = null;
          resolve();
        }
      };
    } else {
      script.onload = function () {
        resolve();
      };
    }
    script.onerror = function () {
      reject();
    };
    script.src = url;
    document.body.appendChild(script);
  });

/**
 * 生成随机数
 *
 * @export
 * @param {number} [len=6] 随机数的长度
 * @return {string}
 */
export function randomString(len = 6) {
  // 生成随机名
  const chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  const maxPos = chars.length;
  let pwd = "";
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

/**
 * base64转File
 *
 * @export
 * @param {string} dataurl base64字符串
 * @param {string} [filename='filename'] 生成File对象的名称
 * @return {File} 返回转化后的File对象
 */
export function dataURLtoFile(dataurl, filename = "filename") {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], `${filename}.${mime.split("/")[1]}`, { type: mime });
}

/**
 * 下载文件
 *
 * @param {string} path - 下载地址/下载请求地址。
 * @param {string} name - 下载文件的名字（考虑到兼容性问题，最好加上后缀名）
 * @return {*}
 */
export function downloadFile(path, name = "file") {
  const xhr = new XMLHttpRequest();
  xhr.open("get", path);
  xhr.responseType = "blob";
  xhr.send();
  xhr.onload = function () {
    if (this.status === 200 || this.status === 304) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(this.response);
      fileReader.onload = function () {
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = this.result;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
    }
  };
}

/**
 * 空函数
 *
 * @export
 */
export function noop() {}

export default {
  throttle,
  debounce,
  syncPromise,
  requestAnimationFrame,
  cancelAnimationFrame,
  delay,
  compose,
  copy,
  loadJs,
  randomString,
  downloadFile,
  noop,
};
