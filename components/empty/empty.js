// components/empty/empty.js
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    describeText:{
      type:String,
      value:'这里暂时什么都没有哦～'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgbaseUrl : app.globalData.imgbaseUrl
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
