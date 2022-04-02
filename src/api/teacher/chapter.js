import request from '@/utils/request'

const chapter_api = '/eduservice/chapter'
export default {
  // 1.根据课程id获取章节和小节数据列表
  getAllChapterVideo(courseId) {
    return request({
      url: `${chapter_api}/getChapterVideo/${courseId}`,
      method: 'get'
    })
  },
  // 添加章节
  addChapter(chapter) {
    return request({
      url: `${chapter_api}/addChapter`,
      method: 'post',
      data: chapter
    })
  },
  // 根据id查询章节
  getChapterById(chapterId){
    return request({
      url: `${chapter_api}/getChapter/${chapterId}`,
      method: 'get'
    })
  },
  // 修改章节
  updateChapter(chapter){
    return request({
      url: `${chapter_api}/updateChapter`,
      method: 'post',
      data: chapter
    })
  },
  // 删除章节
  deleteChapter(chapterId){
    return request({
      url: `${chapter_api}/${chapterId}`,
      method: 'delete'
    })
  }
}
