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
        const sessionKey = encodeURIComponent(wx.getStorageSync('sessionKey'))
        const openid = encodeURIComponent(wx.getStorageSync('openid'))
        // 存储到loaclstorage
        wx.setStorageSync('signature', res.signature)
        wx.setStorageSync('rawData', res.rawData)
        const signature = encodeURIComponent(wx.getStorageSync('signature'));
        const rawData = encodeURIComponent(wx.getStorageSync('rawData'))
        userInfo(`wx/user/info?sessionKey=${sessionKey}&signature=${signature}&rawData=${rawData}&encryptedData=${encryptedData}&iv=${iv}&jwt=${jwt}&openid=${openid}`).then(rr => {
          // console.log(rr)
          console.log('更新数据', rr)
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
      title: '苏e学堂小程序',
      content:'1.0',
      showCancel:false
    })
  },
  // 关于我们
  showAbout(){
    wx.showModal({
      title: '苏e学堂',
      content:'2022年8月，江苏省电化教育馆推出的非学科类公益直播“苏e直播”上线啦!美术、音乐、书法、舞蹈、表演、手工、甜品制作、主持、体育……。“苏e直播”坚持公益属性，通过一节节超嗨直播，一门门好玩的课程，结合“双减”、课后服务、城乡义务教育均衡，以新媒体、新技术为小朋友们提供优质数字教育资源。',
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