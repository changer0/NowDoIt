// pages/input/input.js
var Bmob = require('../../utils/bmob.js');
var util = require('../../utils/util.js');
var applyContent = '';
var applyTime = '';
//获取应用实例
const app = getApp()
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    applyTime: '',
    toName: '路新艺',
    name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date();
    applyTime = util.formatTime(date);

    var oaUser = Bmob.Object.extend("oaUser");
    //创建查询对象，入口参数是对象类的实例
    var oaUserQuery = new Bmob.Query(oaUser);
    oaUserQuery.equalTo("name", app.globalData.userInfo.nickName);
    var that = this;
    oaUserQuery.find({
      success: function (results) {
        if(results.length > 0) {
          that.setData({
            toName :results[0].get('toName')
          })
         
        }
      }
    })

    this.setData({
      applyTime: util.formatTime(date)
    })
  
    this.setData({
      name: app.globalData.userInfo.nickName
    })
  },
  //下面是自定义的函数
  getApplyContent: function(e) {
    applyContent = e.detail.value;
  },
  submit: function() {
    var that = this;
    if (applyContent === '') {
      wx.showModal({
        content: "申请内容不能为空",
        showCancel: false,
        confirmText: "确定"
      })
      return;
    }

    var ApplyInfo = Bmob.Object.extend("applyInfo");
    var applyInfo = new ApplyInfo();
    applyInfo.set('name', app.globalData.userInfo.nickName);
    applyInfo.set('applyContent', applyContent);
    applyInfo.set('applyTime', applyTime);
    applyInfo.set('toName', this.data.toName);
    applyInfo.set('state', '审核中');
    applyInfo.save(null, {
      success: function (result) {
        // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
        console.log("数据保存成功, objectId:" + result.id);

        getApproval(applyContent);
      },
      error: function (result, error) {
        // 添加失败
        console.log('提交失败');
      }
    });
    console.log(applyContent);
    console.log(applyTime);
  }
})


const getApproval = function (applyContent) {
  var oaUser = Bmob.Object.extend("oaUser");
  //创建查询对象，入口参数是对象类的实例
  var oaUserQuery = new Bmob.Query(oaUser);
  oaUserQuery.equalTo("name", app.globalData.userInfo.nickName);

  oaUserQuery.find({
    success: function (results) {
      if (results.length > 0) {
        var toName = results[0].get('toName');
        var oaUserToUser = Bmob.Object.extend("oaUser");
        var oaUserToUserQuery = new Bmob.Query(oaUserToUser);
        oaUserToUserQuery.equalTo("name", toName);
        oaUserToUserQuery.find({
          success: function (results2) {
            console.log("共查询到 " + results2.length + " 条记录");
            // 循环处理查询到的数据
            var touser = '';
            if (results2.length > 0) {
              touser = results2[0].get('touser');
              console.log('获取到数据:' + results2[0].get('name'));

              //发送msg给审批人
              var msg = {
                touser: touser,
                notify: '您有新的流程需要处理',
                name: app.globalData.userInfo.nickName,
                state: '审核中',
                time: util.formatTime(new Date()),
                remark: applyContent
              }
              util.sendMessageToLeader(msg);
              applyContent = '';//必须置空
            } else {
            }
          },
          error: function (error) {
            console.log("查询失败: " + error.code + " " + error.message);
          }
        });
      } 
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });


}
