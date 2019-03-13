const app = getApp();
const fn = require('../../utils/function.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tab: 1,//项目列表1  绑定手机号2 
    searchNoState: false,//没有搜索到项目状态
    listData: [
      { a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var sis = wx.getSystemInfoSync();
    app.getUserOpenId().then(function () {
      if (app.globalData.userState == 3) {
        that.setData({
          tab: 2
        })
        wx.hideLoading();
      } else if (app.globalData.userState == 1) {
        that.setData({
          tab: 1,
          proUrl:'/ProjectPersonal'
        })
        that.getProjectPersonal('/ProjectPersonal');
      } else {
        that.setData({
          tab: 1,
          proUrl: '/ProjectCustomer'
        })
        that.getProjectPersonal('/ProjectCustomer');
      }
      that.setData({
        userState: app.globalData.userState
      })
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
  //保存用户信息
  bindgetuserinfo(res){
    var that = this;
    if(res.detail.userInfo && that.data.userPhone.length==11){
      var userInfo = res.detail.userInfo;
      fn.http({
        url: app.globalData.txUrl + '/MemberMesg',
        param: { 
          id: app.globalData.user_id,
          nickName:userInfo.nickName,
          language:userInfo.language,
          avatarUrl: userInfo.avatarUrl,
          country:  userInfo.country,
          city: userInfo.city,
          province: userInfo.province,
          phone: that.data.userPhone
        },
        success: function (res) {
          if(res.data==""){//保存用户信息成功，更新用户信息
            fn.http({
              param: {user_id: app.globalData.user_id},
              url: app.globalData.txUrl + '/CustomerWexx',
              success: function (res) {
                app.globalData.userState = res.code,//1服务人员 2客户 3普通人员
                app.globalData.userMsgState = res.id,//人员身份ID
                app.globalData.userStateName = res.msg
                app.globalData.userPhone = res.phone;
                app.globalData.user_name = res.personal_name;//用户名称
                that.setData({
                  userState: app.globalData.userState
                })
                var listUrl;
                if (app.globalData.userState == 3) {
                  that.setData({
                    tab: 2
                  })
                  that.searchPro();
                } else if (app.globalData.userState == 1) {
                  that.setData({
                    tab: 1,
                    proUrl:'/ProjectPersonal'
                  })
                  that.getProjectPersonal('/ProjectPersonal');
                } else {
                  that.setData({
                    tab: 1,
                    proUrl: '/ProjectCustomer'
                  })
                  that.getProjectPersonal('/ProjectCustomer');
                }
              }
            })
          }
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请输入正确手机号',
        showCancel:false
      })
      that.setData({
        userPhone:null
      })
    }
  },
  // 输入手机号
  bindinput(res){
    var that = this;
    that.setData({ userPhone: res.detail.value})
  },
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    if (app.globalData.userState){
      that.setData({
        userState: app.globalData.userState
      })
      if (app.globalData.userState == 3) {
        that.setData({
          tab: 2
        })
        wx.hideLoading();
      } else if (app.globalData.userState == 1) {
        that.setData({
          tab: 1,
          proUrl: '/ProjectPersonal'
        })
        
        that.getProjectPersonal('/ProjectPersonal');
      } else {
        that.setData({
          tab: 1,
          proUrl: '/ProjectCustomer'
        })
        that.getProjectPersonal('/ProjectCustomer');
      }
    }
    
  },
  // 获取项目列表
  getProjectPersonal(url) {
    var that = this;
    fn.http({
      url: app.globalData.txUrl + url,
      param: {
        wei_phone: app.globalData.userPhone,
      },
      success: function (res) {
        wx.hideLoading();
        if(!res.code){

        }else{
          that.setData({
            fwListData: res.project.project,
            permiss: res.project
          })
        }
        
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
    // var that = this;
    // 获取项目列表
    // getProjectPersonal(url) {
      var that = this;
      fn.http({
        url: app.globalData.txUrl + that.data.proUrl,
        param: {
          wei_phone: app.globalData.userPhone,
        },
        success: function (res) {
          wx.stopPullDownRefresh();
          if (!res.code) {

          } else {
            that.setData({
              fwListData: res.project.project,
              permiss: res.project
            })
          }

        }
      })
    // },
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
  // 重新查找
  againSearch(res){
    var that = this;
    that.setData({
      searchNoState: false,
      userPhone: ""
    })
  },
  // 查看详情
  toDetails(res){
    var that = this;
    var p_id = res.currentTarget.dataset.p_id;
    var permiss = that.data.permiss;
    app.globalData.proData = res.currentTarget.dataset.list;
    app.globalData.permiss = permiss;
    if (app.globalData.userState == 1 && permiss.c_permission!=""){
      wx.navigateTo({
        url: '../operation/operation?p_id='+p_id,//业务人员
        // url: '../details/details?p_id=' + p_id,//客户
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (permiss.c_permission != ""){
      wx.navigateTo({
        url: '../details/details?p_id='+p_id,//客户
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    
  },
  // 查找手机号
  searchPro(res){
    var that = this;
    that.setData({
      searchNoState:true
    })
  }
})