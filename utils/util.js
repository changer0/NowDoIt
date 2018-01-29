const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const sendMessageToLeader = msg => {

  /*
  aNNNmi7WK4kohleWhCkDRKJiHOZnIpkrhXx5XPx4dx0
  {{first.DATA}}
  账号名称：{{keyword1.DATA}}
  审核状态：{{keyword2.DATA}}
  审核时间：{{keyword3.DATA}}
  {{remark.DATA}}
  我的touser：oUxY3wxmlCiTUOPcNGv5YENfP5mI
  */
  var temp = {
    "touser": msg.touser,
    "template_id": "aNNNmi7WK4kohleWhCkDRKJiHOZnIpkrhXx5XPx4dx0",
    "url": "https://open.weixin.qq.com/sns/getexpappinfo?appid=wx2c7d4331d08259b5&path=pages%2Findex%2Findex.html&key=&uin=&scene=4&version=26060133#wechat-redirect",
    "data": {
      "first": {
        "value": msg.notify,
        "color": "#c00"
      },
      "keyword1": {
        "value": msg.name
      },
      "keyword2": {
        "value": msg.state
      },
      "keyword3": {
        "value": msg.time
      },
      "remark": {
        "value": "申请内容:" + msg.remark
      }
    }
  }
  console.log(temp);
  var Bmob = require('bmob.js');
  Bmob.sendMasterMessage(temp).then(function (obj) {
    console.log('发送成功');
    wx.showModal({
      content: "申请成功，已通知审批人",
      showCancel: false,
      confirmText: "确定",
      success: function () {
        wx.navigateBack({
        })
      }
    })
  }, function (err) {
    common.showTip('失败' + err);
  });
}

module.exports = {
  formatTime: formatTime,
  sendMessageToLeader: sendMessageToLeader
}

