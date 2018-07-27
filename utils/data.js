module.exports = {
  tagData: tagData,
  downloadImage: downloadImage,
  guid: guid
}

function tagData(i) {
  var tags1 = ["你好帅啊", "我好喜欢你", "你真漂亮", "你是一个逗比", "你真棒", "我喜欢你好久了", "愿你一切安好"];
  var tags2 = ["你讨厌你", "你是一个大傻逼", "你太天真了", "你好装逼", "年轻人收敛点", "我们一起加油", "愿世界和平"];
  var tags3 = ["与你同在", "你若安好便是晴天", "晚上早点睡吧", "我看好你哦", "你好活跃", "好想你啊", "愿来生再见"];
  if(i==0){
    return tags1;
  }else if (i==1) {
    return tags2;
  }else if (i==2) {
    return tags3;
  }
}

function downloadImage(imageUrl) {
  // 保存图片到系统相册  
  wx.saveImageToPhotosAlbum({
    filePath: imageUrl,
    success(res) {
      console.log("保存图片：success");
      wx.showToast({
        title: '保存成功',
      });
    },
    fail(res) {
      console.log("保存图片：fail");
      console.log(res);
    }
  })
}


function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
function guid() {
  return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
}