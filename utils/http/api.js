// 引入request请求
const {
  request
} = require('./request.js')

// 基于业务封装的接口
module.exports = {
  // url,method,data,isSubDomain
  getTodayLive(url) {
    // console.log('获取当天直播')
    //第一个参数为地址，第二个参数为请求方式，第三个参数为传递的参数，第四个参数为是否需要token(默认不需要token)
    return request(url,'GET',{}); 
  },
  // 获取banner
  getBanner(url) {
    // console.log('获取bannner')
    return request(url,'GET',{}); 
  },
  // 获取正在直播
  getLiving(url){
    return request(url,'GET',{})
  },
  // 获取直播回放
  getlivingHistory(url){
    return request(url,'GET',{})
  },
  // 获取课程信息列表
  getCourseInfo(url){
    return request(url,'GET',{});
  },
  // 获取分类列表
  getCourseCategory(url){
    return request(url,'GET',{})
  },
  // 获取课程详情
  getCourseDetail(url){
    return request(url,'GET',{});
  },
  // 登录
  userLogin(url){
    return request(url,'GET',{});
  },
  // 获取用户信息接口
  userInfo(url){
    return request(url,'GET',{});
  },

  //获取用户绑定手机号信息
  userPhone(url) {
    return request(url,'GET',{});
  },

  //新增我的观看
  addUserwatch(url, data) {
    return request(url, 'POST' ,data ,true);
  },

  //我的课程
  myCourse(url) {
    return request(url,'GET',{});
  },

  //观看次数
  viewCount(url) {
    return request(url,'GET',{});
  },

  //历史记录
  historyWacth(url) {
    return request(url,'GET',{});
  },

  //根据日期
  byDate(url) {
    return request(url,'GET',{});
  }

}
