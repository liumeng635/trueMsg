// pages/userInfo/index.js
const app = getApp();
const context = app.globalData.context;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  bindgetuserinfo: function (e) {
    var that = this;
    if (e.detail.userInfo) {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      wx.login({
        success: res => {
          wx.request({
            //后台接口地址
            url: context+'user/jscode2session',
            method: "GET",
            data: {
              "js_code": res.code,
              "grant_type": 'authorization_code'
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              var openid = res.data.data.openid;
              var openid = res.data.data.openid;
              e.detail.userInfo.openid = openid;
              var userInfo = e.detail.userInfo;
              wx.request({
                //后台接口地址
                url: context + 'user/registerUser',
                method: "POST",
                data: userInfo,
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                  wx.navigateTo({
                    url: '../index/index'
                  });
                }
              })
            }
          })
        }
      })
    } else {
      wx.showToast({
        title: "为了您更好的体验,请先同意授权",
        icon: 'none',
        duration: 2000
      });
    }
  }
})