// pages/my/my.js
const {
  userInfo,
  myCourse,
  viewCount,
  historyWacth
} = require('../../utils/http/api')
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgbaseUrl: app.globalData.imgbaseUrl,
    userInfo: '',
    hasUserInfo: '',
    sessionId: null,
    signature: null,
    rawData: null,
    // 用户头像
    avatarUrl: app.globalData.imgbaseUrl + '/my/my default.png',
    // 用户昵称
    nickName: '张三',
    // 观看次数
    viewNum: 0,
    // 我的课程
    myCourse: 0,
    // 模拟数组，来模拟历史数据
    historyList: [],
    // 判断用户是否登录
    isLogin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (wx.getStorageSync('phone')) {
      this.setData({
        isLogin: true
      })
      // 获取历史记录
      historyWacth('userwatch/history').then(res => {
        console.log('用户查看历史记录', res)
        if (!res.data.empty) {
          // 赋值
          this.setData({
            historyList: res.data.content,
            isLogin: true
          })
        } else {
          this.setData({
            isLogin: false
          })
        }
      })
    }
    // 获取用户昵称和头像
    this.setData({
      avatarUrl: wx.getStorageSync('avatarUrl'),
      nickName: wx.getStorageSync('nickName')
    })
    // 我的课程数量
    myCourse('userwatch/courses').then(res => {
      console.log('我的课程', res)
      this.setData({
        myCourse: res.data
      })
    })
    // 我的观看次数
    viewCount('userwatch/counts').then(res => {
      console.log('观看次数', res)
      this.setData({
        viewNum: res.data
      })
    })
    this.setData({
      sessionId: wx.getStorageSync('sessionId')
    })
  },
  // 跳转列表
  getMore: function () {
    wx.navigateTo({
      url: '/pages/livingList/livingList?position=my',
    })
  },

  click() {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log('成功授权', res);
        // 修改全局的登录状态
        app.globalData.isLogin = true;
        this.setData({
          isLogin: app.globalData.isLogin
        })
        console.log('用户是否登录', app.globalData.isLogin);
        // 存入sessionId jwt
        const sessionId = encodeURIComponent(wx.getStorageSync('sessionId'))
        const jwt = encodeURIComponent(wx.getStorageSync('jwt'))
        const encryptedData = encodeURIComponent(res.encryptedData)
        const iv = encodeURIComponent(res.iv)
        // 存储到loaclstorage
        wx.setStorageSync('signature', res.signature)
        wx.setStorageSync('rawData', res.rawData)
        const signature = encodeURIComponent(wx.getStorageSync('signature'));
        const rawData = encodeURIComponent(wx.getStorageSync('rawData'))
        userInfo(`wx/user/info?sessionId=${sessionId}&signature=${signature}&rawData=${rawData}&encryptedData=${encryptedData}&iv=${iv}&jwt=${jwt}`).then(rr => {
          console.log(rr)
          this.setData({
            avatarUrl: rr.data.avatarUrl,
            nickName: rr.data.nickName
          })
          wx.setStorageSync('avatarUrl', rr.data.avatarUrl)
          wx.setStorageSync('nickName', rr.data.nickName)
        })
      },
      fail: (rr) => {
        console.log('授权失败', rr)
      },
      complete: (rrr) => {
        console.log('授权完成', rrr)
      }
    })
  },
  // 点击版本信息
  showVersion(){
    wx.showModal({
      title: '苏e直播小程序',
      content:'1.0',
      showCancel:false
    })
  },
  // 关于我们
  showAbout(){
    wx.showModal({
      title: '苏e直播小程序',
      content:'苏e直播小程序介绍',
      showCancel:false
    })
  },
  // 意见反馈
  showBack(){
    wx.showModal({
      title: '如您有任何意见请反馈至',
      content:'suezhibojs@163.com',
      showCancel:false
    })
  },
  // 跳转到课程详情页
  gotoDetail(e){
    console.log(e.currentTarget);
    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail?courseId=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 设置当前在哪个页面
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3 // 根据tab的索引值设置
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})