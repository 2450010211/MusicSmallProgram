import request from '../../utils/request'
let startY = 0; //手指起始坐标
let moveY = 0;  //手指移动的坐标
let moveDistance = 0; //手指移动的距离
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform : "translateY(0)",
    coverTransition : '',
    userInfo : {}, //用户信息
    playList : [] //用户播放记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //读取用户信息
    const userInfo = wx.getStorageSync("userInfo");
    if(userInfo){
      this.setData({
        userInfo : JSON.parse(userInfo)
      })
      //获取用户的播放记录
      this.getUserInfoPlayList(this.data.userInfo.userId)
    }
  },
  async getUserInfoPlayList(userId){  // //获取用户的播放记录
    const result = await request('/user/record',{uid: userId,type: 1})
    let index = 0
    let playList = result.weekData.splice(0,10).map(item => {
      item.id = index++;
      return item;
    })
    this.setData({
      playList : playList
    })
  },
  /**
   * 自定义事件
   */
  handleTouchStart(event){
    this.setData({
      coverTransition: ''
    })
    startY = event.touches[0].clientY;
  },
  handleTouchMove(event) {
    moveY = event.touches[0].clientY;
    moveDistance = moveY - startY;
    if(moveDistance <= 0){
      return;
    }
    if(moveDistance >= 80){
      moveDistance = 80;
    }
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
    })
  }, 
  handleTouchEnd() {
    this.setData({
      coverTransform: `translateY(0rpx)`,
      coverTransition: 'transform 1s linear'
    })
  },
  //跳转到登录页面
  toLogin(){
    const userInfo = wx.getStorageSync("userInfo");
    if(!userInfo){
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  logout(){ //退出
    wx.showModal({
      title: '是否退出登录',
      success (res) {
        if (res.confirm) {
          wx.removeStorageSync("userInfo");
          wx.reLaunch({
            url: '/pages/personal/personal'
          })
        }
      }
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