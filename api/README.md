## 说明

- api.js基于axios进行封装，暴露出$http供使用

### 使用

main.js文件引入

``` js
import Api from '@/api/api'

Vue.use(Api)
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

