// custom-tab-bar/index.js
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  /**
   * 组件的初始数据
   */
  data: {
    imgbaseUrl: app.globalData.imgbaseUrl,
    selected: null,
    color: "#000",
    selectedColor: "#EB9A15",
    list: [
      {
          id: 1,
        pagePath: "/pages/index/index",
        text: "首页",
        iconPath: 'https://sezb-1301658904.cos.ap-nanjing.myqcloud.com/static/icon/shouyeweixuanzhong.png',
        selectedIconPath: "https://sezb-1301658904.cos.ap-nanjing.myqcloud.com/static/icon/shouyexuanzhong.png"
      },
      {
        id: 2,
        pagePath: "/pages/course/course",
        text: "课程",
        iconPath: "https://sezb-1301658904.cos.ap-nanjing.myqcloud.com/static/icon/kechengweixuanzhong.png",
        selectedIconPath: "https://sezb-1301658904.cos.ap-nanjing.myqcloud.com/static/icon/kechengxuanzhong.png"
      },
      {
          id: 3,
        pagePath: "/pages/plaza/plaza",
        text: "广场",
        iconPath: "https://sezb-1301658904.cos.ap-nanjing.myqcloud.com/static/icon/guangchangweixuanzhong.png",
        selectedIconPath: "https://sezb-1301658904.cos.ap-nanjing.myqcloud.com/static/icon/guangchangxuanzhong.png"
      },
      {
          id: 4,
        pagePath: "/pages/my/my",
        text: "我的",
        iconPath: "https://sezb-1301658904.cos.ap-nanjing.myqcloud.com/static/icon/wodeweixuanzhong.png",
        selectedIconPath: "https://sezb-1301658904.cos.ap-nanjing.myqcloud.com/static/icon/wodexuanzhong.png"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      // console.log('tabbar',data);
      wx.switchTab({ url })
      // this.setData({
      //   selected: data.index
      // })
      // console.log(this.data.selected);
    }
  }
})
