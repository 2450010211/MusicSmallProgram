// pages/recommendSong/recommendSong.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',  //当日
    month: '', //当天
    recommendSongs: [] //每日推荐歌曲
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断用户是否登录
    const userInfo = wx.getStorageSync("userInfo");
    if(!userInfo){
      wx.showToast({
        title: "需要登录",
        icon: 'none',
        success: () => {
          wx.reLaunch({
            url: '/pages/personal/personal'
          })
        }
      })
    }
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })

    //获取每日推荐的数据
    this.getRecommendSongs();
  },
  async getRecommendSongs(){
    let result = await request('/recommend/songs')
    this.setData({
      recommendSongs: result.recommend
    })
  },
  toSongDetail(event) {  //跳转到播放列表
    let song = event.currentTarget.dataset.song;
    //路由跳转传参：query参数
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId=' + song.id
    })
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

  }
})