<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <!--步骤条-->
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"></el-step>
      <el-step title="创建课程大纲"></el-step>
      <el-step title="最终发布"></el-step>
    </el-steps>

    <!--表单-->
    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder="示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!--
          所属分类
          subjectParentId 一级分类id
       -->
      <el-form-item label="课程分类">
        <el-select
          @change="subjectLeaveOneChange"
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类">
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id">
          </el-option>
        </el-select>

        <!--二级分类-->
        <el-select
          v-model="courseInfo.subjectId"
          placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id">
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number v-model="courseInfo.lessonNum"
                         :min="0"
                         controls-position="right"
                         placeholder="请填写课程的总课时数"/>
      </el-form-item>
      <!--
          课程简介
          整合富文本编辑器
       -->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <!-- 课程封面 -->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduoss/fileoss/uploadAvatar'">
          <img :src="courseInfo.cover" class="avatar-upload" :alt="courseInfo.title">
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0"
                         v-model="courseInfo.price"
                         controls-position="right"
                         placeholder="免费课程请设置为0元"/>
        元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import course from '@/api/teacher/course'
import teacher from '@/api/teacher/teacher'
import subject from '@/api/teacher/subject'
import Tinymce from '@/components/Tinymce'  //引入组件

export default {
  name: 'Info',
  components: { Tinymce },
  data() {
    return {
      courseInfo: {
        title: '',
        subjectParentId: '', // 课程一级分类id
        subjectId: '', // 课程二级分类id
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: '/static/喜羊羊.jpg',
        price: 0
      },
      courseId: '',//课程id
      saveBtnDisabled: false, // 保存按钮是否禁用
      teacherList: [], // 所有讲师数据
      subjectOneList: [],// 一级分类
      subjectTwoList: [], // 二级分类
      BASE_API: process.env.BASE_API
    }
  },
  created() {
    // 获取路由里面的id值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      //调用查询课程方法
      this.getCourseInfo()
    } else {
      // 初始化一级分类
      this.getOneSubject()
      // 初始化所有讲师
      this.getAllTeachers()
    }
  },
  // 当路由发生变化的时候，我们应该有一个监听，监听获取参数
  methods: {
    // 根据课程id查询课程信息
    getCourseInfo() {
      course.getCourseInfoById(this.courseId)
        .then(result => {
          // 包含一级分类id 和 二级分类id
          this.courseInfo = result.data.data
          // 查询所有的分类，包含一级和二级分类
          subject.getTree()
            .then(resp => {
              // 获取一级分类
              this.subjectOneList = resp.data.data
              // 把所有的一级分类数组进行遍历，比较当前courseInfo里面一级分类id和所有的一级分类id是否相等
              // for (let oneSubject in this.subjectOneList) {
              for (let i = 0; i < this.subjectOneList.length; i++) {
                let oneSubject = this.subjectOneList[i]
                if (this.courseInfo.subjectParentId === oneSubject.id) {
                  // 获取一级分类和所有的二级分类
                  this.subjectTwoList = oneSubject.children
                }
              }
            })
          // 初始化所有讲师
          this.getAllTeachers()
        })
    },
    // 上传之前回调
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过2M')
      }
      return isJPG && isLt2M
    },
    // 上传封面成功回调
    handleAvatarSuccess(res, file) {
      this.courseInfo.cover = res.data.url
    },
    // 点击某个一级分类，出发change事件，显示对应二级分类
    subjectLeaveOneChange(value) {
      // value就是一级分类的id
      // 遍历所有的分类，包含一级和二级
      for (let i = 0; i < this.subjectOneList.length; i++) {
        // 每个一级分类
        let oneSubject = this.subjectOneList[i]
        // 判断所有的一级分类id和点击的id值是否相同
        if (value === oneSubject.id) {
          // 从一级分类中获取所有的二级分类
          this.subjectTwoList = oneSubject.children
          // 把二级分类id值清空
          this.courseInfo.subjectId = ''
        }
      }
    },
    // 查询所有的一级分类
    getOneSubject() {
      subject.getTree()
        .then(result => {
          this.subjectOneList = result.data.data
        })
    },
    // 查询所有讲师
    getAllTeachers() {
      teacher.getListTeacher()
        .then(result => {
          this.teacherList = result.data.items
        })
    },
    // 添加课程
    addCourse() {
      course.addCourseInfo(this.courseInfo)
        .then(result => {
          // 提示信息
          this.$message({
            type: 'success',
            message: '添加课程信息成功！'
          })
          // 跳转到第二步
          this.$router.push({ path: '/course/chapter/' + result.data.data })
        })
    },
    // 修改课程
    updateCourse() {
      course.updateCourseInfo(this.courseInfo)
        .then(result => {
          // 提示信息
          this.$message({
            type: 'success',
            message: '修改课程信息成功！'
          })
          // 跳转到第二步
          this.$router.push({ path: '/course/chapter/' + this.courseId })
        })
    },

    // 根据课程ID判断是保存还是修改
    saveOrUpdate() {
      // 判断添加还是修改
      if (!this.courseInfo.id) {
        // 路径没有id-添加
        this.addCourse()
      } else {
        this.updateCourse()
      }
    }
  }
}
</script>
<style scoped>
.avatar-upload {
  width: 500px;
  height: 300px;
}

.tinymce-container {
  line-height: 29px;
}
</style>
