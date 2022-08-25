// 引入env中的url
const {
  baseUrl
} = require('./env.js').prod;
var app = getApp()
// 专属域名
let subDomain = wx.getStorageSync('jwt')
let postHeader = {
  // 'content-type': 'application/json',
  'Content-Length': 0,
  'enableCache': true,
  'jwt': subDomain
}
let getHeader ={
  'jwt': subDomain
}
// let postHeader = {
//   'content-type': 'application/x-www-form-urlencoded'
// }
// header['jwt'] = subDomain
module.exports = {
  /**二次封装wx.request()
   * url:请求的接口地址
   * method:请求方式
   * data传参
   * isSubDomain：是否需要token
   * */
  request: (url, method = 'GET', data = {}, isSubDomain = false) => {
    // let _url = `${baseUrl}/${isSubDomain ? subDomain : ''}${url}`
    let _url = `${baseUrl}/${url}`
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: "正在加载",
        mask: true
      })
      app.globalData.isloading = true;
      wx.request({
        url: _url,
        data: data,
        method: method,
        header: method=='POST || post' ? postHeader : getHeader,
        success: (res) => {
          // console.log(res)
          // console.log(subDomain)
          let { code } = res.data
          if (code == 200) {
            app.globalData.isloading = false;
            resolve(res.data)
          } else {
            // wx.showToast({
            //   title: '请登录',
            //   icon: 'error'
            // });
          }
        },
        fail: (res) => {
          console.log(res);
          wx.showToast({
            title: '数据请求失败',
            icon: 'error'
          });
        },
        complete:(res)=>{
          wx.hideLoading();
        }
      })
      
    })
  }
}
