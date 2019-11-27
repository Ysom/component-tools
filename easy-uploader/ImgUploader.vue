<template>
  <el-upload class="img-uploader" ref="uploader" :headers="headers" :action="$urlPrefix+action" :data="data"
             name="files[]" :show-file-list="multiple" :on-success="successHandler" :on-remove="removeHandler"
             :on-exceed="exceedHandler" :on-preview="preview" :limit="limit"
             :before-upload="beforeUploadHandler" list-type="picture-card" :file-list="fileList">
    <i class="el-icon-plus"></i>
    <img v-if="imageUrl && !multiple" :src="imageUrl" class="avatar">
  </el-upload>
</template>

<script>
import upload from './index'
export default {
  name: 'ImgUploader',
  mixins: [upload]
}
</script>

<style scoped>

</style>
