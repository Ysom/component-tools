/**
 * Date日期时间工具函数
 *
 * @module Date
 */

import dayjs from "dayjs";

/**
 * 是否为闰年
 *
 * @export
 * @param {number} year 年
 * @return {boolean}
 */
export function isLeapYear(year) {
  return (+year % 4 === 0 && +year % 100 !== 0) || +year % 400 === 0;
}

/**
 * 是否为小月
 *
 * @export
 * @param {number} month 月份
 * @return {boolean}
 */
export function isSmallMonth(month) {
  return [4, 6, 9, 11].includes(+month);
}

/**
 * 格式化时间
 *
 * @param {string|Date|number} val 日期对象/日期字符串/时间戳秒数
 * @param {string} format 格式化格式
 * @return {string} 格式化后的时间
 */
export function formatDate(val, format = "YYYY-MM-DD HH:mm:ss") {
  return val ? dayjs(val).format(format) : "";
}

/**
 * 根据类型维度获取日期范围
 *
 * @export
 * @param {number} size 偏移量
 * @param {dayjs.OpUnitType} type 偏移维度
 * @param {number} offsetType 向左/右偏移，-1 - 左偏移  1 - 右偏移 0 - 不偏移
 * @return {Array}
 */
export function getDateRange(size = 0, type = "day", offsetType = 0) {
  const apiName = offsetType > 0 ? "add" : "subtract";
  const before = dayjs()[apiName](size, type);
  return [before.startOf(type), dayjs().endOf(type)];
}

/**
 * 格式化耗时
 *
 * @export
 * @param {number} duration 单位为秒
 * @return {String}
 */
export function formatDuration(duration, separator = "") {
  if (duration <= 60) {
    return duration < 10 ? `0${duration}` : duration + "秒";
  } else if (duration > 60 && duration < 3600) {
    let min = parseInt(duration / 60);
    min = min < 10 ? `0${min}` : min;
    let second = parseInt(duration % 60);
    second = second < 10 ? `0${second}` : second;

    const resultSecond = second + `${separator ? "" : "秒"}`;
    return min + `${separator || "分"}` + resultSecond;
  } else {
    let hour = parseInt(duration / 3600);
    hour = hour < 10 ? `0${hour}` : hour;
    let min = parseInt((duration % 3600) / 60);
    min = min < 10 ? `0${min}` : min;
    let sec = parseInt((duration % 3600) % 60);
    sec = sec < 10 ? `0${sec}` : sec;

    const strMin = min + `${separator || "分"}`;
    const strSec = sec + `${separator ? "" : "秒"}`;
    return hour + `${separator || "小时"}` + strMin + strSec;
  }
}

/**
 * 将HH:mm:ss转化为毫秒数
 *
 * @export
 * @param {string} time 时分秒 格式为HH:mm:ss
 * @return {number}
 * @example
 * formatMs('12:01:02')
 */
export function formatMs(time) {
  const timeStr = time.match(/(\d+)/g);
  const hour = +timeStr[0] * 3600000;
  const min = +timeStr[1] * 60000;
  const second = +timeStr[2] * 1000;
  return hour + min + second;
}

/**
 * 将毫秒转化为HH:mm:ss格式
 *
 * @export
 * @param {number} s 毫秒数
 * @return {string}
 * @example
 * formatMsToTime(10000)
 */
export function formatMsToTime(s) {
  if (s < 60) {
    const sec = s < 10 ? "0" + s : s;
    return `00:00:${sec}`;
  } else if (s >= 60 && s < 3600) {
    const min = parseInt(s / 60);
    const minute = min < 10 ? "0" + min : min;
    const sec = s - min * 60;
    const second = sec < 10 ? "0" + sec : sec;
    return `00:${minute}:${second}`;
  } else {
    const hour = parseInt(s / 3600);
    const hours = hour < 10 ? "0" + hour : hour;
    const min = parseInt((s - hour * 3600) / 60);
    const minute = min < 10 ? "0" + min : min;
    const sec = s - min * 60 - hour * 3600;
    const second = sec < 10 ? "0" + sec : sec;
    return `${hours}:${minute}:${second}`;
  }
}
