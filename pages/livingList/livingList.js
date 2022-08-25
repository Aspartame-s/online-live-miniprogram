// pages/livingList/livingList.js
const { getlivingHistory, historyWacth } = require('../../utils/http/api')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 图片基路径
    imgbaseUrl: app.globalData.imgbaseUrl,
    // 来源位置
    position: '',
    // 头部
    headerName: '',
    // 列表数据index
    dataList: [],
    // 历史记录
    historyList: [],
    pageNo: 0,
    pageSize: 4,
    // 是否为空
    isNull: false,
    // 图片链接
    imgUrl: '',
    // 标题
    title: '',
    // 正文
    content: '',
    // 是否有下面的
    isEmpty: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取当前是哪个页面的跳转
    console.log(options);
    if (options.position == 'index') {
      this.setData({
        position: options.position,
        headerName: '直播回放'
      })
      // &pageSize=4
      getlivingHistory('live-video/page/playback?pageNo=0&pageSize=10').then(res => {
        console.log('直播回放列表', res);
        if (!res.data.empty) {
          this.setData({
            dataList: res.data.content,
            isNull: false
          })
          if (this.data.dataList.length < this.res.data.numberOfElements) {
            
          }
        } else {
          this.setData({
            dataList: [],
            isNull: true
          })
        }
      })
    } else if (options.position == 'my') {
      // 历史观看
      historyWacth('userwatch/history').then(res => {
        console.log('用户查看历史记录', res)
        if (!res.data.empty) {
          // 赋值
          this.setData({
            historyList: res.data.content,
            isNull: false
          })
        } else {
          this.setData({
            isNull: true
          })
        }
      })
      this.setData({
        headerName: '历史记录',
        position: options.position
      })
    }

  },
  backTo: function () {
    wx.navigateBack({
      delta: 1,
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
    if (this.data.isEmpty) {
      this.setData({
        pageNo: this.data.pageNo + 1
      })
      console.log(this.data.pageNo);
      let a = this.data.dataList;
      // 下拉加载
      getlivingHistory('live-video/page/playback?pageNo=' + this.data.pageNo + '&pageSize=4').then(res => {
        console.log('直播回放列表', res);
        if (!res.data.empty) {
          this.setData({
            isEmpty: true
          })
          a.push(...res.data.content)
          console.log(a);
          this.setData({
            dataList: a,
            isNull: false
          })
        } else {
          this.setData({
            isEmpty: false
          })
        }
      })
    } else {
      return;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})