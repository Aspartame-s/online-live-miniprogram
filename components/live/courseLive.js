const {
  getTodayLive,addUserwatch
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
    isHuifangHead:Boolean,
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
        console.log('根据时间获取到的直播列表',res);
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
              isOne:false,
              isNull: false
            })
            console.log('指定日期课程列表', this.data.liveList);
          }
        } else {
          // 数据为空状态
          this.setData({
            isNull:true
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
    isNull:false
  },
  /**
   * 组件的方法列表
   */
  methods: {
    addHistory:function (e) {
      console.log(e.currentTarget);
      // 添加一次直播
      let msg = {
        courseId:e.currentTarget.dataset.courseId
      }
      addUserwatch('/userwatch',msg).then(res=>{
        console.log('添加一次直播记录',res);
      })
    }
  },
})