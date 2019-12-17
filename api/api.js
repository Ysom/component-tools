import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import { Loading, Message } from 'element-ui'
import { filterParams } from './utils'

// 全局参数
const globalParams = {}

// 请求前缀
const prefix = ''

// header配置
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.common['Cache-Control'] = 'no-cache'

// 超时设置
axios.defaults.timeout = 12000

// loading
let loading

// 请求拦截
axios.interceptors.request.use((config) => {
  const _config = config

  // axios版本 <= 0.18.0 支持配置config.loading
  // 当前版本0.19.0 不支持配置config.loading
  // 接口loading暂存放在headers里面
  if (_config.headers.loading) {
    loading = Loading.service({text: _config.headers.loadingText || '加载中...'})
  }

  // token验证
  const token = sessionStorage.getItem('_token')
  if (token) {
    _config.headers.Authorization = token
  }

  // 请求参数处理
  if (_config.method === 'get' || _config.method === 'delete') {
    _config.params = { ...globalParams, ...filterParams(_config.params) }
  } else {
    if (_config.headers['Content-Type']) {
      const include = _config.headers['Content-Type'].indexOf('application/json') !== -1
      _config.data = include ? JSON.stringify({ ...globalParams, ...filterParams(_config.data) })
        : qs.stringify({ ...globalParams, ...filterParams(_config.data) })
    } else {
      qs.stringify({ ...globalParams, ...filterParams(_config.data) })
    }
  }

  // 请求前缀 根据场景自定义prefix
  _config.url = prefix + _config.url
  return _config
}, (error) => {
  loading.close()
  Message.error('网络错误')
  return Promise.reject(error)
})
// 响应拦截
axios.interceptors.response.use((response) => {
  const _response = response
  if (_response.config.headers.loading) {
    loading.close()
  }
  return _response.data
}, (error) => {
  loading.close()
  Message.error(error.response ? `操作失败：${error.response.status}` : '网络错误')
  return Promise.reject(error)
})

function install (v) {
  const vue = v
  if (vue.prototype.$http) {
    return
  }
  vue.prototype.$http = axios
}

export default {
  install
}
