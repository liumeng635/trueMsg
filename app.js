//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code;
        let app = this;
          wx.request({
            url: app.globalData.context + 'user/jscode2session',
            method: "GET",
            data: {
              "js_code": code,
              "grant_type": 'authorization_code',
            },
            success: function (reslg) {
              var openid = reslg.data.data.openid;
              app.globalData.openid = openid; //用户唯一标识
              // 获取用户信息
              wx.getSetting({
                success: res => {
                  if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                      withCredentials: true,
                      success: res => {
                        // 可以将 res 发送给后台解码出 unionId
                        res.userInfo.openid = openid;
                        app.globalData.userInfo = res.userInfo;
                        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                        // 所以此处加入 callback 以防止这种情况
                        if (app.userInfoReadyCallback) {
                          app.userInfoReadyCallback(res)
                        }
                      }
                    })
                  }
                }
              })
            },fail:function(){
              wx.showToast({
                title: '后台服务出错!',
                "icon": "none"  
              })
              // 获取用户信息
              wx.getSetting({
                success: res => {
                  if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                      withCredentials: true,
                      success: res => {
                        // 可以将 res 发送给后台解码出 unionId
                        app.globalData.userInfo = res.userInfo;
                        app.globalData.userInfo.openid="";
                        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                        // 所以此处加入 callback 以防止这种情况
                        if (app.userInfoReadyCallback) {
                          app.userInfoReadyCallback(res)
                        }
                      }
                    })
                  }
                }
              })
            }
          })
      }
    })
  },
  globalData: {
    userInfo: null,
    openid: null,
    context:'http://192.168.31.129:8888/',
    // context: 'http://127.0.0.1:8888/',
    backUrl:'http://www.ytmp3.cn/down/34532.mp3'
  }
})