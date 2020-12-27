import request from '../../utils/request'
let isSend = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '', //placeholder的内容
    hostList: [], //热搜榜数据
    searchContent: '', //用户输入的表单数据
    searchList: [],  //模糊搜索的数据
    historyList: [] //历史搜索记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //获取初始化数据
    this.getInitData();
    //获取历史搜索记录
    this.getSearchHistory();
  },
  async getInitData(){  //获取初始化数据
    //搜索关键字
    let placeholderData = await request('/search/default');
    //热搜榜
    let hotData = await request('/search/hot/detail');
    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
      hostList: hotData.data
    })
  },
  handleInputChange(event){  //收集用户输入的数据
    let keyword = event.detail.value.trim();
    this.setData({
      searchContent: keyword
    })

    //函数节流
    if(isSend) {
      return;
    }
    isSend = true;
    this.getsearchList();
    setTimeout(() => {
      isSend = false;
    },300)
  },
  async getsearchList(){
    if(this.data.searchContent){
      let {historyList,searchContent} = this.data;
      let searchListData = await request('/search',{keywords: searchContent,limit: 10})
      this.setData({
        searchList: searchListData.result.songs
      })
      //将搜索的历史记录保存
      if(historyList.indexOf(searchContent) !== -1){
        historyList.splice(historyList.indexOf(searchContent),1);
      }
      historyList.unshift(searchContent);
      this.setData({
        historyList
      })
      wx.setStorageSync("searchHistory",historyList);
    }else {
      this.setData({
        searchList: []
      })
    }
  },
  getSearchHistory(){ //获取本地历史搜索记录
    let historyList = wx.getStorageSync("searchHistory");
    if(historyList) {
      this.setData({
        historyList
      })
    }
  },
  cleanInputContent(){  //清空输入框内容
    this.setData({
      searchContent: '',
      searchList: []
    })
  },
  deleteHistory(){  //删除搜索历史记录
    wx.showModal({
      content: '确认删除吗?',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            historyList: []
          })
          wx.removeStorageSync("searchHistory");
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