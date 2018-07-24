  //index.js
  //获取应用实例
  const app = getApp();
  var page;
  Page({
    data: {
      userInfo: {},
      hasUserInfo: false,
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      isPlayingMusic:'',//是否正在播放音乐
      isSelfPause:'',//是否认为停止播放
      imageRotate:'image-rotate',
      doommData: [],
      whisper:''
    },
    //事件处理函数
    bindViewTap: function() {
      wx.navigateTo({
        url: '../logs/logs'
      })
    },
    onLoad: function (options) {
      page = this;
      wx.playBackgroundAudio({//播放背景音乐
        // dataUrl: 'http://www.ytmp3.cn/down/47264.mp3'
        dataUrl: 'http://www.ytmp3.cn/down/37395.mp3'
      });

      //查看是否授权
      wx.getSetting({
        success:function(res){
            if(res.authSetting['scope.userInfo']){
              wx.getUserInfo({
                success:function(res){
                    console.log(res.userInfo);//用户已经授权过
                }
              })
            }
        }
      })    

      setInterval(function () {//监听音乐循环播放
        wx.onBackgroundAudioStop(function(){
          wx.playBackgroundAudio({
            // dataUrl: 'http://www.ytmp3.cn/down/47264.mp3'
            dataUrl: 'http://www.ytmp3.cn/down/37395.mp3'
          });
        })
      }, 500);

      if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      } else if (this.data.canIUse){
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        })
      }
      //加载弹幕
      // setInterval(function(){
      //   doommList.push(new Doomm("你是我的小苹果", Math.ceil(Math.random() * 100-20), Math.ceil(Math.random() * 10), getRandomColor()));
      //   doommList.push(new Doomm("我好喜欢你哦", Math.ceil(Math.random() * 100 - 20), Math.ceil(Math.random() * 10), getRandomColor()));
      //   doommList.push(new Doomm("你真帅啊", Math.ceil(Math.random() * 100 - 20), Math.ceil(Math.random() * 10), getRandomColor()));
      //   doommList.push(new Doomm("你好漂亮", Math.ceil(Math.random() * 100 - 20), Math.ceil(Math.random() * 10), getRandomColor()));
      //   page.setData({
      //     doommData: doommList
      //   })
      // },1000);
    },
    getUserInfo: function(e) {
      console.log(e)
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    },
    onmusicTap: function (event) {
      if (this.data.isPlayingMusic) {
        wx.pauseBackgroundAudio();
        this.setData({
          isPlayingMusic: false,
          isSelfPause:true,
          imageRotate:'image-rotate-none'
        });
      } else {
        wx.playBackgroundAudio({
          dataUrl: 'http://www.ytmp3.cn/down/37395.mp3'
        });
        this.setData({
          isPlayingMusic: true,
          isSelfPause:false,
          imageRotate: 'image-rotate'
        });
      }
    },
    catchTouchMove:function(){
      return false;
    },
    toMsgList: function () {
      wx.navigateTo({
        url: '../msg/msgList'
      })
    },
    bindtapFunc:function(e){//标签点击
      this.setData({
        whisper: e.currentTarget.dataset.text
      });
    },
    showWhisper:function(e){//点击确定
      console.log(this.data.whisper);
      doommList.push(new Doomm(this.data.whisper, Math.ceil(Math.random() * 100 - 20), Math.ceil(Math.random() * 10), getRandomColor()));
      page.setData({
          doommData: doommList
      })
    },
    whisperInput:function(e){//监听留言输入
      this.setData({
        whisper: e.detail.value
      });
    },
    bindGetUserInfo:function(e){
        if(e.detail.userInfo){
          console.log("用户允许授权按钮");
        }else{
          console.log("用户取消授权按钮");
        }
    },
    toShare:function(){
      wx.navigateTo({
        url: '../share/sharePage'
      })
    }
  })


  var doommList = [];
  var i = 0;//用做唯一的wx:key
  class Doomm {
    constructor(text, top, time, color) {
      if (time<5){
        time = 5;
      }
      this.text = text;
      this.top = top;
      this.time = time;
      this.color = color;
      this.display = true;
      let that = this;
      this.id = i++;
      setTimeout(function () {
        doommList.splice(doommList.indexOf(that), 1);//动画完成，从列表中移除这项
        page.setData({
          doommData: doommList
        })
      }, this.time * 1000)//定时器动画完成后执行。
    }
  }
  function getRandomColor() {
    let rgb = []
    for (let i = 0; i < 3; ++i) {
      let color = Math.floor(Math.random() * 256).toString(16)
      color = color.length == 1 ? '0' + color : color
      rgb.push(color)
    }
    return '#' + rgb.join('')
  }
