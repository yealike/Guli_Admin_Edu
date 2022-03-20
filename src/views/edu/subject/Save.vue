<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a href="static/分类.xlsx">点击下载模版</a>
        </el-tag>

      </el-form-item>

      <!--
        ref="upload": 组件唯一表示
        :auto-upload 是否自动上传
        :on-success 上传成功回调
        :on-error 上传失败回调
        disabled 是否禁用按钮
        limit 文件数量限制
        action 文件上传地址

      -->
      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API+'/eduservice/subject/addSubject'"
          name="file"
          accept=".xls, .xlsx">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">上传到服务器
          </el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Save',
  data() {
    return {
      BASE_API: process.env.BASE_API,// 接口API地址
      importBtnDisabled: false, // 按钮是否禁用
      loading: false
    }
  },
  methods: {
    // 点击按钮上传文件到接口里面
    submitUpload() {
      this.importBtnDisabled = true
      this.loading = true
      this.$refs.upload.submit()
    },
    // 上传成功回调
    fileUploadSuccess() {
      // 提示信息
      this.loading = false
      this.$message({
        type: 'success',
        message: '添加课程分类成功'
      })
      // 跳转课程分类列表
      this.$router.push('/subject/list')
    },

    // 上传失败回调
    fileUploadError() {
      this.loading = false
      this.$message({
        type: 'error',
        message: '添加失败'
      })
    }
  }
}
</script>

<style scoped>

</style>
