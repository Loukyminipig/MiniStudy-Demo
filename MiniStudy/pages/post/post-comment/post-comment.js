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
    chooseFiles: [],
    deleteIndex: -1,
    currentAudio: ''
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
    var imgs = this.data.chooseFiles;
    var newData = {
      username: "青石",
      avatar: "/images/avatar/7.jpg",
      create_time: new Date().getTime() / 1000,
      content: {
        txt: this.data.keyboardInputValue,
        img: imgs
      },
    };
    if (!newData.content.txt && imgs.length == 0) {
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
      keyboardInputValue: '',
      chooseFiles: [],
      sendMoreMsgFlag: false
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
  },

  recordStart: function () {
    var that = this;
    this.setData({
      recordingClass: 'recording'
    });

    this.startTime = new Date();
    wx.startRecord({
      success: function (res) {
        var diff = (that.endTime - that.startTime) / 1000;
        diff = Math.ceil(diff);
        that.submitVoiceComment({ url: res.tempFilePath, timeLen: diff });
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },

  recordEnd: function () {
    this.setData({
      recordClass: ''
    });
    this.endTime = new Date();
    wx.stopRecord();
  },

  submitVoiceComment: function (audio) {
    var newData = {
      username: '青石',
      avatar: '/images/avatar/1.jpg',
      create_time: new Date().getTime() / 1000,
      content: {
        txt: '',
        img: [],
        audio: audio
      }
    };

    this.dbPost.newComment(newData);
    this.showCommitSuccessToast();
    this.bindCommentData();
  },

  playAudio: function (event) {
    var url = event.currentTarget.dataset.url;
    var that = this;
    console.log(url);
    console.log(this.data.currentAudio);
    if (url == this.data.currentAudio) {
      wx.pauseVoice({
        success: function(res){
          console.log('pauseVoice-success');
          console.log(res);
        },
        fail:function(res){
          console.log('pauseVoice-fail');
          console.log(res);
        },
        complete:function(res){
          console.log('pauseVoice-complete');
          console.log(res);
        }
      })
      this.data.currentAudio = '';
    } else {
      this.data.currentAudio = url;
      wx.playVoice({
        filePath: url,
        success: function(res){
          console.log('playVoice-success');
          console.log(res);
        },
        fail:function(res){
          console.log('playVoice-fail');
          console.log(res);
        },
        complete:function(res){
          that.data.currentAudio = '';
          console.log('playVoice-complete');
          console.log(res);
        }
      })
    }
  }
})