<template>
  <div class="app-container">
    <!--查询表单，，按条件查询-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="teacherQuery.name" clearable placeholder="讲师名"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="teacherQuery.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="teacherQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="teacherQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
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

      <el-table-column prop="name" label="名称" width="80"/>

      <el-table-column label="头衔" width="80">
        <!--
          slot-scope="scope"表示获取当前表格
          scope.row表示获取当前行的数据
        -->
        <template slot-scope="scope">
          {{ scope.row.level === 1 ? '高级讲师' : '首席讲师' }}
        </template>
      </el-table-column>

      <el-table-column prop="intro" label="资历"/>

      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>

      <el-table-column prop="sort" label="排序" width="60"/>

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

    <!--嵌套表单的对话框,供修改讲师信息用-->
    <el-dialog
      title="修改信息"
      style="width: 1000px"
      :visible.sync="dialogFormVisible">
      <el-form :model="teacherData">

        <el-form-item label="讲师名称">
          <el-input v-model="teacherData.name" size="small" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="讲师排序">
          <el-input-number size="small" v-model="teacherData.sort" controls-position="right" :min="0"/>
        </el-form-item>
        <el-form-item label="讲师头衔">
          <el-select size="small" v-model="teacherData.level" clearable placeholder="请选择">
            <!--
              数据类型一定要和取出的json中的一致，否则没法回填
              因此，这里value使用动态绑定的值，保证其数据类型是number
            -->
            <el-option :value="1" label="高级讲师"/>
            <el-option :value="2" label="首席讲师"/>
          </el-select>

        </el-form-item>
        <el-form-item label="讲师资历">
          <el-input size="small" v-model="teacherData.career" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="讲师简介">
          <el-input size="small" v-model="teacherData.intro" :rows="3" type="textarea"/>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateTeacher">确 定</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import teacher from '@/api/teacher/teacher'

export default {
  name: 'List',
  data() {
    return {
      dialogFormVisible: false,
      listLoading: true, // 是否显示loading信息
      list: null,//查询之后接口返回集合
      page: 1,//当前页
      limit: 10,//每页记录数
      total: 0,//总记录数
      teacherQuery: {},//条件封装对象
      teacherData:{
        name: '',
        sort: 0,
        level: 2,
        career: '',
        intro: '',
        avatar: ''
      }
    }
  },
  created() {
    // 页面渲染之前执行
    this.getList()
  },
  methods: {
    //弹出供修改使用的对话框
    showUpdate(id){
      this.dialogFormVisible = true
      teacher.selectById(id)
      .then(result => {
        this.teacherData = result.data.data
      })
    },
    //修改讲师信息
    updateTeacher() {
      this.dialogFormVisible = false
      teacher.updateTeacher(this.teacherData)
        .then(result => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.getList()
        })
        .catch(error => {
          console.log('修改失败！', error)
        })
    },
    // 获取讲师列表的方法
    getList(page = 1) {
      // 为了实现分页的切换
      this.page = page
      teacher.getTeacherListPage(this.page, this.limit, this.teacherQuery)
        .then(response => {//请求成功
          // console.log(response)
          this.list = response.data.data
          this.total = response.data.total
          // 当数据记载完后把listLoading关闭
          this.listLoading = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 清空表单数据
    resetData() {
      this.teacherQuery = {}
      this.getList()
    },
    // 根据id删除讲师
    removeDataById(data) {

      this.$confirm('确认删除【' + data.name + '】 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //调用删除方法
        teacher.removeById(data.id)
          .then(result => {//删除成功
            // 回到列表页面
            this.getList()
          })
        //删除提示信息
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
