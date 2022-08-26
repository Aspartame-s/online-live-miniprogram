// pages/courseDetail/courseDetail.js
const { getCourseDetail, addUserwatch, userPhone } = require('../../utils/http/api')
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 图片基地址
    imgbaseUrl: app.globalData.imgbaseUrl,
    courseId: '',
    // 背景图
    courseCoverUrl: '',
    // 视频地址
    videoUrl: '',
    // 是否是视频
    isVideo: true,
    // 课程介绍
    title: '',
    courseDec: '',
    // 当前是老师介绍还是课时介绍
    isCourse: true,
    // 课程列表
    courseList: [],
    // 当前课程列表是否为空
    isNull: false,
    // 老师介绍图片
    techerIntroUrl: '',
    iscontrols: false,
    // 是否拥有手机号
    hasPhone: false,
    // 是否跳转视频好=号 0==视频 1==视频号
    subFlag: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(wx.getStorageSync('phone'));
    if (wx.getStorageSync('phone')) {
      this.setData({
        hasPhone: true
      })
    }
    console.log('课程id', options);
    getCourseDetail('course/' + options.courseId + '?pageNo=0&pageSize=4').then(res => {
      console.log('课程详情', res);
      this.setData({
        courseCoverUrl: res.data.courseCoverUrl,
        videoUrl: res.data.courseIntroductionVideoUrl,
        title: res.data.courseName,
        courseDec: res.data.courseShortDesc,
        techerIntroUrl: res.data.teacherIntroductionImgUrl,
        isCourse: true,
        isNull: false
      })
      if (res.data.lessonBoPage.empty) {
        this.setData({
          isNull: true
        })
      } else {
        this.setData({
          courseList: res.data.lessonBoPage.content,
        })
      }
    })
  },
  // 返回上一层
  backTo: function () {
    wx.navigateBack({
      delta: 1
    });
  },
  // 切换课程介绍&老师介绍
  changeTab: function () {
    this.setData({
      isCourse: !this.data.isCourse
    })
  },
  //授权手机号
  async getPhoneNumber(e) {
    if (!e.detail.cloudID) {
      return
    } else {
      const encryptedData = encodeURIComponent(e.detail.encryptedData)
      const iv = encodeURIComponent(e.detail.iv)
      // const sessionId = encodeURIComponent(wx.getStorageSync('sessionId'))
      const sessionKey = encodeURIComponent(wx.getStorageSync('sessionKey'))
      const openid = encodeURIComponent(wx.getStorageSync('openid'))
      await userPhone(`wx/user/phone?sessionKey=${sessionKey}&encryptedData=${encryptedData}&iv=${iv}&openid=${openid}`).then(rrr => {
        console.log('获取用户手机号', rrr)
        wx.setStorageSync('phone', rrr.data);
        this.setData({
          hasPhone: true
        })
        console.log('已设置button隐藏')
        // this.onLoad();
      })
      var header = this.selectComponent("#zizujian")
      header.bofang()
      // this.addHistory();
    }
  },
  //判断全屏事件
  screenchange(e) {
    let videoplay = wx.createVideoContext('myVideo', this)
    if (e.detail.fullScreen) {
      videoplay.play()
    } else {
      videoplay.pause()
    }
  },
  // 控制介绍视频播放
  bofang() {
    this.videoContext = wx.createVideoContext('myVideo', this);// 	创建 video 上下文 VideoContext 对象。
    this.videoContext.requestFullScreen({	// 设置全屏时视频的方向，不指定则根据宽高比自动判断。
      direction: 90				// 屏幕正向全屏
    });
    this.setData({
      iscontrols: true
    })
  },
  // 视频结束后自动退出全屏
  endAction: function () {
    this.videoContext = wx.createVideoContext('myVideo', this);
    this.videoContext.exitFullScreen(); //退出全屏
  },
  // 点击添加一条播放记录
  addHistory: function (e) {
    // 判断当前是否是视频号跳转的页面的数据
    const abc = e.currentTarget.dataset
    console.log('课程详情判断',abc);
    if (abc.time < 0) {
    //   wx.showModal({
    //     title: '课程还未开始',
    //     content: '请稍后观看',
    //     showCancel: false
    //   })
    } else {
      // 添加记录
      let data1 = {
        "courseId": e.currentTarget.dataset.courseid,
        "lessonId": e.currentTarget.dataset.lessonid
      }
      addUserwatch('userwatch', data1).then(res => {
        console.log('记录一次课时观看记录', res);
      })
      if (abc.obj.hasOwnProperty('lessonContentUrl')) {
        console.log('播放视频')
        //播放视频
        this.setData({
          isVideo: true,
          videoUrl: abc.lessonContentUrl,
          subFlag: '0'
        })
      } else {
        console.log('跳转视频号')
        this.setData({
          isVideo: false,
          subFlag: '1'
        })
        console.log('已跳转视频号')
      }
    }
    // console.log('点击课时', e.currentTarget);
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