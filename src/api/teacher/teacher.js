// 引入utils中的request封装axios
import request from '@/utils/request'
import * as url from 'url'

const teacher_api = '/eduservice/teacher'
export default {
  // 讲师列表(条件查询分页)
  getTeacherListPage(current, limit, teacherQuery) {
    return request({
      //请求后端url
      url: `${teacher_api}/pageTeacherCondition/${current}/${limit}`,
      //请求方式
      method: 'post',
      //teacherQuery条件对象，后端使用RequestBody获取数据,通过json传递
      //data：表示把对象转化成json传递数据
      data: teacherQuery
    })
  },
  // 根据id删除讲师
  removeById(id) {
    return request({
      url: `${teacher_api}/${id}`,
      method: 'delete'
    })
  },
  //添加讲师
  addTeacher(teacher) {
    return request({
      url: `${teacher_api}/addTeacher`,
      method: 'post',
      data: teacher
    })
  },
  //修改讲师信息
  updateTeacher(teacher) {
    return request({
      url: `${teacher_api}/updateTeacher`,
      method: 'post',
      data: teacher
    })
  },
  // 根据id查询讲师
  selectById(id) {
    return request({
      url: `${teacher_api}/getTeacher/${id}`,
      method: 'get'
    })
  },
  //上传图片
  uploadImg(file) {
    return request({
      url: `/eduoss/fileoss/uploadAvatar`,
      method: 'post',
      data: file
    })
  }
}
