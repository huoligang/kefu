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
    popState1: false,
    popState2: false,
    popState3: false,
    nodeTitleIndex: 1,//节点类型 1工程 2木作
    carpentryState: false,//木作节点是否有数据 空false 非空true
    // cameraData: ['/images/img2.jpg', '/images/img2.jpg', '/images/img2.jpg', '/images/img2.jpg']
    cameraData:[]
  },
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
    // 获取项目详情
    that.getProDetail(p_id);
  },
  // 获取项目详情
  getProDetail(p_id){
    var that = this;
    var p_id = p_id;
    fn.http({
      url: app.globalData.txUrl + '/ProjectFirst',
      param: {
        project_id: p_id,
      },
      success: function (res) {
        var res = res;
        var tab1Length = 0;
        var tab2Length = 0;
        console.log()
        that.setData({
          projectData: res.data,
          p_id: p_id
        })
        var alength;
        var blength;
        var clength;
        // alength = res.data.personals.length % 2 == 0 ? res.data.personals.length / 2 : res.data.personals.length % 2;
        // blength = res.data.team.length % 2 == 0 ? res.data.personals.length / 2 : res.data.personals.length % 2;
        // clength = res.data.engineering.length % 2 == 0 ? res.data.personals.length / 2 : res.data.personals.length % 2;
        alength = Math.ceil(res.data.personals.length / 2);
        blength = Math.ceil(res.data.team.length / 2);
        clength = Math.ceil(res.data.engineering.length / 2);
        
        for (var i in res.data[1].node) {
          if (i) {
            tab1Length++
          }
        }
        for (var j in res.data[2].node) {
          if (j) {
            tab2Length++
          }
        }
        that.setData({
          tab1Length: tab1Length,
          tab2Length: tab2Length,
          headHeight: alength + blength + clength-3
        })
      }
    })
  },
  //协议签订
  agreement(res){
    this.setData({ popState1:true})
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
    that.setData({
      permiss:app.globalData.permiss
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

  },
  // 关闭弹窗
  closePop(res) {
    var that = this;
    that.setData({
      popState1: false,
      popState2: false,
      popState3: false,
    })
  },
  // 切换节点类型
  tabNodeTitle(res) {
    var that = this;
    var idx = res.currentTarget.dataset.idx;
    that.setData({
      nodeTitleIndex: idx
    })
  },
  // 拍摄按钮
  camera(res){
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        that.setData({
          cameraData: that.data.cameraData.concat(tempFilePaths)
        })
        console.log(that.data.cameraData)
      }
    })
  },
  // 查看详情
  seeDetails(res) {
    var that = this;
    var list = res.currentTarget.dataset.list;
    console.log(list)
    var state = res.currentTarget.dataset.state;
    var idx = res.currentTarget.dataset.idx;
    var idx2 = res.currentTarget.dataset.idx-0-1;
    var permiss = app.globalData.permiss;
    var projectData = that.data.projectData[1].node[idx2] ? that.data.projectData[1].node[idx2]:'';
    if (projectData.node_status == 2 && !state && permiss.a_permission!=""){
      that.setData({ popState1: true, pop1Data: list, n_id: res.currentTarget.dataset.nid})
    } else if (permiss.a_permission != ""){
      that.setData({ popState3: true, pop1Data: list, pop1NameState: state, pop1ClickIdx: idx })
    }else{
      that.setData({ popState3: true, pop1Data: list, pop1NameState: state, pop1ClickIdx: idx })
    }
  },
  // 节点完成申请
  nodeAccomplish(res){
    var that = this;
    that.setData({
      popState2: true
    })
    var proData = that.data.projectData;
    var tabIndex = that.data.nodeTitleIndex;
    var nowData;
    var nextData;
    for (var i in proData[tabIndex].node){
      if (proData[tabIndex].node[i].node_status==1){
        nowData = proData[tabIndex].node[i]
      }
      if (proData[tabIndex].node[i].node_status == 2) {
        nextData = proData[tabIndex].node[i]
      }
    }
    that.setData({
      nowData:nowData,
      nextData: nextData
    })
  },
  // 完工申请按钮
  proposer(res){
    var that = this;
    var imgData;
    var details_image;
    if (that.data.cameraData==""){
      wx.showModal({
        title: '提示',
        content: '请添加图片',
        showCancel: false
      })
    } else{
      wx.showLoading({
        title: '上传中',
      })
      var once = true
      for (var i in that.data.cameraData){
        if (once){
          imgData = {
            // details_image: that.data.cameraData,
            project_id: that.data.p_id,  //rule_id personal_id  
            project_name: app.globalData.proData.project_name,
            rule_id: that.data.nowData.id,
            personal_id: app.globalData.user_id,
            personal_name: app.globalData.user_name,
            sum:1
            // type_id: that.data.nodeTitleIndex,
          }
          once= false
        }else{
          imgData = {
            // details_image: that.data.cameraData,
            project_id: that.data.p_id,  //rule_id personal_id  
            project_name: app.globalData.proData.project_name,
            rule_id: that.data.nowData.id,
            personal_id: app.globalData.user_id,
            personal_name: app.globalData.user_name,
            sum:2
            // type_id: that.data.nodeTitleIndex,
          }
        }
        wx.uploadFile({
          url: app.globalData.txUrl + '/ProjectEnd',
          filePath: that.data.cameraData[i],
          name: 'file',
          method: 'POST',
          formData: imgData,
          success: res => {
            console.log(res)
          }
        })
      }
      that.setData({
        popState2:false
      })
      that.getProDetail(that.data.p_id);
      wx.hideLoading();
      wx.showToast({
        title: '成功',
      })
    }
    
  },
  //开工按钮
  startWorking(res){
    var that = this;
    fn.http({
      url: app.globalData.txUrl + '/ProjectStart',
      param: {
        project_id: that.data.p_id,  //rule_id personal_id  
        project_name: app.globalData.proData.project_name,
        rule_id: that.data.n_id,
        personal_id: app.globalData.user_id,
        personal_name: app.globalData.user_name,
        type_id: that.data.nodeTitleIndex,
        node_name: that.data.pop1Data.node_name
      },
      success: function (res) {
        that.setData({ popState1: false});
        // 获取项目详情
        that.getProDetail(that.data.p_id);
      }
    })
  }
})