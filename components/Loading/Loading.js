// components/Loading/Loading.js
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
    isLoading : app.globalData.isLoading,
    imgbaseUrl:app.globalData.imgbaseUrl
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loading(e){
      this.setData({
        finish:true,
      })
    }
  }
})
