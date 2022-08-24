//获取当前月份有几天
export const getDate = (year, month, date) => {
  return new Date(year, month, date).getDate()
}

//获取当前几号
export const getDay = () => {
  return new Date().getDate() 
}

//获取前后两周数组
export const getScopeArr = () => {
  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1
  const date = getDate(year, month, 0) //当前月份有几天
  const frontMonthDateCount = getDate(year, (month - 1), 0) //获取上一个月具体的天数
  const currentDate = new Date().getDate() 
  const frontTwoWeek = currentDate - 1
  const afterTwoWeek = date - currentDate

  let idealList = [] //理想数组

  const frontTwoWeekArr = [] // 当前日期前两周的数组
  const afterTwoWeekArr = [] // 当前日期后两周的数组

  const beyondAfterArr = [] // 超过当前月的天数日期数组
  let beyondFrontArr = [] // 超过当前月的天数日期数组

  //如果当前日期的后14天超出了本月剩余的天数，超出的天数从下一个月中取
  if (afterTwoWeek < 14) {
      for (let i = 0; i < 14 - afterTwoWeek; i++) {
          if (month < 12) {
              //如果当前月份小于12月 说明下一月一定是还是在当年
              beyondAfterArr.push(String(year + '-' + ((month + 1) < 10 ? ('0' + (month + 1)) : (month + 1)) + '-' + ((i + 1) < 10 ? ('0' + (i + 1)) : (i + 1))))
          } else {
              // 如果当前月份大于等于12月，说明下一个月份一定是下一年的一月 所以月份可以写死
              beyondAfterArr.push(String((year + 1) + '-' + '01' + '-' + ((i + 1) < 10 ? ('0' + (i + 1)) : (i + 1))))
          }
      }
  }

  //如果当前日期的前14天超出了本月之前的天数，超出的天数从上一个月中取
  if (frontTwoWeek < 14) {
      for (let i = 0; i < 14 - frontTwoWeek; i++) {
          if (month < 2) {
              //如果当前月份小于二月份 说明 上一个月一定是前一年的12月份 所以不用考虑 闰年的情况 12月份永远都是31天
              beyondFrontArr.push(String((year - 1) + '-' + '12' + '-' + (31 - i)))
          } else {
              //如果当前月份大于二月份 说明 上一个月还是当年 但是要注意 取上一个月份是从 月份的最后一天取 ，也就是说要获取上一个月的具体天数是多少 30 31 28 29 都有可能
              beyondFrontArr.push(String(year + '-' + ((month - 1) < 10 ? ('0' + (month - 1)) : (month - 1)) + '-' + (frontMonthDateCount - i)))
          }
      }
      beyondFrontArr.reverse()
  }

  //因为一个月最少都有28天 所以 前后两周都超出当前月份的情况不存在，逻辑暂定简单些
  if (afterTwoWeek < 14) { //如果是向后的两周超出了当前月份，那么前两周一定在当前月
      const arr1 = [] //后2周的数组（在当前月内的）
      const arr2 = [] //前2周的数组
      for(let i = currentDate; i < date + 1; i++) { //后2周的数组（在当前月内的）
          arr1.push(String(year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (i < 10 ? ('0' + 1) : i)))
      }
      for(let j = currentDate - 14; j < currentDate ; j++) { //前2周的数组
          arr2.push(year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (j < 10 ? ('0' + j) : j))
      }
      // idealList = arr1
      // idealList = arr1.concat(beyondAfterArr)
      idealList.push(...arr2, ...arr1, ...beyondAfterArr)
  } else if (frontTwoWeek < 14) { //如果是向前两周超出了当前月份，那么后两周一定在当前月
      const arr3 = [] //前2周的数组（在当前月内的）
      const arr4 = [] //后2周的数组
      for (let i = 0; i < currentDate; i++) {
          arr3.push(String(year + '-' + (month < 10 ? ('0' + month) : month) + '-' + ((i + 1) < 10 ? ('0' + (i + 1)) : (i + 1))))
      }
      for(let j = currentDate; j < currentDate + 14; j++) {
          arr4.push(String(year + '-' + (month < 10 ? ('0' + month) : month) + '-' + ((j + 1) < 10 ? ('0' + (j + 1)) : (j + 1))))
      }
      // idealList = beyondFrontArr
      idealList.push(...beyondFrontArr, ...arr3, ...arr4)
  } else { //向前两周和向后两周都在同一个月
      const arr5 = [] //向前两周
      const arr6 = [] //向后两周
      for(let i = currentDate - 14; i <= currentDate ; i++) {
          arr5.push(String(year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (i < 10 ? ('0' + 1) : i)))
      }
      for(let j = currentDate; j < currentDate + 14; j++) {
          arr6.push(String(year + '-' + (month < 10 ? ('0' + month) : month) + '-' + ((j + 1) < 10 ? ('0' + (j + 1)) : (j + 1))))
      }
      idealList.push(...arr5, ...arr6)
  }


  return idealList
}