import request from '@/utils/request'

export default {
  // 生成统计数据
  createStaData(day) {
    return request({
      url: `/statistics/statistics/registerCount/${day}`,
      method: 'post'
    })
  },

  // 获取统计数据
  getDataStatistics(searchObj){
    return request({
      url: `/statistics/statistics/showData/${searchObj.type}/${searchObj.begin}/${searchObj.end}`,
      method: 'get'
    })
  }

}
