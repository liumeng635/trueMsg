  //index.js
  //获取应用实例
  const app = getApp();
  var fileData = require('../../utils/data.js')
  var page;
  var tagIndex = 0;
  const context = app.globalData.context;
  Page({
    data: {
      userInfo: {},
      avatarUrl:"",
      toUserId:"",
      toNickName:"",
      hasUserInfo: false,
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      isPlayingMusic:'',//是否正在播放音乐
      isSelfPause:'',//是否认为停止播放
      imageRotate:'image-rotate',
      doommData: [],
      whisper:'',
      tagTxts:[],
      itemClasses:[],
      dataLength:0,
      msgColor:"#000033",//消息显示颜色,
      meColor:"#CC0000",
      msgList:[],
      isLikesArr:[]
    },
    //事件处理函数
    bindViewTap: function() {
      wx.navigateTo({
        url: '../logs/logs'
      })
    },
    
    onLoad: function (options) {
      page = this;
      //查看是否授权---未授权去授权
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function (res) {
                //console.log(res.userInfo);//用户已经授权过
              }
            })
          } else {
            wx.showModal({
              title: '注意',
              showCancel: false,
              confirmText: '好去授权',
              content: '为了您更好的体验,请先同意授权',
              success: function (res) {
                wx.navigateTo({
                  url: '../userInfo/index'
                });
              }
            })
          }
        }
      })

      //获取userInfo
      if (app.globalData.userInfo) {
        queryMyWhisperList(app.globalData.userInfo.openid);
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true,
          avatarUrl: app.globalData.userInfo.avatarUrl
        })
        //先查询用户是否是新用户且是否授权--新用户新增用户记录 返回用户信息 并将倾述对象id默认为当前用户==to-do
        //是否扫码进入=====扫码进入的二维码会带上以二维码对象的openid作为toUserId的参数
        var scene = decodeURIComponent(options.scene);//sense参数
        if (scene !== 'undefined') {//userInfo是对方
          //查询倾述对象信息
          var toUserId = options.query.toUserId;
          page.setData({
            toUserId: toUserId
          })
          setToAavatar(toUserId);
        } else {//倾述对象是自己
          this.setData({
            toUserId: app.globalData.userInfo.openid,
            avatarUrl: app.globalData.userInfo.avatarUrl,
            toNickName: app.globalData.userInfo.nickName
          })
        }
      } else if (this.data.canIUse) {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          queryMyWhisperList(res.userInfo.openid);
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
          });

          //先查询用户是否是新用户且是否授权--新用户新增用户记录 返回用户信息 并将倾述对象id默认为当前用户==to-do
          //是否扫码进入=====扫码进入的二维码会带上以二维码对象的openid作为toUserId的参数
          var scene = decodeURIComponent(options.scene);//sense参数
          if(scene !== 'undefined') {//userInfo是对方
            //查询倾述对象信息
            var toUserId = options.query.toUserId;
            page.setData({
              toUserId: toUserId
            })  
            setToAavatar(toUserId);
          } else {//倾述对象是自己
            page.setData({
              toUserId: this.data.userInfo.openid,
              avatarUrl: this.data.userInfo.avatarUrl,
              toNickName: this.data.userInfo.nickName
            })
          }

        }
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            page.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })

            //先查询用户是否是新用户且是否授权--新用户新增用户记录 返回用户信息 并将倾述对象id默认为当前用户==to-do
            //是否扫码进入=====扫码进入的二维码会带上以二维码对象的openid作为toUserId的参数
            var scene = decodeURIComponent(options.scene);//sense参数
            if (scene !== 'undefined') {//userInfo是对方
              //查询倾述对象信息
              var toUserId = options.query.toUserId;
              page.setData({
                toUserId: toUserId
              })
              setToAavatar(toUserId);
            } else {//倾述对象是自己
              page.setData({
                toUserId: res.userInfo.openid,
                avatarUrl: res.userInfo.avatarUrl,
                toNickName: res.userInfo.nickName
              })
            }
          }
        })
      }

      wx.playBackgroundAudio({//播放背景音乐
        // dataUrl: 'http://www.ytmp3.cn/down/47264.mp3'
        // dataUrl: 'http://www.ytmp3.cn/down/37395.mp3'
        // dataUrl: 'http://sc1.111ttt.cn/2015/1/08/05/101052215331.mp3'
        // dataUrl: 'http://www.ytmp3.cn/down/34981.mp3'
        dataUrl:app.globalData.backUrl
      });

      setInterval(function () {//监听音乐循环播放
        wx.onBackgroundAudioStop(function(){
          wx.playBackgroundAudio({
            // dataUrl: 'http://www.ytmp3.cn/down/47264.mp3'
            // dataUrl: 'http://www.ytmp3.cn/down/37395.mp3'
            // dataUrl: 'http://sc1.111ttt.cn/2015/1/08/05/101052215331.mp3'
            // dataUrl: 'http://www.ytmp3.cn/down/34981.mp3'
            dataUrl: app.globalData.backUrl
          });
        })
      }, 500);

      //加载默认标签文字
      this.setData({
        tagTxts: fileData.tagData(tagIndex)
      });
    },
    getUserInfo: function(e) {
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
          // dataUrl: 'http://www.ytmp3.cn/down/37395.mp3'
          // dataUrl: 'http://sc1.111ttt.cn/2015/1/08/05/101052215331.mp3'
          // dataUrl: 'http://www.ytmp3.cn/down/34981.mp3'
          dataUrl: app.globalData.backUrl
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
    showWhisper:function(e){//点击确定发送弹幕
      var whis = this.data.whisper;
      if (whis != ''){
        this.setData({
          whisper:""
        });
        //将信息显示列表
        // var top = tops[page.data.dataLength-1] + baseHeight;
        // dommList.push(new Doomm(whis, top, Math.ceil(Math.random() * 10), page.data.meColor, '-1', 0));
        clearInterval(intIndex);
        //添加倾述信息记录
        try{
          wx.request({
            //后台接口地址
            url: context + 'msg/recordWhisper',
            method: "POST",
            data: {
              message: whis,
              fromOpenId: this.data.userInfo.openid,
              toOpenId: this.data.toUserId,
              showTime: Math.ceil(Math.random() * 10)
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              setTimeout(function () {
                queryMyWhisperListForLike(app.globalData.userInfo.openid);
              }, sortTime[0] * 1000);
            },fail:function(){
              wx.showToast({
                title: '后台服务出错!',
                "icon": "none"
              })
            }
          })
        }catch(e){
          console.log(e);
        }
      }
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
    },
    changeTagTxt:function(){
      tagIndex++;
      if (tagIndex > 2){
        tagIndex = 0;
      }
      this.setData({
        tagTxts: fileData.tagData(tagIndex)
      });
    },
    bindGetUserInfo: function (e) {
      console.log(e.detail.userInfo)
    },
    doLike: function (e) {//点赞/取消点赞
      var whisperId = e.currentTarget.dataset.text;
      var isLike = e.currentTarget.dataset.num;
      var dataId = e.currentTarget.dataset.index;
      var dataLength = page.data.dataLength;
      if(isLike == 0){
        itemClassesD[dataId % dataLength]="icon-buoumaotubiao16";
        isLikes[dataId % dataLength] = isLikes[dataId % dataLength] +1;
      }else{
        itemClassesD[dataId % dataLength] = "icon-buoumaotubiao15";
        isLikes[dataId % dataLength] = isLikes[dataId % dataLength] - 1;
      }
      page.setData({
        itemClasses: itemClassesD,
        isLikesArr: isLikes
      });
      wx.request({
        //后台接口地址
        url: context + 'like/doLike',
        method: "POST",
        data: {
          "whisperId": whisperId,
          "isLike": isLike,
          "likeOpenId": app.globalData.userInfo.openid
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          clearInterval(intIndex);
          setTimeout(function(){
            queryMyWhisperListForLike(app.globalData.userInfo.openid);
          },sortTime[0]*1000);
        }
      })
    }
  })

  //===============弹幕
  var doommList = [];
  var i = 0;//用做唯一的wx:key
class Doomm {
  constructor(text, top, time, color,whisperId,isLike) {
    if (time < 5) {
      time = 5;
    }
    this.text = text;
    this.top = top;
    this.time = time;
    this.color = color;
    this.display = true;
    this.whisperId = whisperId;
    this.isLike = isLike;
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

/**
 * 查看倾述留言列表
 */
var intIndex;
var dommList = [];
var tops = [];
var baseHeight = 12;
var sortTime = [];
var itemClassesD = [];
var isLikes = [];
function queryMyWhisperList(toOpenid) {
  if (intIndex) { clearInterval(intIndex);}
  try{
    wx.request({
      //后台接口地址
      url: context + 'msg/queryMyWhisperList',
      method: "POST",
      data: {
        "toOpenId": toOpenid,
        "type": 0
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        page.setData({
          msgList:res.data.data
        });
        var msgList = page.data.msgList;
        
        //生成一组top值保证弹幕不被遮挡
        page.setData({
          dataLength: msgList.length
        });
        for(var i=1;i<=msgList.length;i++){
          tops.push(baseHeight * (i-1));
        }
        
        for (var i in msgList) {
          var isLike = msgList[i]['isLike'];
          isLikes.push(isLike);
          if (isLike == 0){
            itemClassesD.push("icon-buoumaotubiao15");
          }else{
            itemClassesD.push("icon-buoumaotubiao16");
          }
          //
          sortTime.push(msgList[i]['showTime']);
          dommList.push(new Doomm(msgList[i]['message'], tops[i], msgList[i]['showTime'], page.data.msgColor, msgList[i]['whisperId'], msgList[i]['isLike']));
        }
        page.setData({
          doommData: dommList,
          itemClasses: itemClassesD,
          isLikesArr: isLikes
        })
        sortTime.sort(function (x, y) {
          return y - x;
        });
        setIntervelShow();
      },fail:function(){
        wx.showToast({
          title: '后台服务出错!',
          "icon": "none"
        })
      }
    })
  }catch(e){
    console.log(e);
  }
}


function setIntervelShow(){
  //循环弹幕
  intIndex = setInterval(function () {
    for (var i in dommList) {
      doommList.push(dommList[i]);
    }
    page.setData({
      doommData: doommList,
      itemClasses: itemClassesD,
      isLikesArr: isLikes
    });
  }, sortTime[0] * 1000);
}



function queryMyWhisperListForLike(toOpenid) {
  try {
    wx.request({
      //后台接口地址
      url: context + 'msg/queryMyWhisperList',
      method: "POST",
      data: {
        "toOpenId": toOpenid,
        "type": 0
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        page.setData({
          msgList: res.data.data
        });
        var msgList = page.data.msgList;
        //生成一组top值保证弹幕不被遮挡
        page.setData({
          dataLength: msgList.length
        });
        tops = [];
        itemClassesD = [];
        dommList = [];
        sortTime = [];
        isLikes = [];
        for (var i = 1; i <= msgList.length; i++) {
          tops.push(baseHeight * (i - 1));
        }
        for (var i in msgList) {
          var isLike = msgList[i]['isLike'];
          isLikes.push(isLike);
          if (isLike == 0 || isLike == "undefined") {
            itemClassesD.push("icon-buoumaotubiao15");
          } else {
            itemClassesD.push("icon-buoumaotubiao16");
          }
          //
          sortTime.push(msgList[i]['showTime']);
          dommList.push(new Doomm(msgList[i]['message'], tops[i], msgList[i]['showTime'], page.data.msgColor, msgList[i]['whisperId'], msgList[i]['isLike']));
        }
        sortTime.sort(function (x, y) {
          return y - x;
        });
        setIntervelShow();
      }, fail: function () {
        wx.showToast({
          title: '后台服务出错!',
          "icon": "none"
        })
      }
    })
  } catch (e) {
    console.log(e);
  }
}




/**
 * 设置昵称和头像
 */
function setToAavatar(toUserId){
    wx.request({
      //后台接口地址
      url: context + 'user/getToUserInfo',
      method: "POST",
      data: {
        toUserId: toUserId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        page.setData({
          avatarUrl: res.data.data.avatarUrl,
          toNickName: res.data.data.nickName
        })
      }, 
      fail: function () {//失败
          wx.showToast({
            title: '后台服务出错!',
            "icon":"none"
          })
      }
    })
    
}
