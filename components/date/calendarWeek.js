var utils = require('../../utils/util')
import { getScopeArr, getDay, getCurrentDate  } from '../../utils/getDate.js'
const { byDate } = require('../../utils/http/api')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // currentDay: String
  },
  externalClasses: ['date-position'],
  /**
   * 组件的初始数据
   */
  data: {
    dateList: [], // 日历数据数组
    swiperCurrent: 0, // 日历轮播正处在哪个索引位置
    dateCurrent: new Date(), // 正选择的当前日期
    dateCurrentStr: '', // 正选择日期的 id
    dateMonth: '1月', // 正显示的月份
    dateDay: '01日',
    dateListArray: ['日', '一', '二', '三', '四', '五', '六'],
    cur: '今日',//显示在页面的日期
    //日期组件数组
    calendarList: [],
    scrollLeft: '',
    currentDay: null,
    flag: true,
    activeIsShow: false,
    hasDataList: [],
    todayShow: false
  },
  created: function () {
    // this.setData({
    //   calendarList: arr1,
    //   currentDay: getDay()
    // })
  },
  ready: function () {
    const arr = getScopeArr()
    const arr1 = []
    arr.forEach(item => {
      const week = new Date(item).getDay()
      arr1.push(
        {
          week,
          date: item,
          showDate: item.substring(8, 10),
          showWeek: week == 0 ? '日' : week == 1 ? '一' : week == 2 ? '二' : week == 3 ? '三' : week == 4 ? '四' : week == 5 ? '五' : '六'
        }
      )
    })
     byDate('lesson/by-date').then(res => {
      const hasDataList = res.data
      this.setData({
        hasDataList
      })
      hasDataList.forEach(item => {
        arr1.forEach(self => {
            if(item.lessonStartDate == self.date) {
              self.has = 1
            }
        })
      })
      this.setData({
        calendarList: arr1,
        currentDay: getDay()
      })
      this.createSelectorQuery().in(this).select('#the-id').boundingClientRect(res => {
        const scrollLeft = 14 * res.width + 25
        this.setData({
          scrollLeft
        })
      }).exec()
  
      var today = utils.formatTime2(new Date());
      this.setData({
        today,
      });
      var d = new Date();
      this.initDate(-5, 2, d); // 日历组件程序  -4左表示过去4周  右1表示过去一周 
    })
    
    //获取dom宽度
    
  },
  // 将当天的日期规范显示在页面
  observers: {
    'dateCurrentStr': function (dateCurrentStr) {
      // 在 dateCurrentStr 被设置时，执行这个函数
      let arr = dateCurrentStr.split('-');
      const today = getCurrentDate()
      if(today == dateCurrentStr) {
        return
      }else {
        this.setData({
          cur: arr[1] + '月' + arr[2] + '日'
        })
      }
     
    }
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    click(e) {
      const str = e.currentTarget.dataset.date
      const today = getCurrentDate()
     
      this.setData({
        dateCurrentStr: str,
        currentDay: e.currentTarget.dataset.curdate,
        todayShow: true
      })
      if(str == today) {
        this.setData({
          cur: '今日',
          todayShow: false
        })
      }
      this.triggerEvent('mydata', {
        data: str
      })
    },
    backToday() {
      this.createSelectorQuery().in(this).select('#the-id').boundingClientRect(res => {
        const scrollLeft = 14 * res.width + 25
        this.setData({
          scrollLeft
        })
      }).exec()
      const today = getCurrentDate()
      this.setData({
        // dateCurrentStr: today,
        currentDay: getDay(),
        cur: '今日',
        todayShow: false
      })
      this.triggerEvent('mydata', {
        data: today
      })
    },
    //滑动开始
    scrollStart(e) {
       if(e) {
         this.setData({
           activeIsShow: true
         })
       }
      let _this =this;
        if (this.scrollEndTimer) {
            clearTimeout(this.scrollEndTimer);
            this.scrollEndTimer =null;
        }
        this.scrollEndTimer = setTimeout(function () {
            _this.setData({
              activeIsShow: false
            })
    
        }, 500);
    },

    //滑动结束
    scrollEnd(e) {
    },
    // 日历组件部分
    initDate(left, right, d) {
      var month = utils.addZero(d.getMonth() + 1),
        year = utils.addZero(d.getFullYear()),
        day = utils.addZero(d.getDate());
      for (var i = left; i <= right; i++) {
        this.updateDate(utils.DateAddDay(d, i * 7)); //多少天之后的
      }
      this.setData({
        swiperCurrent: 5,
        dateCurrent: d,
        dateCurrentStr: d.getFullYear() + '-' + month + '-' + day,
        dateMonth: month + '月',
        dateYear: year + '年',
        dateDay: day + '日',
        dateCurrentStr: year + "-" + month + "-" + day,
      });
    },
    // 获取这周从周日到周六的日期
    calculateDate(_date) {
      var first = utils.FirstDayInThisWeek(_date);
      var d = {
        'month': first.getMonth() + 1,
        'days': [],
      };
      for (var i = 0; i < 7; i++) {
        var dd = utils.DateAddDay(first, i);
        var day = utils.addZero(dd.getDate()),
          year = utils.addZero(dd.getFullYear()),
          month = utils.addZero(dd.getMonth() + 1);
        d.days.push({
          'day': day,
          'id': dd.getFullYear() + '-' + month + '-' + day,
          'ids': dd.getFullYear() + ',' + month + ',' + day,
        });
      }
      return d;
    },
    // 更新日期数组数据
    updateDate(_date) {
      var week = this.calculateDate(_date);
      this.setData({
        dateList: this.data.dateList.concat(week),
      });
    },
    // 日历组件轮播切换
    dateSwiperChange(e) {
      const lastIndex = this.data.swiperCurrent,
        currentIndex = e.detail.current,
        dateList = this.data.dateList
      let flag = false,
        key = 'lastMonth' //判断是左划还是右 
      if (lastIndex > currentIndex) {
        lastIndex === 7 && currentIndex === 0 ?
          flag = true :
          null
      } else {
        lastIndex === 0 && currentIndex === 7 ?
          null :
          flag = true
      }
      if (flag) {
        key = 'nextMonth'
      }
      if (key == 'lastMonth') {
        let nowindex = currentIndex - 3;
        let uptime = currentIndex - 4;
        let a = 0;
        if (nowindex < 0) {
          nowindex = nowindex + 8;
          a = 0
        }
        if (uptime < 0) {
          uptime = uptime + 8
        }
        let seltime = dateList[nowindex].days[a].ids.split(',')
        var week = this.calculateDate(utils.formatTime(utils.DateAddDay(new Date(Number(seltime[0]), Number(seltime[1]) - 1, Number(seltime[2])), -1)));
        dateList[uptime] = week
        this.setData({
          dateList: dateList
        })
      }
      if (key == 'nextMonth') {
        let indexne = 0
        let aa = 0
        if (currentIndex == 7) { //要更新的下标
          indexne = 0
          aa = 1
        } else {
          indexne = currentIndex + 1
          aa = currentIndex + 2
        }
        if (aa == 8) {
          aa = 0
        }
        //aa 要更新的数组下标 datanex要往后查询一周的日期
        let datanex = dateList[indexne].days[6].ids.split(',')
        //获取下一周的
        var week = this.calculateDate(utils.formatTime(utils.DateAddDay(new Date(Number(datanex[0]), Number(datanex[1]) - 1, Number(datanex[2])), 1)));
        dateList[aa] = week
        this.setData({
          dateList: dateList
        })
      }
      var dDateFormat = this.data.dateList[currentIndex].days[3].ids.split(',');
      this.setData({
        swiperCurrent: currentIndex,
        dateMonth: dDateFormat[1] + '月',
        dateYear: dDateFormat[0] + "年",
      })
    },
    // 获得日期字符串
    getDateStr: function (arg) {
      if (utils.type(arg) == 'array') {
        return arr[0] + '-' + arr[1] + '-' + arr[2] + ' 00:00:00';
      } else if (utils.type(arg) == 'date') {
        return arg.getFullYear() + '-' + (arg.getMonth() + 1) + '-' + arg.getDate() + ' 00:00:00';
      } else if (utils.type(arg) == 'object') {
        return arg.year + '-' + arg.month + '-' + arg.day + ' 00:00:00';
      }
    },

    // 点击日历某日
    chooseDate(e) {
      var str = e.currentTarget.id;
      this.setData({
        dateCurrentStr: str
      });
      this.triggerEvent('mydata', {
        data: str
      })
    },
  }
})