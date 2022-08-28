var app = getApp()
const { userPhone, addUserwatch } = require('../../utils/http/api')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listdata: {
      type: Object,
      value: {}
    },
    title: {
      type: String,
      value: ''
    },
    desc: {
      type: String,
      value: ''
    }
  },

  lifetimes: {
    attached() {
      const phone = wx.getStorageSync('phone')
      if (phone) {
        this.setData({
          phoneModel: false
        })
      } else {
        this.setData({
          phoneModel: true
        })
      }
    }
  },

  observers: {
    'listdata'(data) {
      this.setData({
        startTime: data.lessonStartAt.substring(11, 16)
      })
      console.log('aaaaaaa', data) // 这样就可以取到异步的值
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    startTime: '',
    imgbaseUrl: app.globalData.imgbaseUrl,
    phoneModel: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    click() {
      const { subFlag, lessonElapsedTime } = this.properties.listdata
      if(lessonElapsedTime == "0") {
        wx.showModal({
          title: '课程还未开始',
          content: '请稍后观看',
          showCancel: false
        })
        return
      }
      if (subFlag == "0") {
        this.videoContext = wx.createVideoContext('myVideo', this);// 	创建 video 上下文 VideoContext 对象。
        this.videoContext.requestFullScreen({	// 设置全屏时视频的方向，不指定则根据宽高比自动判断。
          direction: 90						// 屏幕逆时针90度
        });
      }else {
         // 订阅号跳转
         wx.openChannelsLive({
          finderUserName: 'sphfYruhmZYLxXt',
          success: res => {
            const obj = this.properties.listdata
            let data = {
              "courseId": obj.courseid,
              "lessonId": obj.lessonid,
              "liveId": obj.id,
            }
            addUserwatch('userwatch', data).then(res => {
              console.log('添加一次直播', res);
              console.log('添加次数成功')
            })
            console.log('成功打开', res);
          },
          fail: res => {
            console.log('打开失败', res);
          }
        })
      }

    },
    // 视频退出全屏
    screenchange: function (e) {
      let videoplay = wx.createVideoContext('myVideo', this)
      if (e.detail.fullScreen) {
        videoplay.play()
      } else {
        let data = {
          "courseId": this.properties.listdata.courseId,
          "lessonId": this.properties.listdata.lessonId,
          // "liveId": this.properties.liveId
        }
        addUserwatch('userwatch', data).then(res => {
          // console.log('添加一次直播', res);
        })
        videoplay.pause()
      }
    },

    //获取手机号
    getPhoneNumber(e) {
      console.log(e)
      var that = this
      if (!e.detail.cloudID) {
        return
      } else {
        const encryptedData = encodeURIComponent(e.detail.encryptedData)
        const iv = encodeURIComponent(e.detail.iv)
        const sessionKey = encodeURIComponent(wx.getStorageSync('sessionKey'))
        const openid = encodeURIComponent(wx.getStorageSync('openid'))
        userPhone(`wx/user/phone?sessionKey=${sessionKey}&encryptedData=${encryptedData}&iv=${iv}&openid=${openid}`).then(res => {
          wx.setStorageSync('phone', res.data);
          this.setData({
            phoneModel: false
          })
          this.click()
        })

      }
    }
  }
})