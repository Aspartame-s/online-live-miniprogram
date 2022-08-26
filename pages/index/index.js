// index.js
const app = getApp()
import * as watch from "../../utils/watch";
const { getBanner, getLiving, getlivingHistory, userLogin, addUserwatch,userPhone } = require('../../utils/http/api')
import { getDay } from '../../utils/getDate'
Page({
  data: {
    imgbaseUrl: app.globalData.imgbaseUrl,
    clickDate: '',
    // banner图
    bannerurl: [],
    bannerLink: [],
    // 正在直播的切换
    // 直播回放是否显示
    isShow: false,
    // 正在直播选中状态
    livingSrc: app.globalData.imgbaseUrl + '/icon/livingxuanzhong.png',
    // 直播回放未被选中状态
    huifangSrc: app.globalData.imgbaseUrl + '/icon/zhibohuifangweixuanzhong.png',
    // 正在直播列表
    livingList: [],
    // 正在直播是否为空
    livingNull: false,
    // 直播回放列表
    livingHistory: [],
    // 直播回放是否为空
    livingHistoryNull: false,
    // 视频号feedId
    feedId:'',
    // 是否有手机号
    hasPhone:false,
    currentDay: null
  },
  onLoad() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('登录的res', res);
        userLogin('wx/user/login?code=' + res.code).then(res => {
          console.log('登录后端返回', res);
          wx.setStorageSync('sessionId', res.data.sessionId)
          wx.setStorageSync('sessionKey',res.data.session.sessionKey)
          wx.setStorageSync('openid',res.data.session.openid)
          wx.setStorageSync('jwt', res.data.jwt)
          // 昵称
          wx.setStorageSync('nickName', res.data.wxAuthUser.nickName)
          // 判断头像是否存在
          if (res.data.wxAuthUser.hasOwnProperty('avatarUrl')) {
            app.globalData.isLogin = true;
            wx.setStorageSync('avatarUrl', res.data.wxAuthUser.avatarUrl)
          }
          // 存储手机号
          if (res.data.wxAuthUser.hasOwnProperty('phone')) {
            console.log('现在有手机号，button应该不显示')
            wx.setStorageSync('phone', res.data.wxAuthUser.phone);
            this.setData({
              hasPhone:true
            })
          }
        })
      }
    })
    // 设置监听器，建议在onLoad下调用
    watch.setWatcher(this);
    // 获取首页banner图
    getBanner('banner?pageNo=0&pageSize=1&location=index').then(res => {
      console.log('banner图', res);
      this.setData({
        bannerurl: res.data,
        bannerLink: res.data
      })
    }),
      // 获取正在直播列表
      getLiving('live-video/page?pageNo=0&pageSize=1').then(res => {
        console.log('直播列表', res);
        if (!res.data.empty) {
          this.setData({
            livingList: res.data.content
          })
        } else {
          this.setData({
            livingNull: true
          })
        }
      })
    // 获取直播回放
    getlivingHistory('live-video/page/playback?pageNo=0&pageSize=2').then(res => {
      console.log('直播回放数据', res);
      if (!res.data.empty) {
        this.setData({
          livingHistory: res.data.content,
          livingHistoryNull: false
        })
      } else {
        this.setData({
          livingHistoryNull: true
        })
      }
      console.log(this.data.livingHistory);
    })
  },
  onHide() {
    console.log('今天')
    this.setData({
      currentDay: getDay()
    })
  },
  // 监听
  watch: {
    // 监听当前点击的是直播还是直播回放
    isShow: function (newVal, oldVal) {
    }
  },
  mydata(e) {
    //可获取日历点击事件
    console.log(e)
    let data = e.detail.data
    this.setData({
      clickDate: data
    })
    console.log(this.data.clickDate)
  },
  // 查看更多
  getMoreClick() {
    wx.navigateTo({
      url: '/pages/livingList/livingList?position=index',
    })
  },
  // 切换直播
  changeTab() {
    this.setData({
      isShow: !this.data.isShow
    })
    if (this.data.isShow) {
      // 直播没有被选中
      this.setData({
        livingSrc: this.data.imgbaseUrl + '/icon/livingweixuanzhong.png',
        huifangSrc: this.data.imgbaseUrl + '/icon/livingxuanzhong1.png'
      })
    } else {
      this.setData({
        livingSrc: this.data.imgbaseUrl + '/icon/livingxuanzhong.png',
        // livingSrc:'https://sezb-1301658904.cos.ap-nanjing.myqcloud.com/view/icon/livingxuanzhong1.png',
        huifangSrc: this.data.imgbaseUrl + '/icon/zhibohuifangweixuanzhong.png'
      })
    }
  },
  // 跳转直播回放列表
  intoHistory: function (e) {
    console.log(e.currentTarget.dataset.obj)
    // console.log('直播回放', e.currentTarget);
    // // 记录一次观看历史记录
    // let data1 = {
    //   "courseId": e.currentTarget.dataset.courseid,
    //   "lessonId": e.currentTarget.dataset.lessonid
    // }
    // addUserwatch('userwatch', data1).then(res => {
    //   console.log('添加一次直播', res);
    // })
  },
  onShow() {
    // 设置当前在哪个页面
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0    // 根据tab的索引值设置
      })
    }
  },
  async getPhoneNumber(e) {
    console.log(e)
   if(!e.detail.cloudID) {
     return
   }else {
    const encryptedData = encodeURIComponent(e.detail.encryptedData)
    const iv = encodeURIComponent(e.detail.iv)
    // const sessionId = encodeURIComponent(wx.getStorageSync('sessionId'))
    const sessionKey = encodeURIComponent(wx.getStorageSync('sessionKey'))
    const openid = encodeURIComponent(wx.getStorageSync('openid'))
    await userPhone(`wx/user/phone?sessionKey=${sessionKey}&encryptedData=${encryptedData}&iv=${iv}&openid=${openid}`).then(rrr => {
      console.log('获取用户手机号',rrr)
      wx.setStorageSync('phone', rrr.data);
      this.setData({
        hasPhone: true
      })
      console.log('已设置button隐藏')
      // this.onLoad();
    })
    var header = this.selectComponent("#zizujian")
    header.bofang()
   }
    // console.log(wx.getStorageSync('phone') == '');
    // if(wx.getStorageSync('phone')) {
    //   console.log('现在有手机号，button应该不显示2')
    //   this.setData({
    //     hasPhone: true
    //   })
    //   // return
    // }else {
      
      
    // }
    
  },
  // 跳转视频号
  gotoLiving(e) {
    // 没有获取到用户手机号
    console.log(wx.getStorageSync('phone'));
    // if (!this.data.hasPhone) {
      
    // }
    console.log('添加一条观看记录',e.currentTarget);
    let data2 = {
      "courseId": e.currentTarget.dataset.courseid,
      "lessonId": e.currentTarget.dataset.lessonid,
      "liveId":e.currentTarget.dataset.liveid,
    }
    wx.openChannelsLive({
      finderUserName: 'sphfYruhmZYLxXt',
      success:res=>{
        console.log('成功打开',res);
        addUserwatch('userwatch', data2).then(res => {
          console.log('添加一次直播', res);
        })
      },
      fail:res=>{
        console.log('打开失败',res);
      }
    })
  }
})