const app = getApp();
const fn = require('../../utils/function.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noDataState: true,//没有数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this;
    fn.http({
      url: app.globalData.txUrl + '/ProjectMesg',
      param: {
        user_id:app.globalData.user_id,
        type_id: app.globalData.userMsgState
      },
      success: function (res) {
        console.log(res)
        that.setData({
          msgData: res.data
        })
      }
    })
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