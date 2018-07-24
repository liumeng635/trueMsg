// pages/share/sharePage.js
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
      return {
        title:"转发",
        path:'/pages/index/index?id='+1,
        imageUrl:'../img/shareImg.png',
        success(e){
          wx.showShareMenu({
            withShareTicket:true
          });
        },
        fail(e){

        },
        complete(){}
      }
  },
  saveShareQrcode:function(){
    const token = "12_1fcgOcRmfFmX7Qkha7k1lZkOKQDx4JMgEDQOSp-WP4HhHrVAXWr8qVPjfokvpvcRKBEA_akWu9iMfRHH_ezs7RRGLnjdMqNsqRfcnoJJ4JyW6JegK2DwlnXd3Myq3kKjdAhv_kf7fay-nc4ECFGcACAXAB";
     wx.request({
      header: {
        'content-type': 'application/json'
      },
      url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token='+token, //仅为示例，并非真实的接口地址
      method:'POST',
      data:{
        scene:"liumeng",
        page:'pages/index/index',
        width: 500,
        auto_color:false,
        line_color: {"r":"100","g":"173","b":"97"},
        is_hyaline:false
      },
      success: function (res) {
        console.log(res.data)
      }
    })
  }
})