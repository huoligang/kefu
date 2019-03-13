const app = getApp();
const fn = require('../../utils/function.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: false,
    first_click: 1,
    aSecond: true,
    popState1:false,
    nodeTitleIndex:1,//节点类型 1工程 2木作
    carpentryState:false,//木作节点是否有数据 空false 非空true
  },
  // toggle: function () {
  //   var that = this;
  //   if (!that.data.aSecond){
  //     return false
  //   }
  //   that.setData({ aSecond: false })
  //   var list_state = this.data.state;
  //   var first_click = this.data.first_click;
  //   if (first_click==1) {
  //     this.setData({ first_click:2 });
  //   }else{
  //       this.setData({ first_click: 1 });
  //   }
  //   if (list_state) {
  //     setTimeout(function () { that.setData({ state: false }); },1000)
  //   } else {
  //     this.setData({ state: true });
  //   }
  //   // 防止重复点击
  //   setTimeout(function () { that.setData({ aSecond: true }); }, 1000)
  // },
  toggle: function () {
    var that = this;
    if (!that.data.aSecond) {
      return false
    }
    that.setData({ aSecond: false })
    var list_state = this.data.state;
    var first_click = this.data.first_click;
    if (first_click == 1 || first_click == 3) {
      this.setData({ first_click: 2 });
    } else {
      this.setData({ first_click: 3 });
    }
    if (list_state) {
      setTimeout(function () { that.setData({ state: false }); }, 1000)
    } else {
      this.setData({ state: true });
    }
    // 防止重复点击
    setTimeout(function () { that.setData({ aSecond: true }); }, 1000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var p_id = options.p_id;
    fn.http({
      url: app.globalData.txUrl + '/ProjectFirst',
      param: {
        project_id: p_id,
      },
      success: function (res) {
        var res = res;
        var tab1Length=0;
        var tab2Length=0;
        that.setData({
          projectData: res.data,
          p_id: p_id
        })
        var alength=0;
        var blength=0;
        var clength=0;
        // alength = res.data.personals.length % 2 == 0 ? res.data.personals.length / 2 : res.data.personals.length % 2;
        // blength = res.data.team.length % 2 == 0 ? res.data.personals.length / 2 : res.data.personals.length % 2;
        // clength = res.data.engineering.length % 2 == 0 ? res.data.personals.length / 2 : res.data.personals.length % 2;
        for (var q in res.data.personals) {
          alength++
        }
        for (var q in res.data.team) {
          blength++
        }
        for (var q in res.data.engineering) {
          clength++
        }
        alength = Math.ceil(alength / 2);
        blength = Math.ceil(blength / 2);
        clength = Math.ceil(clength / 2);
        for (var i in res.data[1].node) {
          if (i) {
            tab1Length++
          }
        }
        if (res.data[2]) {
          for (var j in res.data[2].node) {
            if (j) {
              tab2Length++
            }
          }
        }
        that.setData({
          tab1Length: tab1Length,
          tab2Length: tab2Length,
          headHeight: alength + blength + clength - 3
        })
      }
    })
  },
  // 查看详情
  seeDetails(res){
    var that = this;
    var list = res.currentTarget.dataset.list;
    var state = res.currentTarget.dataset.state;
    var idx = res.currentTarget.dataset.idx;
    that.setData({ popState1: true, pop1Data: list, pop1NameState: state, pop1ClickIdx: idx })
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

  },
  // 关闭弹窗
  closePop(res){
    var that = this;
    that.setData({
      popState1: false
    })
  },
  // 切换节点类型
  tabNodeTitle(res){
    var that = this;
    var idx = res.currentTarget.dataset.idx;
    that.setData({
      nodeTitleIndex : idx
    })
  }
})