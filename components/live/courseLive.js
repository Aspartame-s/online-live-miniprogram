const {
  getTodayLive,
  addUserwatch,
  userPhone
} = require('../../utils/http/api');
const utils = require('../../utils/util');
import { formhhmm } from '../../utils/util'
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
          // 分割时间
          let arr1 = [];
          this.data.liveList.forEach(item => {
            let a = item.lessonStartAt.substring(11, 16)
            arr1.push(a)
          });
          this.setData({
            times: arr1
          })
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
    hasPhone: false,
    // 显示时间
    times: []
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
    async getPhoneNumber(e) {
      // const encryptedData = encodeURIComponent(e.detail.encryptedData)
      // const iv = encodeURIComponent(e.detail.iv)
      // const sessionId = encodeURIComponent(wx.getStorageSync('sessionId'))
      // console.log(wx.getStorageSync('phone'));
      // userPhone(`wx/user/phone?sessionId=${sessionId}&encryptedData=${encryptedData}&iv=${iv}`).then(rrr => {
      //   console.log('获取用户手机号', rrr)
      //   wx.setStorageSync('phone', res.data.wxAuthUser.phone);
      //   this.setData({
      //     hasPhone: true
      //   })
      //   // this.onLoad();
      //   // 刷新组件
      //   // const page = getCurrentPages().pop(); //当前页面
      //   // if (page == undefined || page == null) return;
      //   // page.onLoad(); //或者其它操作
      // })
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
            hasPhone: true,
            // reqObj: 
          })
          console.log('已设置button隐藏')
          // this.onLoad();
        })
        this.addHistory()
      }

    },
    addHistory: function (e) {
      console.log('start')
      console.log(e.currentTarget);
      const data = e.currentTarget.dataset
      if (data.time <= 0) {
        // console.log('还未开始')
        // wx.showModal({
        //   title: '课程还未开始',
        //   content: '请稍后观看',
        //   showCancel: false
        // })
        return
      } else {
        // 添加一次直播 
        let msg = {
          "courseId": e.currentTarget.dataset.obj.courseId,
          "lessonId": e.currentTarget.dataset.obj.id
        }
        console.log('/userwatch', msg);
        // addUserwatch('/userwatch', msg).then(res => {
        //   console.log('添加一次直播记录', res);
        // })
        if (data.obj.hasOwnProperty('lessonContentUrl')) {
          var header = this.selectComponent("#zizujian")
          header.bofang()
          console.log('播放视频')
          //播放视频
          this.setData({
            isvideo: true,
            videourl: data.lessonContentUrl
          })
        } else {
          console.log('跳转视频号')
          this.setData({
            isvideo: false,
          })
          // wx.openChannelsLive({
          //   finderUserName: 'sphfYruhmZYLxXt',
          //   success: res => {
          //     console.log('成功打开', res);
          //   },
          //   fail: res => {
          //     console.log('打开失败', res);
          //   }
          // })
          console.log('已跳转视频号')
        }
      }
      console.log('end')
    },
    // 分割时间
  },
})