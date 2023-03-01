//工具函数库

//处理时间戳
export function formatDate(timestamp) {
  //parsetin只返回以数字开头的字符串
  //new Date()把时间转化成时间戳
  let date = new Date(parseInt(timestamp));
  let year = date.getFullYear();//年
  let month = date.getMonth() + 1;//月
  let day = date.getDate();//日

  let hour = date.getHours();//时
  let minutes = date.getMinutes();//分
  let seconds = date.getSeconds();//秒

  let weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  let week = weekArr[date.getDay()];//date对应的星期几
  //getDay()返回0~6
  // console.log(weekArr[12], date.getDay());

  //给单位数前面加上0
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  };

  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }

  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }

  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }

  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  };

  return `${year}-${month}-${day} ${hour}:${minutes}:${seconds} ${week}`
}