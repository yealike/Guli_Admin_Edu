<template>
  <div class="app-container">
    <!--查询表单，，按条件查询-->
    <el-form :inline="true" class="demo-form-inline">

      <!--讲师姓名-->
      <el-form-item>
        <el-select v-model="courseQuery.teacherId" clearable placeholder="讲师名称">
          <div v-for="item in this.teacherInfo">
            <el-option :value="item.id" :label="item.name"/>
          </div>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-select v-model="courseQuery.status" clearable placeholder="课程状态">
          <el-option value="Normal" label="已发布"/>
          <el-option value="Draft" label="未发布"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-select
          @change="subjectLeaveOneChange"
          v-model="courseQuery.subjectParentId"
          clearable
          placeholder="一级分类">
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :value="subject.id"
            :label="subject.title"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-select
          v-model="courseQuery.subjectId"
          clearable
          placeholder="二级分类">
          <el-option
            v-for="subject in this.subjectTwoList"
            :key="subject.id"
            :value="subject.id"
            :label="subject.title"/>
        </el-select>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getSearch()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!--table表格-->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="课程名称" width="160"/>


      <el-table-column label="课程状态" width="80">
        <!--
          slot-scope="scope"表示获取当前表格
          scope.row表示获取当前行的数据
        -->
        <template slot-scope="scope">
          {{ scope.row.status === 'Normal' ? '已发布' : '未发布' }}
        </template>
      </el-table-column>
      <el-table-column prop="price" label="课程价格" width="80"/>

      <el-table-column prop="lessonNum" label="课时数" width="75"/>
      <el-table-column prop="buyCount" label="销量" width="75"/>
      <el-table-column prop="viewCount" label="浏览量" width="75"/>
      <el-table-column prop="oneSubject.title" label="一级分类"/>
      <el-table-column prop="twoSubject.title" label="二级分类"/>

      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <!--修改信息按钮-->
          <el-button
            type="primary"
            size="mini"
            @click="showUpdate(scope.row.id)"
            icon="el-icon-edit">修改
          </el-button>

          <!--删除数据按钮-->
          <el-button type="danger"
                     size="mini"
                     icon="el-icon-delete"
                     @click="removeDataById(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 分页
      @current-change="getPageList：分页切换事件，不需要手动传入当前页，
      当element感知到分页数据变化的时候会自动将页码数据传进来
     -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />

  </div>
</template>

<script>
import course from '@/api/teacher/course'
import teacher from '@/api/teacher/teacher'
import subject from '@/api/teacher/subject'

export default {
  name: 'List',
  data() {
    return {
      dialogFormVisible: false,
      listLoading: false, // 是否显示loading信息
      list: null,//查询之后接口返回集合
      page: 1,//当前页
      limit: 10,//每页记录数
      total: 0,//总记录数
      courseQuery: {//条件封装对象
        teacherId: '',
        status: '',
        subjectParentId: '',
        subjectId: ''
      },
      teacherInfo: [],
      subjectOneList: [],// 一级分类
      subjectTwoList: [] // 二级分类
    }
  },
  created() {
    // 页面渲染之前执行
    this.getList()
    this.getTeachers()
    this.getOneSubject()
  },
  methods: {
    removeDataById(data) {
      this.$confirm('确认删除【' + data.title + '】 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //调用删除方法
        course.deleteCourseById(data.id)
        .then(result => {
          this.getList()
        })
        //删除提示信息
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
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

    // 查询
    getSearch(page = 1) {
      this.page = page
      course.getCourseList(this.page, this.limit, this.courseQuery)
        .then(result => {
          this.list = result.data.data.list
          this.total = result.data.data.total
        })
    },
    // 获取讲师列表
    getTeachers() {
      teacher.getListTeacher()
        .then(result => {
          this.teacherInfo = result.data.items
        })
    },
    // 获取课程列表的方法
    getList(page = 1) {
      this.page = page
      // 为了实现分页的切换
      course.getCourseList(this.page, this.limit, this.courseQuery = {})
        .then(result => {
          this.list = result.data.data.list
          this.total = result.data.data.total
        })
    },
    // 清空表单数据
    resetData() {
      this.courseQuery = {}
      this.getList()
    }
  }
}
</script>

<style scoped>

</style>
