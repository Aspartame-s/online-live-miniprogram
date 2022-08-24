const {
  getTodayLive,
  addUserwatch,
  userPhone
} = require('../../utils/http/api');
const utils = require('../../utils/util');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 获取到日历的点击的日期
    clickDate: {
      type: String,
    },
    isHuifangHead: Boolean,
  },
  observers: {
    'clickDate': function () {
      let date;
      console.log('courseLive里面的时间', this.properties.clickDate);
      console.log(this.properties.clickDate);
      if (this.properties.clickDate == '') {
        date = this.data.today
      } else {
        date = this.properties.clickDate
      }
      // console.log(date);
      // console.log('lesson/by-date/' + date);
      getTodayLive('lesson/by-date/' + date).then(res => {
        console.log('根据时间获取到的直播列表', res);
        console.log(res.hasOwnProperty('data'));
        if (res.hasOwnProperty('data')) {
          if (res.data.length === 1) {
            this.setData({
              isOne: true,
              liveList: res.data,
              isNull: false
            })
          } else if (res.data.length > 1) {
            this.setData({
              liveList: res.data,
              isOne: false,
              isNull: false
            })
            console.log('指定日期课程列表', this.data.liveList);
          }
        } else {
          // 数据为空状态
          this.setData({
            isNull: true
          })
        }
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    // 判断是否是一条数据
    isOne: false,
    liveList: [],
    today: utils.formatTime2(new Date()),
    // 是否是空数据
    isNull: false,
    // 是否是视频
    isvideo: false,
    // 视频地址
    videourl: '',
    // 是否存在手机号
    hasPhone: false
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      if (wx.getStorageSync('phone') == null) {
        this.setData({
          hasPhone: false
        })
      } else {
        this.setData({
          hasPhone: true
        })
      }
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 获取手机号
    getPhoneNumber(e) {
      const encryptedData = encodeURIComponent(e.detail.encryptedData)
      const iv = encodeURIComponent(e.detail.iv)
      const sessionId = encodeURIComponent(wx.getStorageSync('sessionId'))
      console.log(wx.getStorageSync('phone'));
      userPhone(`wx/user/phone?sessionId=${sessionId}&encryptedData=${encryptedData}&iv=${iv}`).then(rrr => {
        console.log('获取用户手机号', rrr)
        wx.setStorageSync('phone', res.data.wxAuthUser.phone);
        this.setData({
          hasPhone: true
        })
        // this.onLoad();
        // 刷新组件
        const page = getCurrentPages().pop(); //当前页面
        if (page == undefined || page == null) return;
        page.onLoad(); //或者其它操作
      })
    },
    addHistory: function (e) {
      // 授权手机号
      console.log(e.currentTarget);
      // 添加一次直播
      let msg = {
        courseId: e.currentTarget.dataset.courseId
      }
      addUserwatch('/userwatch', msg).then(res => {
        console.log('添加一次直播记录', res);
      })
      // 
      const data = e.currentTarget.dataset
      if (data.time < 0) {
        wx.showToast("课程还未开始，请稍后观看")
      } else {
        if (data.obj.hasOwnProperty('lessonContentUrl')) {
          //播放视频
          this.setData({
            isvideo: true,
            videourl: data.lessonContentUrl
          })
        } else {
          this.setData({
            isvideo: false,
          })
          // 跳转视频号
          wx.openChannelsLive({
            finderUserName: 'sphfYruhmZYLxXt',
            success: res => {
              console.log('成功打开', res);
            },
            fail: res => {
              console.log('打开失败', res);
            }
          })
        }
      }
    }
  },
})