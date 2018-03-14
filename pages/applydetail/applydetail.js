// pages/applydetail/applydetail.js
var Bmob = require('../../utils/bmob.js');
var util = require('../../utils/util.js');
var app = getApp();
var infoId = '';
var approvalResultType = 'agree';
var approvalComment = '';
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
    hasPermission:false,
    approvalComment: ''
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
    if(options.approvalComment === 'undefined') {
      options.approvalComment = '';
    }
    this.setData({
      name: options.name,
      applyContent: options.applyContent,
      applyTime: options.applyTime,
      toName: options.toName,
      state: options.state,
      isNeedSubmit: isNeedSubmit,
      hasPermission: hasPermission,
      approvalComment : options.approvalComment
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //获取审批的结果
  approvalResultType: function (e) {
    approvalResultType = e.detail.value;
  },
  //获取批语
  approvalComment: function (e) {
    approvalComment = e.detail.value;
  },
  //点击提交
  commitResult: function() {
    console.log("approvalResultType : " + approvalResultType);
    console.log("approvalComment : " + approvalComment);
    var that = this;
    if(infoId) {
      var ApplyInfo = Bmob.Object.extend("applyInfo");
      var query = new Bmob.Query(ApplyInfo);
      query.get(infoId, {
        success: function (result) {
          if(result) {
            var state = '';
            if (approvalResultType === 'agree') {
              state = '已通过';
            } else {
              state = '已拒绝';
            }
            result.set('state', '已通过');
            result.set('comment', approvalComment);
            result.save();
            that.setData({
              state: '已通过',
              isNeedSubmit: false,
              hasPermission: true,
              approvalComment: approvalComment
            })

          //给申请人发送通知
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
                    remark: approvalComment
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

      })
    }
  }
})