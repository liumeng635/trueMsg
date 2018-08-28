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
    chatShow:0,
    showModal: false,
    showPayModal:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    queryMyWhisperList(app.globalData.userInfo.openid, this.data.type);
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
  doLike:function(e){//点赞/取消点赞---这里不设点赞
    var whisperId = e.currentTarget.dataset.text;
    var isLike = e.currentTarget.dataset.num;
    wx.request({
      //后台接口地址
      url: context + 'like/doLike',
      method: "POST",
      data: {
        "whisperId": whisperId,
        "isLike": isLike,
        "likeOpenId":app.globalData.userInfo.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        queryMyWhisperList(app.globalData.userInfo.openid, that.data.type);
      }
    })
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
    }else{//查看
      // wx.showModal({
      //   title: '提示',
      //   content: '解锁该评论人需要支付1元，请在阅读<view class="modal-a">付款须知</view>后继续付款',
      //   showCancel:true,
      //   cancelText:'取消',
      //   confirmText:'继续付款',
      //   success: function (res) {
      //     if (res.confirm) {
      //       console.log('用户点击确定')
      //     } else if (res.cancel) {
      //       console.log('用户点击取消')
      //     }
      //   }
      // })
      this.setData({
        showModal: true
      })
      return;
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
  hideModal: function () {//隐藏弹窗
    this.setData({
      showModal: false
    });
  },
  hidePayModal: function () {//隐藏弹窗
    this.setData({
      showPayModal: false
    });
  },
  onCancel: function () {//点击取消
    this.hideModal();
  },
  onPayCancel: function () {//点击取消
    this.hidePayModal();
  },
  onConfirm: function () {//点击确定
    this.hideModal();
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
  },
  showPayNote:function(){//显示付款须知
      this.setData({
        showPayModal:true
      });
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
      var headStr = "";
      if(type==0){
        headStr = "共有" + res.data.data.length+"位朋友对你说了心里话";
      } else if (type == 1){
        headStr = "共有" + res.data.data.length+"句心里话被点赞";
      } else if (type == 2){
        headStr = "共查看了" + res.data.data.length + "位朋友对你说的心里话";
      }
      that.setData({
        msgList: res.data.data,
        chatShow: headStr
      })
      if (callback){
        callback(res.data.data.length);
      }
    }
  })
}
