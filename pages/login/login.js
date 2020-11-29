// pages/login/login.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',  //手机号
    password: ''  //用户密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //收集表单数据的回调
  handleInput(event){
    let key = event.currentTarget.id;
    let value = event.detail.value;
    this.setData({
      [key] : value
    })
  },
  //登录回调
  async login(){
    const {phone, password} = this.data;
    if (!phone){
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return;
    }
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if (!phoneReg.test(phone)){
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
      return;
    }
    if (!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return;
    }
    //调用网易云接口验证
    const result = await request('/login/cellphone',{phone, password, isLogin: true})
    let code = result.code;
    let msg = result.msg;
    if(code == 200){
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      })
      //将用户信息保存起来
      wx.setStorageSync("userInfo",JSON.stringify(result.profile));
      
      //登录成功之后跳转到个人中心页面switchTab跳转个人中心页不会执行onLoad函数需要换成reLaunch
      wx.reLaunch({
        url: '/pages/personal/personal',
      })
    }else if(code == 502){
      wx.showToast({
        title: msg,
        icon: 'none'
      })
    }else if(code == 400){
      wx.showToast({
        title: msg,
        icon: 'none'
      })
    }else{
      wx.showToast({
        title: msg,
        icon: 'none'
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