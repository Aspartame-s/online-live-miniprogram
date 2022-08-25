var app = getApp()
const { addUserwatch } = require('../../utils/http/api')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    liveList: {
      type: Array,
    },
    isShowTeacher: {
      type: Boolean,
      value: true
    },
    // 判断是否显示查看回放
    isHuifang: {
      type: Boolean || String,
      value: false
    },
    // 图片地址
    imgUrl: String,
    // 视频链接
    videoUrl: String,
    // 课时名称
    lessonName: String,
    // 短描述
    shortDec: String,
    // 老师图片
    teacherImg: String,
    // 老师名字
    teacherName: String,
    // 已经播放时间
    lessonElapsedTime: String,
    // 历史回放样式
    history: {
      type: String,
      value: ''
    },
    // 是否是视频
    isVideo: {
      type: Boolean || String,
      value: false
    },
    // 是否显示时间直播开始时间
    isTime: {
      type: String,
      value: false
    },
    // 直播开始时间
    startTimes: {
      type: String,
      value: ''
    },
    // 是否是回放的列表
    isHuifangHead: {
      type: Boolean,
      value: false
    },

    courseId: {
      type: String,
      value: ''
    },
    lessonId: {
      type: String,
      value: ''
    },

    // 格式化好的时间
    times:'',
    // 判断是视频号还是视频
    subflag:'',
    times:''

  },

  /**
   * 组件的初始数据
   */
  data: {
    // 显示视频播放控件
    iscontrols: false,
    //  图片基路径
    imgbaseUrl: app.globalData.imgbaseUrl
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转直播回放列表
    intoHistory: function (e) {
      console.log('直播回放', e.currentTarget);
    },
    bofang: function () {
      console.log('bofang')
      this.videoContext = wx.createVideoContext('myVideo', this);// 	创建 video 上下文 VideoContext 对象。
      this.videoContext.requestFullScreen({	// 设置全屏时视频的方向，不指定则根据宽高比自动判断。
        direction: 90						// 屏幕逆时针90度
      });
      this.setData({
        iscontrols: true
      })
      console.log(this.properties.subflag);
      if (this.properties.subflag == '1') {
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
      } else if (this.properties.subflag == '0') {
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
    screenchange: function (e) {
      let data1 = {
        "courseId": this.data.courseId,
        "lessonId": this.data.lessonId
      }
      let videoplay = wx.createVideoContext('myVideo', this)
      if (e.detail.fullScreen) {
        videoplay.play()
        addUserwatch('userwatch', data1).then(res => {
          console.log('添加一次直播', res);
        })
      } else {
        videoplay.pause()
      }
    }
  }
})
