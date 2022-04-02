<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item label="日期">
        <el-date-picker
          v-model="day"
          type="date"
          placeholder="选择要统计的日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>

      <el-button
        type="primary"
        @click="create()"
        :disabled="btnDisabled">
        生成数据
      </el-button>
    </el-form>
  </div>
</template>

<script>
import sta from '@/api/sta'

export default {
  name: 'create',
  data() {
    return {
      day: '',
      btnDisabled: false
    }
  },
  created() {
  },
  methods: {
    create() {
      sta.createStaData(this.day)
        .then(result => {
          // 提示信息
          this.$message({
            type: 'success',
            message: '数据生成成功！'
          })
          // 跳转到图表显示页面
          this.$router.push({ path: '/sta/show' })
          this.btnDisabled = true
        })
    }
  }
}
</script>

<style scoped>

</style>
