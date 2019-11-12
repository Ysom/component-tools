## 说明

- api.js基于axios进行封装，暴露出$http供使用
- utils.js是一些小工具函数集

### 使用

main.js文件引入

``` js
import Api from '@/api/api'
import Utils from '@/api/utils'

Vue.use(Api)
Vue.use(Utils)
```

组件里使用

``` vue
export default {
  data () {
    return {}
  },
  methods: {
    getData () {
      const params = {}
      this.$http.get('/getTestData', {params}).then(res => {
        ...
      })
    }
  }
}

```

