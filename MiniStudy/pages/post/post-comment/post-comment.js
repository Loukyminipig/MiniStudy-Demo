// pages/post/post-comment/post-comment.js
import { DBPost } from '../../../db/DBPost.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    useKeyboardFlag: true,
    keyboardInputValue: '',
    sendMoreMsgFlag: false,
    chooseFiles: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id;
    this.dbPost = new DBPost(postId);
    // console.log("post comment onload id=" + postId);
    var comments = this.dbPost.getCommentData();
    // console.log(comments);
    this.setData({
      comments: comments
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

  previewImg: function (event) {
    var commentIdx = event.currentTarget.dataset.commentIdx;
    var imgIdx = event.currentTarget.dataset.imgIdx;
    var imgs = this.data.comments[commentIdx].content.img;
    console.log(event.currentTarget);
    wx.previewImage({
      current: imgs[imgIdx],
      urls: imgs,
    })
  },

  switchInputType: function (event) {
    this.setData({
      useKeyboardFlag: !this.data.useKeyboardFlag
    })
  },

  bindCommentInput: function (event) {
    var val = event.detail.value;
    // console.log(val);
    this.data.keyboardInputValue = val;
  },

  submitComment: function (event) {
    var newData = {
      username: "青石",
      avatar: "/images/avatar/7.jpg",
      create_time: new Date().getTime() / 1000,
      content: {
        txt: this.data.keyboardInputValue
      },
    };
    if (!newData.content.txt) {
      return;
    }
    this.dbPost.newComment(newData);
    this.showCommitSuccessToast();
    this.bindCommentData();
    this.resetAllDefaultStatus();
  },

  showCommitSuccessToast: function () {
    wx.showToast({
      title: '评论成功',
      duration: 1000,
      icon: 'success'
    })
  },

  bindCommentData: function () {
    var comments = this.dbPost.getCommentData();
    this.setData({
      comments: comments
    })
  },

  resetAllDefaultStatus: function () {
    this.setData({
      keyboardInputValue: ''
    })
  },

  sendMoreMsg: function () {
    this.setData({
      sendMoreMsgFlag: !this.data.sendMoreMsgFlag
    })
  },

  chooseImage: function (event) {
    var imgArr = this.data.chooseFiles;
    var leftCount = 3 - imgArr.length;
    if (leftCount < 0) {
      return;
    }
    var sourceType = event.currentTarget.dataset.category;
    var that = this;
    wx.chooseImage({
      count: leftCount,
      sourceType: sourceType,
      success: function (res) {
        console.log(res);
        that.setData({
          chooseFiles: imgArr.concat(res.tempFilePaths)
        })
      }
    })
  },

  deleteImage: function (event) {
    var index = event.currentTarget.dataset.idx;
    var that = this;
    that.setData({
      deleteIndex: index
    })
    that.data.chooseFiles.splice(index, 1);
    setTimeout(function () {
      that.setData({
        deleteIndex: -1,
        chooseFiles: that.data.chooseFiles
      })
    }, 500)
  }
})