// pages/msg/msgList.js
const app = getApp();
const context = app.globalData.context;
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _num:1,
    msgList:[],
    type:0,
    chatNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    queryMyWhisperList(app.globalData.userInfo.openid, this.data.type,function(size){
        that.setData({
          chatNum: size
        });
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
  
  },
  catchTouchMove: function () {
    return true;
  },
  showMsgList:function(e){
    var type;
    var num = e.target.dataset.num;
    if (num == 1){
      type = 0;
    }else if(num == 2){
      type = 1;
    } else if (num == 3){
      type = 2;
    }
    var n = this.data.type;
    if (type != num){
      this.setData({
        _num: e.target.dataset.num,
        type: type
      })
      queryMyWhisperList(app.globalData.userInfo.openid, type);
    }
  },
  doLike:function(e){//点赞---这里不设点赞
    // console.log(e.currentTarget.dataset.text);
    // console.log(e.currentTarget.dataset.num);
  },
  doLook:function(e){//查看
    var whisperId = e.currentTarget.dataset.text;
    var isView = e.currentTarget.dataset.num;
    if (isView == 1){
        wx.showToast({
          title: '您已经查看过了',
          icon:"none",
          duration:1500
        })
    }else{
      wx.request({
        //后台接口地址
        url: context + 'msg/lookUp',
        method: "POST",
        data: {
          "whisperId": whisperId,
          "isView":1
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          queryMyWhisperList(app.globalData.userInfo.openid, that.data.type);
        }
      })
    }
  },
  deleteWhisper:function(e){//删除
    var whisperId = e.currentTarget.dataset.text;
    wx.showModal({
      title: '警告',
      content: '是否删除留言?',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            //后台接口地址
            url: context + 'msg/deleteWhisper',
            method: "POST",
            data: {
              "whisperId": whisperId
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              wx.showToast({
                title: '删除成功!',
                icon: "success",
                duration: 1500
              })
              queryMyWhisperList(app.globalData.userInfo.openid, that.data.type);
            }
          })
        }
      }
    })
  }
})

/**
 * 查看倾述留言列表
 */
function queryMyWhisperList(toOpenid,type,callback){
  wx.request({
    //后台接口地址
    url: context + 'msg/queryMyWhisperList',
    method: "POST",
    data: {
      "toOpenId": toOpenid,
      "type":type
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      that.setData({
        msgList: res.data.data
      })
      if (callback){
        callback(res.data.data.length);
      }
    }
  })
}
