### 使用说明
- 基于element-ui
- 二次封装el-upload，分文件上传和图片（卡片式）上传

``` js
import FileUploader from '@/components/easy-uploader/FileUploader'
import ImgUploader from '@/components/easy-uploader/ImgUploader'

export default {
  components: { FileUploader, ImgUploader },
  data() {
    return {
      file: '',
      img: ''
    }
  }
}
```

``` html
<file-uploader v-model="file" multiple></file-uploader>
<img-uploader v-model="img"></img-uploader>
```

### Attributes
|     参数    | 说明           | 类型  | 可选值 | 默认值 | 备注|
| ------------- |:-------------:| ----- | ----- | ----- | ----- |
| value | 上传文件的文件ID | String | - | '' | - |
| fileType | 上传文件类型 | Number | 1,2,3 | 1 | 1文件 2图片 3自定义 |
| modeReg | 自定义上传文件校验 | String | - | - | - |
| params | 上传文件时附带的参数 | Object | - | {} | - |
| limit | 最多上传文件数 | Number | - | 1 | 0 即无限制 |
| sizeLimit | 单个文件大小限制 | Number | - | 5 | 5M |
| action | 上传文件api | String | - | - | - |
| getFileApi | 获取文件api | String | - | - | - |
