import { DBPost } from '../../../db/DBPost.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id;
    this.dbPost = new DBPost(postId);
    this.postData = this.dbPost.getPostItemById().data;
    console.log(this.postData);
    this.setData({
      post: this.postData
    });
    this.addReadingTimes();
    this.setMusicMonitor();
    this.initMusicStatus();
    this.setAniation();
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
    console.log('post-detail onUnload');
    this.setData({
      isPlayingMusic: false
    })
    wx.stopBackgroundAudio({
      success: function (res) {
        console.log('stopBackgroundAudio-success');
        console.log(res);
      },
      fail: function (res) {
        console.log('stopBackgroundAudio-fail');
        console.log(res);
      },
      complete: function (res) {
        console.log('stopBackgroundAudio-complete');
        console.log(res);
      }
    })
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

  onCollectionTap: function (event) {
    var newData = this.dbPost.collect();
    this.setData({
      'post.collectionStatus': newData.collectionStatus,
      'post.collectionNum': newData.collectNum
    });
    wx.showToast({
      title: newData.collectionStatus ? '收藏成功' : '取消成功',
      duration: 1000,
      icon: 'success',
      mask: true
    })
  },

  onUpTap: function () {
    var newData = this.dbPost.up();
    this.setData({
      'post.upStatus': newData.upStatus,
      'post.upNum': newData.upNum
    });
  },

  onCommentTap: function (event) {
    var id = event.currentTarget.dataset.postId;
    wx.navigateTo({
      url: '../post-comment/post-comment?id=' + id,
    })
  },

  addReadingTimes: function () {
    this.dbPost.addReadingTimes();
  },

  onMusicTap: function (event) {
    if (this.data.isPlayingMusic) {
      wx.pauseBackgroundAudio({
        success: function (res) {
          console.log('pauseBackgroundAudio-success');
          console.log(res);
        },
        fail: function (res) {
          console.log('pauseBackgroundAudio-fail');
          console.log(res);
        },
        complete: function (res) {
          console.log('pauseBackgroundAudio-complete');
          console.log(res);
        }
      });
      this.setData({
        isPlayingMusic: false
      });
      app.globleData.g_isPlayingMusic = false;
    } else {
      wx.playBackgroundAudio({
        dataUrl: this.postData.music.url,
        title: this.postData.music.title,
        coverImgUrl: this.postData.music.coverImg,
        success: function (res) {
          console.log('playBackgroundAudio-success');
          console.log(res);
        },
        fail: function (res) {
          console.log('playBackgroundAudio-fail');
          console.log(res);
        },
        complete: function (res) {
          console.log('playBackgroundAudio-complete');
          console.log(res);
        }
      });
      this.setData({
        isPlayingMusic: true
      });
      app.globleData.g_isPlayingMusic = true;
      app.globleData.g_currentMusicPostId = this.postData.postId;
    }
  },

  setMusicMonitor: function () {
    var that = this;
    wx.onBackgroundAudioStop(function () {
      this.setData({
        isPlayingMusic: false
      })
      app.globleData.g_isPlayingMusic = false;
    });

    wx.onBackgroundAudioPlay(function () {
      if (app.globleData.g_currentMusicPostId == this.postData.postId) {
        this.setData({
          isPlayingMusic: true
        })
      }
      app.globleData.g_isPlayingMusic = true;
    });

    wx.onBackgroundAudioPause(function () {
      if (app.globleData.g_currentMusicPostId == this.postData.postId) {
        this.setData({
          isPlayingMusic: false
        })
      }
      app.globleData.g_isPlayingMusic = false;
    })
  },

  initMusicStatus: function () {
    var currentPostId = this.postData.postId;
    if (app.globleData.g_isPlayingMusic &&
      app.globleData.g_currentMusicPostId == currentPostId) {
      this.setData({
        isPlayingMusic: true
      });
    } else {
      this.setData({
        isPlayingMusic: false
      })
    }
  },

  onShareAppMessage: function () {
    return {
      title: this.postData.title,
      desc: this.postData.content,
      path: '/pages/post/post-detail/post-detail'
    }
  },

  setAniation: function () {
    var animationUp = wx.createAnimation({
      timingFunction: 'ease-in-out'
    })
    this.animationUp = animationUp;
  },

  onUpTap: function (event) {
    var newData = this.dbPost.up();
    this.setData({
      'post.upStatus': newData.upStatus,
      'post.upNum': newData.upNum
    });

    this.animationUp.scale(2,2).rotate(45).step();
    this.setData({
      animationUp: this.animationUp.export()
    })
    setTimeout(function () {
      this.animationUp.scale(1,1).rotate(0).step();
      this.setData({
        animationUp: this.animationUp.export()
      })
    }.bind(this), 300);
  }
})