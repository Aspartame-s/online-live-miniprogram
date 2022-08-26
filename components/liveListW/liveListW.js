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
    liveId: {
      type: String,
      value: ''
    },
    // 格式化好的时间
    times: {
      type: String,
      value: ''
    },
    // 判断是视频号还是视频
    subflag: {
      type: String,
      value: ''
    },
    obj: {
      type: Object,
      value: {},
  }

  },


  observers: {
    'obj'(data) {
      console.log(data, "监听")
      // this.setData({
      //   obj1: data
      // })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    // 显示视频播放控件
    iscontrols: false,
    //  图片基路径
    imgbaseUrl: app.globalData.imgbaseUrl,
    // obj1: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转直播回放列表
    intoHistory: function (e) {
      console.log('直播回放', e.currentTarget);
    },
    testClick() {
      console.log('我是子组件')
    },
    bofang: function () {
      // console.log(this.data.obj1)
      // console.log(this.properties.obj)
      // console.log(this.properties.subflag)
      // this.videoContext = wx.createVideoContext('myVideo', this);// 	创建 video 上下文 VideoContext 对象。
      // this.videoContext.requestFullScreen({	// 设置全屏时视频的方向，不指定则根据宽高比自动判断。
      //   direction: 90						// 屏幕逆时针90度
      // });
      // this.setData({
      //   iscontrols: true
      // })
      // console.log(this.properties.subflag);
      if(this.properties.obj.lessonElapsedTime <= 0) {
        wx.showModal({
          title: '课程还未开始',
          content: '请稍后观看',
          showCancel: false
        })
        return
      }
      if (this.properties.obj.subFlag == '1') {
        // 订阅号跳转
        wx.openChannelsLive({
          finderUserName: 'sphfYruhmZYLxXt',
          success: res => {
            const obj = this.properties.obj
            // console.log('obj', this.properties.obj)
            let data = {
              "courseId": obj.courseid,
              "lessonId": obj.lessonid,
              "liveId": obj.id,
            }
            addUserwatch('userwatch', data).then(res => {
              console.log('添加一次直播', res);
              console.log('添加次数成功')
            })
            console.log('wocao')
            console.log('成功打开', res);
          },
          fail: res => {
            console.log('打开失败', res);
          }
        })
      } else if (this.properties.obj.subFlag == '0') {
        const obj = this.properties.obj
        // 视频播放
        this.videoContext = wx.createVideoContext('myVideo', this);// 	创建 video 上下文 VideoContext 对象。
        this.videoContext.requestFullScreen({	// 设置全屏时视频的方向，不指定则根据宽高比自动判断。
          direction: 90						// 屏幕逆时针90度
        });
        let data1 = {
          "courseId": obj.courseId,
          "lessonId": obj.lessonId,
          // "liveId": this.properties.liveId
        }
        addUserwatch('userwatch', data1).then(res => {
          console.log('添加一次直播', res);
        })
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
      console.log(e.currentTarget);
      console.log('退出全屏')
      
      let videoplay = wx.createVideoContext('myVideo', this)
      // console.log('userwatch', data1);
     
      if (e.detail.fullScreen) {
        videoplay.play()
      } else {
        videoplay.pause()
       
      }
    }
  }
})
