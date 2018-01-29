// pages/applylist/applylist.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    applylist:[],
    styleClass:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var Bmob = require('../../utils/bmob.js');
    var ApplyInfo = Bmob.Object.extend("applyInfo");

    var query1 = new Bmob.Query(ApplyInfo);
    var query2 = new Bmob.Query(ApplyInfo);
    //拿到数据
    try {
      var bombOAuser = wx.getStorageSync(app.globalData.userInfo.nickName);
      if (bombOAuser) {
        console.log("bombOAuser.name" + bombOAuser.name);
        console.log("bombOAuser.toName" + bombOAuser.toName);
        // Do something with return value
        query1.equalTo("name", bombOAuser.name);
        query2.equalTo("toName", bombOAuser.toName);
        var orQuery = Bmob.Query.or(query1, query2);
        orQuery.descending('createdAt');

        // 查询所有数据
        orQuery.find({
          success: function (results) {
            console.log("共查询到 " + results.length + " 条记录");
            var applylist = Array(results.length);
            var styleClass = Array(results.length);
            // 循环处理查询到的数据
            for (var i = 0; i < results.length; i++) {
              var object = results[i];
              console.log(object.id + ' - ' + object.get('state'));
              var applyInfo = {
                name: object.get('name'),
                applyContent: object.get('applyContent'),
                applyTime: object.get('applyTime'),
                toName: object.get('toName'),
                state: object.get('state'),
                url: '../applydetail/applydetail?'+ 
                'name=' + object.get('name') + '&' +
                'applyContent=' + object.get('applyContent') + '&' +
                'applyTime=' + object.get('applyTime') + '&' +
                'toName=' + object.get('toName') + '&' +
                'state=' + object.get('state') + '&' +
                'id=' + object.id
              };
              applylist[i] = applyInfo;
              console.log(applyInfo.name);
              var styleClassItem = 'kind-list-right-text-nor';
              if (object.get('state') === '已通过') {
                styleClassItem = 'kind-list-right-text-pass';
              } else if (object.get('state') === '已拒绝') {
                styleClassItem = 'kind-list-right-text-reject';
              } else {
                styleClassItem = 'kind-list-right-text-nor';
              }
              styleClass[i] = styleClassItem;
            }
          
            
            that.setData({
              applylist: applylist,
              styleClass: styleClass
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


      }
    } catch (e) {
      // Do something when catch error
      console.log("出错了");
    }

    

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