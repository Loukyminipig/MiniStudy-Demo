const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

function getDiffTime(recordTime, yearsFlag) {
  if (recordTime) {
    recordTime = new Date(parseFloat(recordTime) * 1000);
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var now = new Date();
    var diff = now - recordTime;
    var result = '';

    if (diff < 0) {
      return result;
    }

    var weekR = diff / (7 * day);
    var dayC = diff / day;
    var hourC = diff / hour;
    var minC = diff / minute;
    if (weekR >= 1) {
      var formate = yearsFlag ? 'yyy-MM-dd hh:mm' : 'MM-dd hh:mm';
      return recordTime.format(formate);
    } else if (dayC == 1 || (hour < 24 && recordTime.getDate() != now.getDate())) {
      result = '昨天' + recordTime.format(formate);
      return result;
    } else if (dayC > 1) {
      var formate = yearsFlag ? 'yyy-MM-dd hh:mm' : 'MM-dd hh:mm';
      return recordTime.format(formate);
    } else if (hourC >= 1) {
      result = parseInt(hourC) + '小时前';
      return result;
    } else if (minC >= 1) {
      result = parseInt(minC) + '分钟前';
      return result;
    } else {
      result = '刚刚';
      return result;
    }
  }
  return '';
}

(function initTimeFormat() {
  Date.prototype.format = function (format) {
    var o = {
      "M+": this.getMonth() + 1,
      "d+": this.getDate(),
      "h+": this.getHours(),
      "m+": this.getMinutes(),
      "s+": this.getSeconds(),
      "q+": Math.floor((this.getMonth() + 3) / 3),
      "S": this.getMilliseconds()
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] :
        ("00" + o[k]).substr("" + o[k]).length);
    return format;
  };
})()

module.exports = {
  formatTime,
  getDiffTime: getDiffTime
}
