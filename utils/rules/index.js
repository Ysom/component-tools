/**
 * Rules正则表达式
 * @module Rules
 */

/**
 * 根据正则表达式判断属于哪个平台
 *
 * @function
 * @param {Regexp} regexp 正则表达式
 */
const isPlatform = (regexp) => {
  return () => regexp.test(navigator.userAgent);
};

/**
 * 是否为手机
 *
 * @function
 * @returns {boolean}
 */
export const isMobile = isPlatform(
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
);

/**
 * 是否为手机
 *
 * @function
 * @returns {boolean}
 */
export const isPc = () => !isMobile();

/**
 * 是否为iOS
 *
 * @function
 * @returns {boolean}
 */
export const isIOS = isPlatform(/\(i[^;]+;( U;)? CPU.+Mac OS X/gi);

/**
 * 是否为iPad
 *
 * @function
 * @returns {boolean}
 */
export const isIPad = isPlatform(/iPad/gi);

/**
 * 是否为安卓
 *
 * @function
 * @returns {boolean}
 */
export const isAndroid = isPlatform(/android|adr/gi);

/**
 * 是否为谷歌浏览器
 *
 * @function
 * @returns {boolean}
 */
export const isChrome = isPlatform(/Chrome/i);

/**
 * 是否为火狐浏览器
 *
 * @function
 * @returns {boolean}
 */
export const isFirefox = isPlatform(/Firefox/i);

/**
 * 是否为Safari浏览器
 *
 * @function
 * @returns {boolean}
 */
export const isSafari = isPlatform(/Safari/i);

/**
 * 是否为微信浏览器
 *
 * @function
 * @returns {boolean}
 */
export const isMicroMessenger = isPlatform(/MicroMessenger/i);

/**
 * 是否为QQ浏览器
 *
 * @function
 * @returns {boolean}
 */
export const isQQBrowser = isPlatform(/qq/gi);

/**
 * 是否为微博
 *
 * @function
 * @returns {boolean}
 */
export const isWeibo = isPlatform(/weibo/gi);

/**
 * 是否为指定条件的设备
 *
 * @function
 * @param {Regexp} regexp 需要判断设备的正则表达式
 * @returns {boolean}
 */
export const isDevice = (regexp) => isPlatform(regexp);

/**
 * 是否匹配提供的正则表达式规则
 *
 * @export
 * @param {*} rule 用于校验的正则表达式
 * @return {boolean} 校验的结果
 */
export function isRule(rule) {
  return (val) => rule.test(val);
}

/**
 * 是否为合法链接
 * @function
 * @returns {boolean}
 */
export const isLink = isRule(
  /((https|http|ftp|rtsp|mms)?:\/\/)(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)/
);

/**
 * 是否为合法邮箱
 * @function
 * @returns {boolean}
 */
export const isEMail = isRule(
  /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
);

/**
 * 是否为合法手机号码
 * @function
 * @returns {boolean}
 */
export const isTel = isRule(/^(\+?0?86-?)?1(3|4|5|6|7|8|9)\d{9}$/);

/**
 * 是否为合法固话
 * @function
 * @returns {boolean}
 */
export const isLandline = isRule(/^(\d{3,4}-)?\d{7,8}$/);

/**
 * 是否为合法身份证
 * @function
 * @returns {boolean}
 */
export const isIdCard = isRule(/(^\d{15}$)|(^\d{17}([0-9xX])$)/);

/**
 * 是否为合法QQ
 * @function
 * @returns {boolean}
 */
export const isQQ = isRule(/^[1-9][0-9]{4,11}$/);

/**
 * 是否为合法微信
 * @function
 * @returns {boolean}
 */
export const isWechat = isRule(/^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/);

/**
 * 是否为邮政编码
 * @function
 * @returns {boolean}
 */
export const isPost = isRule(/^[1-9]\d{5}(?!\d)$/);

/**
 * 是否为汉字
 * @function
 * @returns {boolean}
 */
export const isCharacters = isRule(/^[\u4e00-\u9fa5]+$/);
