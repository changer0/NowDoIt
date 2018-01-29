// pages/applydetail/applydetail.js
var Bmob = require('../../utils/bmob.js');
var util = require('../../utils/util.js');
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
          if(result) {
            result.set('state', '已通过');
            result.save();
            that.setData({
              state: '已通过',
              isNeedSubmit: false,
              hasPermission: true
            })
            var OaUser = Bmob.Object.extend("oaUser");
            var queryNotifyUser = new Bmob.Query(OaUser);
            queryNotifyUser.equalTo('name', result.get('name'));
            queryNotifyUser.find({
              success: function (results) {
                if (results.length > 0) {
                  console.log("获取到需要发送的touser=> " + results[0].get('touser'));
                  //发送msg给申请人
                  var msg = {
                    touser: results[0].get('touser'),
                    notify: '您的申请已审批',
                    name: app.globalData.userInfo.nickName,
                    state: '已通过',
                    time: util.formatTime(new Date()),
                    remark: that.data.applyContent
                  }
                  util.sendMessageToSelf(msg);
                }
              },
              error: function (error) {
              }
            });
          }
          
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

          var OaUser = Bmob.Object.extend("oaUser");
          var queryNotifyUser = new Bmob.Query(OaUser);
          queryNotifyUser.equalTo('name', result.get('name'));
          queryNotifyUser.find({
            success: function (results) {
              if (results.length > 0) {
                console.log("获取到需要发送的touser=> " + results[0].get('touser'));
                //发送msg给申请人
                var msg = {
                  touser: results[0].get('touser'),
                  notify: '您的申请已审批',
                  name: app.globalData.userInfo.nickName,
                  state: '已拒绝',
                  time: util.formatTime(new Date()),
                  remark: that.data.applyContent
                }
                util.sendMessageToSelf(msg);
              }
            },
            error: function (error) {
            }
          });

        },
        error: function (object, error) {

        }
      });
    }
  }
})