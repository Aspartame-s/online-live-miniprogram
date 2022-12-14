// components/liveListH/liveListH.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  // 在组件外调用的类名
  externalClasses: ['todayLivelist'],
  properties: {
    // 传递过来的总数据
    liveList: {
      type: Array
    },
    // 图片地址
    imgUrl: String,
    // 课时名称
    lessonName: String,
    // 短描述
    shortDec: String,
    // 老师图片
    teacherImg: String,
    // 老师名字
    teacherName: String,
    // 是否显示老师
    isShowTeacher: {
      type: Boolean,
      value: true
    },
    // 观看人数
    lessonViewCount: Number || String,
    // 是否是视频
    isVideo: {
      type: Boolean,
      value: false
    },
    // 视频地址
    videoUrl: String,
    // 判断是视频号还是视频
    subFlag: {
      type: String,
      value: '0'
    },
    times:{
      type:String,
      value:''
    },
    obj: {
      type: Object,
      value: {}
    }
  },
  observers: {
    'liveList': function () {

    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    startTime: [],
    isloading: app.isloading,
    imgbaseUrl: app.globalData.imgbaseUrl
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击播放按钮
    bofang: function (e) {
      console.log(this.properties.obj);
      const obj = this.properties.obj
      // if(obj) {
        if(obj.lessonElapsedTime <= 0) {
          wx.showModal({
            title: '课程还未开始',
            content: '请稍后观看',
            showCancel: false
          })
          return
        }
      // }
      
      if (this.properties.subFlag == '1') {
        // 订阅号跳转
        wx.openChannelsLive({
          finderUserName: 'sphfYruhmZYLxXt',
          success: res => {
            console.log('成功打开', res);
          },
          fail: res => {
            console.log('打开失败', res);
          }
        })
      } else{
        // 视频播放
        this.videoContext = wx.createVideoContext('myVideo', this);// 	创建 video 上下文 VideoContext 对象。
        this.videoContext.requestFullScreen({	// 设置全屏时视频的方向，不指定则根据宽高比自动判断。
          direction: 90						// 屏幕逆时针90度
        });
        this.setData({
          iscontrols: true
        })
      }
    },
    // 视频结束后自动退出全屏
    endAction: function () {
      this.videoContext = wx.createVideoContext('myVideo', this);
      this.videoContext.exitFullScreen(); //退出全屏
    },
    // 视频退出全屏
    screenchange(e) {
      let videoplay = wx.createVideoContext('myVideo', this)
      if (e.detail.fullScreen) {
        videoplay.play()
      } else {
        videoplay.pause()
      }
    },
  }
  // 手机号授权
  // if(lessonElapsedTime < 0) {
  //   wx.showToast("课程还未开始，请稍后观看")
  // } else {
  //   if(Objects.hasKey(lessonContentUrl)) {
  //     //播放视频
  //   } else {
  //     跳转视频号
  //   }
  // }
})
