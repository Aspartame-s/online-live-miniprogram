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
      type: Number,
      value: 0
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
    bofang: function () {
      if (this.data.subFlag == 1) {
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
      } else if (this.data.subFlag == 0) {
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
      let videoplay = wx.createVideoContext('videoContent', this)
      if (e.detail.fullScreen) {
        videoplay.play()
      } else {
        videoplay.pause()
      }
    }
  }
})
