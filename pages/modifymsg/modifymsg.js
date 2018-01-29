// pages/modifymsg/modifymsg.js
var Bmob = require('../../utils/bmob.js');
var app = getApp();
var inputTouser;
var inputToName;
var inputUserType = 'apply';
var oaUser;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isApproval:false,
    isApply: true,
    touser:'',
    toName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    oaUser = wx.getStorageSync(app.globalData.userInfo.nickName);
    var userType = oaUser.userType;

    if(userType === 'apply') {
      this.setData({
        isApproval: false,
        isApply: true,
        touser:oaUser.touser,
        toName: oaUser.toName
      })
      inputUserType = 'apply';
    } else {
      this.setData({
        isApproval: true,
        isApply: false,
        touser: oaUser.touser,
        toName: oaUser.toName
      })
      inputUserType = 'approval';
    }
  
  },
  getTouser:function(e) {
    inputTouser = e.detail.value;
  },
  getToName: function (e) {
    inputToName = e.detail.value;
  },
  userTypeChange:function(e) {
    inputUserType = e.detail.value;
  },
  submit:function() {
    console.log("inputTouser => " + inputTouser);
    console.log("inputToName => " + inputToName);
    console.log("inputUserType => " + inputUserType);
    if (inputTouser === '' || inputToName === '') {
      inputTouser = oaUser.touser;
      inputToName = oaUser.toName;
    }
    
    var OaUser = Bmob.Object.extend("oaUser");
    var query = new Bmob.Query(OaUser);
    query.get(oaUser.id, {
      success:function(result) {
        result.set('touser', inputTouser);
        result.set('userType', inputUserType);
        result.set('toName', inputToName);
        result.save();
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 1000
        })
        inputTouser = '';
        inputToName = '';
        inputUserType = '';
      },
      error: function (error) {
        console.log("提交失败")
        inputTouser = '';
        inputToName = '';
        inputUserType = '';
      }
    })

  }
})