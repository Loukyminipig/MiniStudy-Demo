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
  updatePostData(category) {
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
}


module.exports = {
  DBPost: DBPost
}