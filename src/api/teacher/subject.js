import request from '@/utils/request'

const teacher_api = '/eduservice/subject'
export default {
  // 二级分类列表
  getTree() {
    return request({
      url: `${teacher_api}/getAllSubject`,
      method: 'get'
    })
  }
}
