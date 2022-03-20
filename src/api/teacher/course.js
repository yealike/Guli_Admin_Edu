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
  }
}
