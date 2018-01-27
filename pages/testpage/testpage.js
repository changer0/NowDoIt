// pages/testpage/testpage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bmobdata: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad")

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("onHide")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("onUnload")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("console")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log("onShareAppMessage")
  },

  //自定义的函数
  savedata: function() {
    var Bmob = require('../../utils/bmob.js');
    var Diary = Bmob.Object.extend("diary");
    var diary = new Diary();
    diary.set("title", "hello");
    diary.set("content", "hello world");
    //添加数据，第一个入口参数是null
    diary.save(null, {
      success: function (result) {
        // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
        console.log("日记创建成功, objectId:" + result.id);

      },
      error: function (result, error) {
        // 添加失败
        console.log('创建日记失败');
        wx.showModal({
          title: "弹窗标题",
          content: "创建日记失败",
          showCancel: true,
          confirmText: "确定"
        })
      }
    });
  },
  getdata: function () {
    var self = this;
    var Bmob = require('../../utils/bmob.js');
    var Diary = Bmob.Object.extend("diary");
    var query = new Bmob.Query(Diary);
    query.get("a8b21b8777", {
      success: function (result) {
        // The object was retrieved successfully.
        console.log("该日记标题为" + result.get("title"));
        self.setData({
          bmobdata: result.get("title")
        })
      },
      error: function (result, error) {
        wx.showModal({
          title: "弹窗标题",
          content: "获取日记失败",
          showCancel: true,
          confirmText: "确定"
        })
      }
    });
  }
})