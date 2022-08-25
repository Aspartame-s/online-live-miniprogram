// pages/courseDetail/courseDetail.js
const { getCourseDetail, addUserwatch } = require('../../utils/http/api')
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
        // 
        iscontrols: false,
        // 是否拥有手机号
        hasPhone:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      if (wx.getStorageSync('phone')) {
        this.setData({
          hasPhone:true
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
                isCourse:false,
                isNull:false
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
    getPhoneNumber(e) {
      const encryptedData = encodeURIComponent(e.detail.encryptedData)
      const iv = encodeURIComponent(e.detail.iv)
      const sessionId = encodeURIComponent(wx.getStorageSync('sessionId'))
      console.log(wx.getStorageSync('phone'));
      userPhone(`wx/user/phone?sessionId=${sessionId}&encryptedData=${encryptedData}&iv=${iv}`).then(rrr => {
        console.log('获取用户手机号',rrr)
        wx.setStorageSync('phone', res.data.wxAuthUser.phone);
        this.setData({
          hasPhone: true
        })
        this.onLoad();
      })
    },
    //判断全屏事件
    screenchange(e) {
      let videoplay = wx.createVideoContext('myVideo', this)
      if(e.detail.fullScreen) {
        videoplay.play()
      }else {
        videoplay.pause()
      }
    },
    // 控制播放
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
        console.log('点击课时', e.currentTarget);
        let data1 = {
            "courseId": e.currentTarget.dataset.courseid,
            "lessonId": e.currentTarget.dataset.lessonid
        }
        addUserwatch('userwatch', data1).then(res => {
            console.log('记录一次课时观看记录', res);
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