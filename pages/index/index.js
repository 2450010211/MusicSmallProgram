// pages/index/index.js

import request from '../../utils/request'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [], //轮播图数据
    personalizedList: [], //推荐歌单
    topList: [] //热歌榜
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let bannerDataList = await request('/banner',{type: 2});
    let personalizedDataList = await request('/personalized',{limit: 10});
    this.setData({
      bannerList : bannerDataList.banners,
      personalizedList: personalizedDataList.result
    })

    /*
      我们需用根据idx的值获取对应的数据
      idx的值取值范围0~20，我们需要0~4
      所以需要发送5次请求
    */
    let index = 0;
    let resultTopList = [];
    while(index < 5){
      let topDataList = await request('/top/list',{idx: index++});
      let topListItem = {
        name: topDataList.playlist.name,
        tracks: topDataList.playlist.tracks.slice(0,3)
      };
      resultTopList.push(topListItem);
      this.setData({
        topList : resultTopList
      })
    }
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