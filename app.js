const fn = require('/utils/function.js');
App({
  onLaunch: function (res) {

  },
  //获取openid
  getUserOpenId: function () {
    var that = this;
    let param;
    var pormise = new Promise(function (resolve, reject) {
      wx.login({
        success: function (res) {
          if (res.code) {
            fn.http({
              param: {code: res.code},
              url: that.globalData.txUrl,
              success: function (res) {
                that.globalData.user_id=res.data.id;//用户ID
                // that.getUserMessage();//获取用户信息
                fn.http({
                  param: {
                    user_id: that.globalData.user_id
                  },
                  url: that.globalData.txUrl + '/CustomerWexx',
                  success: function (res) {
                    that.globalData.userState = res.code,//1服务人员 2客户 3普通人员
                    that.globalData.userMsgState = res.id
                    that.globalData.userStateName = res.msg
                    that.globalData.userPhone = res.phone
                    that.globalData.user_name = res.personal_name;//用户名称
                    resolve('')
                  }
                })
              }
            })
          } else {
            resolve('')
          }
        }
      })
    })
    return pormise
  },
  // 获取用户信息
  getUserMessage(res){
    var that = this;
    fn.http({
      param: {
        user_id: that.globalData.user_id
      },
      url: that.globalData.txUrl + '/CustomerWexx',
      success: function (res) {
        that.globalData.userState = res.code,//1服务人员 2客户 3普通人员
        that.globalData.userMsgState = res.id
        that.globalData.userStateName = res.msg
        that.globalData.userPhone = res.phone
        that.globalData.user_name = res.personal_name;//用户名称
      }
    })
  },
  globalData: {
    userInfo: null,
    txUrl: 'https://kfx.dyrs.com.cn/api'
    // txUrl:'http://iuvkmy.natappfree.cc/newkf/new/public/api'
  }
})