// pages/detail/detail.js
let datas = require("../../datas/list-data.js");
let musicManager = wx.getBackgroundAudioManager();
let count = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    newItem: {},
    index: 0,
    isCollected: false,
    isMusicPlay : false
  },

  sharePage(){
    wx.showActionSheet({
      itemList: ["分享到朋友圈","分享到QQ空间","分享到微博"],
    })
  },

  //播放音乐处理函数
  playMusic(){
    let { lastIndex,playIndex} = getApp().data;
    let {isMusicPlay, index} = this.data;
    let musicData = this.data.newItem.music;
    console.log(count + " " + index);
    if (count && index !== lastIndex) {
      getApp().data.playIndex = index;
      musicManager.src = musicData.dataUrl;
      musicManager.title = musicData.title;
      count--;
    }
    //正在播放
    if(isMusicPlay){
      this.setData({
        isMusicPlay : false
      });

      musicManager.pause();

    }else{
      //没播放
      this.setData({
        isMusicPlay: true
      })
      //播放音乐
      console.log("play");
      musicManager.play();
      

    }
  },

  //收藏按钮事件处理函数
  collectionHandle() {
    this.setData({
      isCollected: !this.data.isCollected,
    })

    //弹出收藏提示框
    let title = this.data.isCollected ? "收藏成功" : "取消收藏"
    wx.showToast({
      title,
      icon: "success"
    })
    //从本地存储数据中读取收藏状态
    let {index, isCollected} = this.data
    wx.getStorage({
      key: 'collectStatus',
      success: function(res) {
        let obj = res.data;
        obj[index] = isCollected;
        wx.setStorage({
          key: 'collectStatus',
          data: obj,
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let {lastIndex} = getApp().data;
    let index = options.index;
    let {playIndex} = getApp().data;
    count = 1;
    this.setData({
      newItem: datas.list_data[options.index],
      index
    })

  /******************音乐播放相关*********************/
    console.log(lastIndex);
    if (musicManager.src != null && !musicManager.paused && index == playIndex){
      this.setData({
        isMusicPlay: true
      })
    }

  musicManager.onStop(() => {
    getApp().data.playIndex = null;
  })

  musicManager.onPause(() => {
    let {playIndex} = getApp().data;
    console.log(getApp().data);
    if(lastIndex == null || playIndex == index){
      console.log("onPause:" + playIndex);
      this.setData({
        isMusicPlay: false
      })
    } 
  });

  musicManager.onPlay(() => {
    let { playIndex } = getApp().data;
    if (lastIndex == null || playIndex == index) {
      console.log("onPlay:" + playIndex);
      this.setData({
        isMusicPlay: true
      })
    }
  });
  
  
  
  /**************************************************/
    //从本地读取存储状态
    let ret = wx.getStorageSync("collectStatus")
    if(!ret){
      wx.setStorageSync("collectStatus", {})
    }
    if (ret[index]) {
      this.setData({
        isCollected: true
      })
    }else{
      this.setData({
        isCollected: false
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    getApp().data.lastIndex = this.data.index;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})