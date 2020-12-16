// pages/songDetail/songDetail.js
import PubSub from 'pubsub-js'
import request from '../../utils/request'
const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,//音乐是否播放
    song: {},
    musicId: '', //音乐Id
    musicLink: '' //音乐播放链接
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //option：用户接收路由跳转的query参数
    let musicId = options.musicId;
    this.setData({
      musicId
    })
    this.getMusicById(musicId);

    //判断当前音乐是否在播放
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId){
      this.setData({
        isPlay: true
      })
    }
    //监控播放/暂停/停止，主要针对用户操作系统的播放暂停
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    this.backgroundAudioManager.onPlay(() => {  //播放
      this.changeIsPlay(true);
      //修改全局播放的状态
      appInstance.globalData.musicId = musicId;
    })
    this.backgroundAudioManager.onPause(() => { //暂停
      this.changeIsPlay(false);
    })
    this.backgroundAudioManager.onStop(() => {  //停止
      this.changeIsPlay(false);
    })
  },
  changeIsPlay(flag){
    this.setData({
      isPlay: flag
    })
    //修改全局播放的状态
    appInstance.globalData.isMusicPlay = flag;
  },
  handleMusicPlay(){  //点击播放暂停回调
    let isPlay = !this.data.isPlay;
    /*this.setData({
      isPlay
    })*/
    let {musicId,musicLink} = this.data;
    this.musicController(isPlay,musicId,musicLink)
  },
  async getMusicById(musicId){
    let result = await request('/song/detail',{ids: musicId});
    this.setData({
      song: result.songs[0]
    })
    //动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.song.name
    })
  },
  async musicController(isPlay,musicId,musicLink){  //播放/停止播放音乐
    
    if(isPlay){
      if(!musicLink){
        //获取音乐播放连接
        let result = await request('/song/url',{id: musicId});
        musicLink = result.data[0].url;
        this.setData({
          musicLink
        })
      }
      this.backgroundAudioManager.title = this.data.song.name;
      this.backgroundAudioManager.src = musicLink;
    }else {
      this.backgroundAudioManager.pause()
    }
  },
  handleSwitch(event){ //歌曲切换
    let type = event.currentTarget.id;

    //关闭当前播放的音乐
    this.backgroundAudioManager.stop();

    //订阅recommendSong页面发布的musicId
    PubSub.subscribe('musicId',(msg, musicId) => {
      //获取音乐详细信息
      this.getMusicById(musicId);
      //自动播放音乐
      this.musicController(true,musicId);
      //取消订阅
      PubSub.unsubscribe('musicId');
    })

    //发布消息数据给recommendSong页面
    PubSub.publish('switchType', type);
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