<template>
  <div class="app-container">

    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" :min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>

      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像 -->
<!--      <el-form-item label="讲师头像">-->

<!--        &lt;!&ndash; 头衔缩略图 &ndash;&gt;-->
<!--        <pan-thumb :image="teacher.avatar"/>-->
<!--        &lt;!&ndash; 文件上传按钮 &ndash;&gt;-->
<!--        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像-->
<!--        </el-button>-->

<!--        &lt;!&ndash;-->
<!--      v-show：是否显示上传组件-->
<!--      :key：类似于id，如果一个页面多个图片上传控件，可以做区分-->
<!--      :url：后台上传的url地址-->
<!--      @close：关闭上传组件-->
<!--      @crop-upload-success：上传成功后的回调 &ndash;&gt;-->
<!--        <image-cropper-->
<!--          v-show="imagecropperShow"-->
<!--          :width="300"-->
<!--          :height="300"-->
<!--          :key="imagecropperKey"-->
<!--          :url="BASE_API+'/oss/file/upload?host=avatar'"-->
<!--          field="file"-->
<!--          @close="close"-->
<!--          @crop-upload-success="cropSuccess"/>-->

<!--      </el-form-item>-->

      <!--修改和保存共用一个组件-->
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="addTeacher">保存</el-button>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
import teacher from '@/api/teacher/teacher'
export default {
  name: 'Save',
  data() {
    return {
      teacher: {
        name: '',
        sort: 0,
        level: 2,
        career: '',
        intro: '',
        avatar: ''
      },
      // 防止表单重复提交-判断按钮是否禁用
      saveBtnDisabled:false
    }
  },
  methods:{
    saveOrUpdate(){

    },
    // 添加教师
    addTeacher(){
      teacher.addTeacher(this.teacher)
      .then(result => {//添加成功
        // 提示信息
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
        // 回到列表页面-路由跳转
        this.$router.push('/teacher/table')
      }).catch(error => {
        console.log('添加失败！',error)
      })
    }
  }
}
</script>

<style scoped>

</style>
