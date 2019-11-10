## 使用说明

- 基于element-ui
- 借助easy-page可以快速开发出具有表单查询导出、工具栏、表格和分页功能的页面

### 引入

``` js
import EasyPage from '@/components/esay-page/EasyPage'

export default {
  components: { EasyPage }
}
```

``` html
<EasyPage :formData="formData" :columns="columns" :layout="['form', 'toolbar', 'table', 'pagination', 'slot']"
          :getApi="getApi" :exportApi="exportApi">
  <template slot="form">
    <el-form-item label="表单字段">
      <el-input v-model="formData.attr"></el-input>
    </el-form-item>
  </template>
  <template slot="toolbar">
    <el-button type="primary">工具按钮</el-button>
    <el-button type="info">工具按钮</el-button>
  </template>
  <template>
    <p>这里是slot 请随意</p> 
  </template>
</EasyPage>
```

### EasyPage Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | :----: | ---- | ---- | ------ |
| layout | 页面布局 | Array | toolbar, form, table, pagination, slot | ['form','toolbar','table','pagination'] |
| getApi | 获取列表数据api | String | - | - |
| exportApi | 导出数据api | String | - | - |
| disabledExport | 禁用导出功能 | Boolean | - | false |
| formData | 表单字段 | Object | - | - |
| columns | 表格表头字段 | Array | - | - |
| tableHeight | 表格高度 | String | - | - |
| maxHeight | 表格最高高度 | String | - | - |
| rowKey | 树形表格唯一标识 | String | - | id |
| tableTreeProp | 树形表格及懒加载配置 | Object | - | {children: 'children', hasChildren: 'hasChildren'} |
