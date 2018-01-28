// pages/applylist/applylist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    applylist:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var Bmob = require('../../utils/bmob.js');
    var applyInfo = Bmob.Object.extend("applyInfo");
    var query = new Bmob.Query(applyInfo);
    query.descending('createdAt');
    // 查询所有数据
    query.find({
      success: function (results) {
        console.log("共查询到 " + results.length + " 条记录");
        var applylist = Array(results.length);
        // 循环处理查询到的数据
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          console.log(object.id + ' - ' + object.get('state'));
          var applyInfo = {
            applyName: object.get('applyName'),
            applyContent: object.get('applyContent'),
            applyTime: object.get('applyTime'),
            toName: object.get('toName'),
            state: object.get('state')
          };
          applylist[i] = applyInfo;
          console.log(applyInfo.applyName);
        }
        that.setData({
          applylist: applylist
        })
      },
      error: function (error) {
        wx.showModal({
          content: "查询失败: " + error.code + " " + error.message,
          showCancel: false,
          confirmText: "确定"
        })
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})