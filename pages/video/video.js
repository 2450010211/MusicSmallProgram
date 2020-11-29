import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList : [], //导航标签
    navId : '',
    videoList : [] //视频数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取导航标签数据
    this.getVideoGroupList();
  },
  async getVideoGroupList(){
    let result = await request('/video/group/list');
    let navId = result.data[0].id;
    this.setData({
      videoGroupList: result.data.splice(0,14),
      navId: navId //默认选中第一个
    })
    this.getVideoList(navId);
  },
  async getVideoList(navId){ //获取视频标签下对应的视频数据 发送请求需要携带cookie
    const userInfo = wx.getStorageSync("userInfo");
    if(!userInfo){
      wx.showToast({
        title: "需要登录",
        icon: 'none'
      })
      return
    }
    let result = await request('/video/group',{id: navId});
    wx.hideLoading()
    let index = 0
    let videoList = result.datas.map(item => {
      item.id = index++
      return item
    })
    this.setData({
      videoList: videoList
    })
  },
  changeNav(event){  //获取点击的导航
    let navId = event.currentTarget.dataset.id;
    this.setData({
      navId,
      videoList: []
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getVideoList(navId);
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