// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
  },
  globalData: {
    userInfo: null,
    // 是否正在加载中 false是不加载了显示正常内容
    isloading:false,
    // 判断用户是否已经授权
    isLogin:false,
    // 网络图片基地址
    imgbaseUrl:"https://sezb-1301658904.cos.ap-nanjing.myqcloud.com/view",
  }
})
