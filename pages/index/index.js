var util = require('../../utils/util.js');
var Bmob = require('../../utils/bmob.js');
//index.js
//获取应用实例
const app = getApp()
var touser = '';
var userType = 'approval';
var toName = "";
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userType: '申请人',
    hasUserType: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //调往测试页面
  clickToTestPage: function() {
    getOAUser(this);
    // console.log("unionId =>" + this.data.userInfo.nickName);
    // wx.navigateTo({
    //   url: '../testpage/testpage'
    // })
    wx.showActionSheet({
      itemList: ['A', 'B', 'C'],
      success: function(res) {
        console.log(res.tapIndex)
      },
    })
    var msg = {
      touser: 'oUxY3wxmlCiTUOPcNGv5YENfP5mI',
      notify: '您有新的流程需要处理',
      name: this.data.userInfo.nickName,
      state: '审核中',
      time: util.formatTime(new Date())
    }
    // util.sendMessageToLeader(msg);
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      getOAUser(this);
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        app.globalData.userInfo = res.userInfo;
        getOAUser(this);
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          getOAUser(this);
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    getOAUser(this);
  },
  userTypeChange:function(e) {
    userType = e.detail.value;
  },
  getTouser:function(e) {
    touser = e.detail.value;
    console.log('touser:' + touser)
  },
  getToName: function(e) {
    toName = e.detail.value;
  },
  submit:function() {
    console.log("touser" + touser);
    console.log("userType" + userType);

    var that = this;
    if (touser === '' || touser === '' || toName === '') {
      wx.showModal({
        content: "openId和联系人不能为空",
        showCancel: false,
        confirmText: "确定"
      })
      return;
    }
    var OaUser = Bmob.Object.extend("oaUser");
    var oaUser = new OaUser();
    oaUser.set('touser', touser);
    oaUser.set('userType', userType);
    oaUser.set('name', this.data.userInfo.nickName);
    oaUser.set('toName', toName);
    oaUser.save(null, {
      success: function (result) {
        // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
        console.log("数据保存成功, objectId:" + result.id);
        wx.showModal({
          content: "提交成功",
          showCancel: false,
          confirmText: "确定"
        })
        getOAUser(that);
      },
      error: function (result, error) {
        // 添加失败
        console.log('提交失败');
        wx.showModal({
          content: "提交失败，可能是由于网络原因，请重试",
          showCancel: false,
          confirmText: "确定"
        })
      }
    });
  }
})

const getOAUser = function(page) {
  var oaUser = Bmob.Object.extend("oaUser");
  //创建查询对象，入口参数是对象类的实例
  var query = new Bmob.Query(oaUser);
  query.equalTo("name", page.data.userInfo.nickName);
  query.find({
    success: function (results) {
      console.log("共查询到 " + results.length + " 条记录");
    
      if(results.length > 0) {
        var userType = '';
        if(results[0].get('userType') === 'approval') {
          userType = "审批人";
        } else {
          userType = "申请人";
        }
        var data = {
          'name': results[0].get('name'),
          'userType': results[0].get('userType'),
          'touser': results[0].get('touser'),
          'toName': results[0].get('toName'),
          'id': results[0].id
        }
        try {
          wx.setStorageSync(page.data.userInfo.nickName,data);
        } catch (e) {
        }
        page.setData({
          hasUserType: true,
          userType: userType
        })
      } else {
        page.setData({
          hasUserType: false
        })
      }
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
      page.setData({
        hasUserType: false
      })
    }
  });
}