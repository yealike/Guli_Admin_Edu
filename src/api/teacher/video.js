import request from '@/utils/request'

const video_api = '/eduservice/video'
export default {
  // 添加小节
  addVideo(video) {
    return request({
      url: `${video_api}/addVideo`,
      method: 'post',
      data: video
    })
  },
  // 删除小节
  deleteVideo(id){
    return request({
      url: `${video_api}/${id}`,
      method: 'delete'
    })
  },
  // 根据id删除阿里云中的视频
  deleteAliyunVideo(id){
    return request({
      url: `/eduvod/video/removeVideo/${id}`,
      method: 'delete'
    })
  }
}
