<template>
  <el-upload ref="uploader" :headers="headers" :action="action" :data="data" name="files[]" show-file-list
             :on-success="successHandler" :on-remove="removeHandler" :before-upload="beforeUploadHandler"
             :file-list="fileList" list-type="card" :disabled="!isAllow" :on-preview="preview">
    <slot v-if="!disabled">
      <el-button :type="btnType">{{btnTitle}}</el-button>
      <slot name="tip"></slot>
    </slot>
  </el-upload>
</template>

<script>
import upload from './index'
export default {
  name: 'FileUploader',
  mixins: [upload]
}
</script>

<style scoped>

</style>
