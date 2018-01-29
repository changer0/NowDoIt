// pages/applylist/applylist.js
var app = getApp();
var Bmob = require('../../utils/bmob.js');
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
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    var that = this;
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
        query2.equalTo("name", bombOAuser.toName);
        var orQuery = Bmob.Query.or(query1, query2);
        orQuery.descending('createdAt');

        // 查询所有数据
        orQuery.find({
          success: function (results) {
            var applylist = Array(results.length);
            var styleClass = Array(results.length);
            // 循环处理查询到的数据
            for (var i = 0; i < results.length; i++) {
              var object = results[i];
              var applyInfo = {
                name: object.get('name'),
                applyContent: object.get('applyContent'),
                applyTime: object.get('applyTime'),
                toName: object.get('toName'),
                state: object.get('state'),
                id: object.id,
                url: '../applydetail/applydetail?' +
                'name=' + object.get('name') + '&' +
                'applyContent=' + object.get('applyContent') + '&' +
                'applyTime=' + object.get('applyTime') + '&' +
                'toName=' + object.get('toName') + '&' +
                'state=' + object.get('state') + '&' +
                'id=' + object.id
              };
              applylist[i] = applyInfo;
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
            console.log("查询失败: " + error.code + " " + error.message);
          }
        });
      }
    } catch (e) {
      // Do something when catch error
      console.log("出错了");
    }
  },
  delItem: function (event) {
    var that = this;
    console.log(event.currentTarget.dataset.curId);

    wx.showModal({
      title: '提示',
      content: '确认删除吗？',
      success: function (res) {
        if (res.confirm) {
          var ApplyInfo = Bmob.Object.extend("applyInfo");
          var applyInfo = new ApplyInfo();
          applyInfo.set('objectId', event.currentTarget.dataset.curId);
          applyInfo.destroy({
            success: function (myObject) {
              // 删除成功
              console.log('删除成功');
              that.onShow();
            },
            error: function (myObject, error) {
              // 删除失败
              console.log('删除失败');
            }
          });
        }
      }
    })


  }
})