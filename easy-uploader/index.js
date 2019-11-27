export default {
  data () {
    return {
      headers: {},
      fileList: [],
      currentFile: null
    }
  },
  props: {
    value: [String, Number],
    params: Object,
    // 上传个数限制
    limit: {
      type: Number,
      default: 1
    },
    // 文件类型 1文件  2图片 3自定义
    fileType: {
      type: Number,
      default: 1
    },
    // 自定义文件类型校验的正则规则字符串
    modeReg: {
      type: String,
      default: ''
    },
    // 上传大小限制 M
    sizeLimit: {
      type: String,
      default: '5'
    },
    btnTitle: {
      type: String,
      default: '添加附件'
    },
    btnType: {
      type: String,
      default: 'primary'
    },
    // element上传action
    action: {
      type: String,
      default: '/admin/File/upload'
    },
    // 获取文件api
    getFileApi: {
      type: String,
      default: '/admin/getFile'
    }
  },
  created () {
    if (this.value) this.refreshFileList()
  },
  watch: {
    value (val) {
      if (this.fileListIds !== val) this.refreshFileList()
    }
  },
  computed: {
    data () {
      return { ...this.params }
    },
    multiple () {
      return this.limit !== 1
    },
    isAllow () {
      return (this.limit <= 1) || (this.limit > 1 && this.fileList.length < this.limit)
    },
    fileListIds () {
      return this.fileList.map(f => f.id).join(',')
    },
    needRefreshFileList () {
      return this.fileListIds !== this.value
    }
  },
  methods: {
    preview (data) {
      if (!data.url) {
        this.$msgbox({
          title: '提示',
          type: 'warning',
          message: '链接错误！'
        })
      } else {
        window.open(data.url)
      }
    },
    refreshFileList () {
      if (this.needRefreshFileList && this.value) {
        this.$http.get(this.getFileApi, {
          params: { file_ids: this.value }
        }).then((res) => {
          const success = res.code === '0001'
          if (success) {
            this.fileList = res.data
          } else {
            this.$notify({
              message: res.msg,
              type: 'error'
            })
          }
        })
      }
    },
    // 设置上传参数 根据业务自定义
    setUploadOptions () {
      const token = sessionStorage.getItem('_t')
      this.headers.Authorization = `Bearer ${token}`
    },
    // 上传前 处理事件
    beforeUploadHandler (file) {
      this.setUploadOptions()

      if (!this.isAllow) {
        this.$msgbox({
          title: '提示',
          type: 'warning',
          message: `最多只允许上传 ${this.limit} 个文件`
        })
        return
      }

      const fileName = file.name.toLocaleLowerCase()
      // 图片正则
      const imgReg = /[^"]*(\.jpg|\.png|\.bmp|\.jpeg)/
      // 文件正则
      const fileReg = /[^"]*(\.doc|\.docx|\.xls|\.xlsx|\.csv|\.txt|\.jpg|\.png|\.bmp|\.jpeg|\.zip|\.rar|\.pdf)/
      // 生成自定义文件校验正则表达式
      const modeReg = new RegExp(this.modeReg)
      const testReg = this.fileType === 3 ? modeReg : this.fileType === 2 ? imgReg : fileReg
      if (this.fileType === 3 && this.modeReg === '') {
        this.$msgbox({
          title: '提示',
          type: 'warning',
          message: `未设置自定义文件校验规则`
        })
        return
      }
      const isLtType = testReg.test(fileName)
      const isLtLimit = file.size / 1024 / 1024 < parseInt(this.sizeLimit)
      if (!isLtType) {
        this.$msgbox({
          title: '提示',
          type: 'warning',
          message: `不支持上传 ${file.name} 的文件格式`
        })
        return
      }

      if (!isLtLimit) {
        this.$msgbox({
          title: '提示',
          type: 'warning',
          message: `文件大小超过${this.sizeLimit}M`
        })
        return
      }
      if (isLtType && isLtLimit) {
        this.$loading({text: '文件上传中...'})
      }
      return isLtType && isLtLimit
    },
    // 上传成功 回调事件
    successHandler (response, rfile, fileList) {
      this.$loading({}).close()
      const file = rfile
      const success = response.code === '0001'
      this.status = success ? 1 : 2

      if (success) {
        const fileId = response.data[0].file_id
        file.id = fileId
        const isExisted = fileList.filter(f => `${f.id}` === `${fileId}`).length > 1
        if (isExisted) {
          const index = fileList.indexOf(file)
          fileList.splice(index, 1)
        }
      } else {
        const index = fileList.indexOf(file)
        fileList.splice(index, 1)
      }

      if (success && this.multiple) {
        this.$nextTick(() => {
          this.$emit('input', fileList.filter(f => f.id).map(f => f.id).join(','))
        })
      } else if (success && !this.multiple) {
        const uploader = this.$refs.uploader
        this.currentFile = file

        uploader.fileList.splice(0, fileList.length, file)

        this.$nextTick(() => {
          this.$emit('input', `${file.id}`)
          this.$emit('getFile', file)
        })
      } else {
        this.$nextTick(() => {
          this.$emit('input', fileList.filter(f => f.id).map(f => f.id).join(','))
        })
      }

      this.fileList = fileList
    },
    // 移除文件
    removeHandler (file, fileList) {
      if (!file) {
        return
      }

      if (this.multiple) {
        this.$emit('input', fileList.filter(f => f.id).map(f => f.id).join(','))
      } else {
        this.$emit('input', '')
      }
    },
    // 文件超出限制
    exceedHandler (files, fileList) {
      this.$msgbox({
        title: '提示',
        type: 'warning',
        message: `最多只允许上传 ${this.limit} 个文件`
      })
    }
  }
}
