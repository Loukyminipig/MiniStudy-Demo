// app.js

App({
  onLaunch() {
    // var storageData = wx.getStorageSync('postList');
    // if(!storageData){
    //   var dataObj = require("data/data.js");
    //   wx.clearStorageSync();
    //   wx.setStorageSync('postList', dataObj.postList);
    // }
  },
  globleData: {
    g_isPlayingMusic: false,
    g_currentMusicPostId: null
  }
})
