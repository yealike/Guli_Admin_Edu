import request from '@/utils/request'

const course_api = '/eduservice/course'
export default {
  // 添加课程信息
  addCourseInfo(courseInfo) {
    return request({
      url: `${course_api}/addCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  },

  // 根据课程id查询课程基本信息
  getCourseInfoById(id) {
    return request({
      url: `${course_api}/getCourseInfo/${id}`,
      method: 'get'
    })
  },
  // 修改课程信息
  updateCourseInfo(courseInfo) {
    return request({
      url: `${course_api}/updateCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  },
  // 课程确认信息显示
  getPublishCourseInfo(id) {
    return request({
      url: `${course_api}/getPublishCourseInfo/${id}`,
      method: 'get'
    })
  },
  // 课程最终发布
  publishCourse(id) {
    return request({
      url: `${course_api}/publishCourse/${id}`,
      method: 'post'
    })
  },
  //  课程列表
  getCourseList(page, limit, courseQuery) {
    return request({
      url: `${course_api}/courseList/${page}/${limit}`,
      method: 'post',
      data: courseQuery
    })
  },
  // 根据id删除课程
  deleteCourseById(id){
    return request({
      url: `${course_api}/${id}`,
      method: 'delete'
    })
  }
}
