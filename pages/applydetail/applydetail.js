// pages/applydetail/applydetail.js
var Bmob = require('../../utils/bmob.js');
var app = getApp();
var infoId = '';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    applyContent: '',
    applyTime: '',
    toName: '',
    state: '',
    isNeedSubmit:false,
    hasPermission:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var isNeedSubmit;
    var hasPermission;
    infoId = options.id;
    if (options.state === '审核中') {
      isNeedSubmit = true;
    } else {
      isNeedSubmit = false;
    }
    var oauserInfo = wx.getStorageSync(app.globalData.userInfo.nickName);
    if(oauserInfo.userType === 'approval') {
      hasPermission = true;
    } else {
      hasPermission = false;
    }
    
    this.setData({
      name: options.name,
      applyContent: options.applyContent,
      applyTime: options.applyTime,
      toName: options.toName,
      state: options.state,
      isNeedSubmit: isNeedSubmit,
      hasPermission: hasPermission
    })
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
  
  },
  clickPass:function() {
    var that = this;
    if (infoId) {
      var ApplyInfo = Bmob.Object.extend("applyInfo");
      var query = new Bmob.Query(ApplyInfo);
      // 这个 id 是要修改条目的 objectId，你在这个存储并成功时可以获取到，请看前面的文档
      query.get(infoId, {
        success: function (result) {
          // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
          result.set('state', '已通过');
          result.save();
          this.setData({
            state: '已通过',
            isNeedSubmit: false,
            hasPermission: true
          })
          // The object was retrieved successfully.
        },
        error: function (object, error) {

        }
      });
    }
  },
  clickReject:function() {
    var that = this;
    if (infoId) {
      var ApplyInfo = Bmob.Object.extend("applyInfo");
      var query = new Bmob.Query(ApplyInfo);
      // 这个 id 是要修改条目的 objectId，你在这个存储并成功时可以获取到，请看前面的文档
      query.get(infoId, {
        success: function (result) {
          // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
          result.set('state', '已拒绝');
          result.save();
          that.setData({
            state: '已拒绝',
            isNeedSubmit: false,
            hasPermission: true
          })
          // The object was retrieved successfully.
        },
        error: function (object, error) {

        }
      });
    }
  }
})