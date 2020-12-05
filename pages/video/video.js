import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList : [], //导航标签
    navId : '',
    videoList : [], //视频数据
    videoId : '', //图片和video切换标识
    videoProcess : [], //视频播放时间
    isTriggered : false //标识下拉刷新是否触发
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
    //关闭消息提示框
    wx.hideLoading()
    
    let index = 0
    let videoList = result.datas.map(item => {
      item.id = index++
      return item
    })
    this.setData({
      videoList: videoList,
      isTriggered: false  //关闭下拉提示
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
  handlePlay(event){ //当开始/继续播放时触发play事件
    //video可以同时播放多个视频，怎么处理播放当前视频的时候关闭上一个视频
    let vid = event.currentTarget.id;
    //this.vid !== vid && this.videoContext && this.videoContext.stop();
    //this.vid = vid;
    this.setData({
      videoId: vid
    })
    this.videoContext = wx.createVideoContext(vid);
    //判断当前视频之前是否由播放过
    let {videoProcess} = this.data;
    let vidoeItme = videoProcess.find(item => item.vid === vid);
    if(vidoeItme){
      this.videoContext.seek(vidoeItme.currentTime)
    }
    this.videoContext.play()
  },
  handlePlayProcess(event){  //监听视频播放进度的回调
    let videoProcessObj = {vid: event.currentTarget.id, currentTime: event.detail.currentTime}
    let {videoProcess} = this.data;
    let vidoeItem = videoProcess.find(item => item.vid === videoProcessObj.vid)
    if(vidoeItem){
      vidoeItem.currentTime = event.detail.currentTime
    }else {
      videoProcess.push(videoProcessObj)
    }
    this.setData({
      videoProcess
    })
  },
  handlePlayEnd(event){ //视频播放结束回调
    let {videoProcess} = this.data;
    let index = videoProcess.findIndex(item => item.vid === event.currentTarget.id);
    videoProcess.splice(index,1);
    this.setData({
      videoProcess
    })
  },
  handleRefesher(){ //scroll-view自定义下拉刷新
    this.getVideoList(this.data.navId);
  },
  handleToLower(){  //scroll-view滚动到底部触发
    //获取更多的数据
    console.log("获取更多的数据");
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
  onShareAppMessage: function ({from}) {
    //右上角转发:menu
    //按钮转发:button
    console.log("转发的类型:" + from);
  }
})