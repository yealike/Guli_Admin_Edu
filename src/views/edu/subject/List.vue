<template>
  <div class="app-container">
    <!--检索输入框-->
    <el-input v-model="filterText"
              placeholder="搜索数据"
              style="margin-bottom:30px;"/>

    <!--树形控件-->
    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      :highlight-current="true"
    />

  </div>
</template>

<script>
import subject from '@/api/teacher/subject'
export default {
  name: 'List',
  data() {
    return {
      filterText: '',
      data2: [], //返回所有分类数据
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created() {
    this.getSubjectTree()
  },

  methods: {
    // 检索
    filterNode(value, data) {
      if (!value) return true
      return data.title.toLowerCase().indexOf(value) !== -1
    },

    // 查询分类课程
    getSubjectTree(){
      subject.getTree()
      .then(result => {
        this.data2 = result.data.data
      })
    }
  }
}
</script>

<style scoped>

</style>
