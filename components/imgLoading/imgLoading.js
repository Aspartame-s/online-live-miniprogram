Component({
  properties: {
    defaultImage: String, //默认图片
    originalImage: String,//请求的图片
    width: String,
    height: String,
    mode: String
  },
  data: {
    finishedFlag: false
  },
  methods: {
    finishLoad: function (e) {
      this.setData({
        finishedFlag: true
      })
    }
  }
})