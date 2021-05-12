// pages/post/post.js
// var dataObj = require("../../data/data.js");
import { DBPost } from '../../db/DBPost.js';
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
    // console.log("post onLoad");
    var dbPost = new DBPost();
    this.setData({
      postList: dbPost.getAllPostData()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log("post onReady");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log("post onShow");
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // console.log("post onHide");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // console.log("post onUnload");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // console.log("post onPullDownRefresh");
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // console.log("post onReachBottom");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // console.log("post onShareAppMessage");
  },

  onTapToDetail:function(event) {
    console.log("post onTapToDetail");
    var postId = event.currentTarget.dataset.postId;
    wx.navigateTo({
      url: 'post-detail/post-detail?id='+postId,
    })
  },

  onSwiperTop:function(event){
    var postId = event.target.dataset.postId;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  }
})