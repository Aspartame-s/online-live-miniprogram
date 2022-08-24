// pages/course/course.js
const {
  getBanner,
  getCourseInfo,
  getCourseCategory,
  getCourseDetail
} = require('../../utils/http/api')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图地址列表
    bannerList: [],
    // 当前页数
    pageNo: 0,
    // 课程列表
    courseList: [],
    // 课程列表是否为空
    iscourseNull: false,
    // 没有更多了
    isMore: true,
    catageClassImg: ['https://sezb-1301658904.cos.ap-nanjing.myqcloud.com/static/img/shufa.png', 'https://sezb-1301658904.cos.ap-nanjing.myqcloud.com/static/img/meishu.png', 'https://sezb-1301658904.cos.ap-nanjing.myqcloud.com/static/img/yinyue.png', 'https://sezb-1301658904.cos.ap-nanjing.myqcloud.com/static/img/wudao.png'],
    catage: [],
    // 当前课程的分类id
    catageId: '',
    // 课程id
    courseId: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    getBanner('banner?pageNo=0&pageSize=1&location=course').then(res => {
      console.log('课程页轮播图', res);
      this.setData({
        bannerList: res.data
      })
    })
    // 请求分页课程信息
    this.getCourseCatage();
    // 获取分类信息
    getCourseCategory('course-category').then(res => {
      console.log('分类信息', res);
      let arr = res.data;
      arr.forEach((item, index) => {
        arr[index].src = this.data.catageClassImg[index];
      });
      console.log('分类列表', arr);
      this.setData({
        catage: arr
      })
    })
  },
  // 点击分类列表
  ClickcategoryName: function (e) {
    console.log(e.currentTarget.dataset);
    this.setData({
      catageId: e.currentTarget.dataset.id
    })
    console.log(this.data.catageId);
    this.getCourseCatage(e.currentTarget.dataset.id);
  },
  getCourseCatage: function (id='') {
    // 获取课程列表
    getCourseInfo('course?categoryId=' + id + '&pageSize=4&pageNo=0').then(res => {
      if (!res.data.empty) {
        this.setData({
          courseList: res.data.content,
          iscourseNull: false
        })
      } else if (res.data.empty) {
        this.setData({
          iscourseNull: true
        })
      }
    })
  },
  // 跳转课程详情页面
  toCourseDetail: function (e) {
    this.setData({
      courseId: e.currentTarget.dataset.id
    })
    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail?courseId=' + e.currentTarget.dataset.id,
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
    // 设置当前在哪个页面
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1 // 根据tab的索引值设置
      })
    }
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
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // 获取课程列表
    if (this.data.isMore) {
      this.setData({
        pageNo: this.data.pageNo + 1
      })
      getCourseInfo('course?categoryId=' + this.data.catageId + '&pageSize=4&pageNo=' + this.data.pageNo).then(res => {
        console.log('课程信息列表', res);
        if (!res.data.empty) {
          let arr1 = this.data.courseList;
          arr1.push(...res.data.content)
          console.log('下拉加载的数据', arr1);
          this.setData({
            courseList: arr1,
            iscourseNull:false,
            isMore: true
          })
        } else {
          // 没有更多了
          this.setData({
            isMore: false
          })
        }
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

})