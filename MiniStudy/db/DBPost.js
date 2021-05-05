var util = require('../utils/util.js');
class DBPost {
  constructor(postId) {
    this.storageKeyName = 'postList';
    this.postId = postId;
  }
  getAllPostData() {
    var res = wx.getStorageSync(this.storageKeyName);
    if (!res) {
      res = require('../data/data.js').postList;
      this.execStorageSync(res);
    }
    return res;
  }
  execStorageSync(data) {
    wx.setStorageSync(this.storageKeyName, data);
  }
  getPostItemById() {
    var postData = this.getAllPostData();
    var len = postData.length;
    for (var i = 0; i < len; i++) {
      if (postData[i].postId == this.postId) {
        return {
          index: i,
          data: postData[i]
        }
      }
    }
  }
  collect() {
    return this.updatePostData('collect');
  }
  updatePostData(category, newComment) {
    var itemData = this.getPostItemById();
    var postData = itemData.data;
    var allPostData = this.getAllPostData();
    switch (category) {
      case 'collect':
        if (!postData.collectionStatus) {
          postData.collectionNum++;
          postData.collectionStatus = true;
        } else {
          postData.collectionNum--;
          postData.collectionStatus = false;
        }
        break;
      case 'up':
        if (!postData.upStatus) {
          postData.upNum++;
          postData.upStatus = true;
        } else {
          postData.upNum--;
          postData.upStatus = false;
        }
        break;
      case 'comment':
        postData.comments.push(newComment);
        postData.commentNum++;
        break;
      case 'reading':
        postData.readingNum++;
        break;
      default:
        break;
    }
    allPostData[itemData.index] = postData;
    this.execStorageSync(allPostData);
    return postData;
  }
  up() {
    var data = this.updatePostData('up');
    return data;
  }
  getCommentData() {
    var itemData = this.getPostItemById().data;

    itemData.comments.sort(this.compareWithTime);
    var len = itemData.comments.length;
    var comment;
    for (var i = 0; i < len; i++) {
      comment = itemData.comments[i];
      comment.create_time = util.getDiffTime(comment.create_time, true);
    }
    return itemData.comments;
  }
  compareWithTime(value1, value2) {
    var flag = parseFloat(value1.create_time) - parseFloat(value2.create_time);
    if (flag < 0) {
      return 1;
    } else if (flag > 0) {
      return -1;
    } else {
      return 0;
    }
  }
  newComment(newComment) {
    this.updatePostData('comment', newComment);
  }
  addReadingTimes() {
    this.updatePostData('reading');
  }
}


module.exports = {
  DBPost: DBPost
}