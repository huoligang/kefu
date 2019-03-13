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
    cameraData:[],
    cameraData2:[]
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
        var projectData = res.data;
        that.setData({
          projectData: res.data,
          p_id: p_id
        })
        var alength=0;
        var blength=0;
        var clength=0;
        var aaEm = 0;
        var bbEm = 0;
        var ccEm = 0;
        if (res.data.personals) { aaEm=1}
        if (res.data.team) { bbEm = 1 }
        if (res.data.engineering) { ccEm = 1 }
        // alength = res.data.personals.length % 2 == 0 ? res.data.personals.length / 2 : res.data.personals.length % 2;
        // blength = res.data.team.length % 2 == 0 ? res.data.personals.length / 2 : res.data.personals.length % 2;
        // clength = res.data.engineering.length % 2 == 0 ? res.data.personals.length / 2 : res.data.personals.length % 2;
        for (var q in res.data.personals){
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
        if (res.data[2]){
          for (var j in res.data[2].node) {
            if (j) {
              tab2Length++
            }
          }
        }        
        that.setData({
          tab1Length: tab1Length,
          tab2Length: tab2Length,
          headHeight: alength + blength + clength-3,
          emHeight: aaEm + bbEm + 0
        })
        //是否显示节点完成申请
        var proData = res.data
        var is_apply1 = false;
        var is_apply2 = false;
        for (var i in proData[1].node) {
          if (proData[1].node[i].node_status == 1 || proData[1].node[i].node_status == 3) {
            is_apply1 = true;
          }
        }
        if (proData[2]){
          for (var j in proData[2].node) {
            if (proData[2].node[j].node_status == 1 || proData[2].node[j].node_status == 3) {
              is_apply2 = true;
            }
          }
        }
        that.setData({
          is_apply1: is_apply1,
          is_apply2: is_apply2
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
    var cameraData = that.data.nodeTitleIndex == 1 ? that.data.cameraData : that.data.cameraData2
    if (cameraData.length>8){
      wx.showModal({
        title: '提示',
        content: '最多选择9张图片',
      })
      return false
    }
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        that.setData({
          cameraData: that.data.nodeTitleIndex == 1 ? that.data.cameraData.concat(tempFilePaths) : that.data.cameraData,
          cameraData2: that.data.nodeTitleIndex == 2 ? that.data.cameraData2.concat(tempFilePaths) : that.data.cameraData2
        })
      }
    })
  },
  // 查看详情
  seeDetails(res) {
    var that = this;
    var list = res.currentTarget.dataset.list;
    var state = res.currentTarget.dataset.state;
    var idx = res.currentTarget.dataset.idx;
    var idx2 = res.currentTarget.dataset.idx-0-1;
    var permiss = app.globalData.permiss;
    var tabIndex = that.data.nodeTitleIndex;
    var projectData = that.data.projectData[tabIndex].node[idx2] ? that.data.projectData[tabIndex].node[idx2]:'';
    if (projectData.node_status == 2 && !state && permiss.a_permission!=""){
      that.setData({ popState1: true, pop1Data: list, n_id: res.currentTarget.dataset.nid, pop1ClickIdx: idx })
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
    var nodeLength=0;
    var once=true
    for (var i in proData[tabIndex].node){
      nodeLength++
      if (proData[tabIndex].node[i].node_status == 1 || proData[tabIndex].node[i].node_status == 3){
        nowData = proData[tabIndex].node[i]
      }
      if (proData[tabIndex].node[i].node_status == 0 && once) {
        nextData = proData[tabIndex].node[i];
        once=false
      }
    }
    that.setData({
      nowData:nowData,
      nextData: nextData,
      nodeLength: nodeLength
    })
  },
  // 完工申请按钮
  proposer(res){
    var that = this;
    var imgData;
    var details_image;
    var cameraData = that.data.nodeTitleIndex == 1 ? that.data.cameraData : that.data.cameraData2;
    if ((that.data.nodeTitleIndex == 1 ? that.data.cameraData : that.data.cameraData2) ==""){
      // wx.showModal({
      //   title: '提示',
      //   content: '请添加图片',
      //   showCancel: false
      // })
      fn.http({
        url: app.globalData.txUrl + '/ProjectEnd',
        param: {
          project_id: that.data.p_id,  
          project_name: app.globalData.proData.project_name,
          rule_id: that.data.nowData.id,
          personal_id: app.globalData.userMsgState,
          personal_name: app.globalData.user_name,
          // sum: 0
        },
        success: function (res) {
          that.setData({
            popState2: false
          })
          wx.showToast({
            title: '成功',
          })
        }
      })
    } else{
      wx.showLoading({
        title: '上传中',
      })
      var once = true;
      var sort = 1;
      for (var i in cameraData){
        console.log()
        imgData = {
          // details_image: that.data.cameraData,
          project_id: that.data.p_id,  //rule_id personal_id  
          project_name: app.globalData.proData.project_name,
          rule_id: that.data.nowData.id,
          rule_name: that.data.nowData.node_name,
          personal_id: app.globalData.userMsgState,
          personal_name: app.globalData.user_name,
          sum: cameraData.length,
          sort:sort
          // type_id: that.data.nodeTitleIndex,
        }
        sort++
        wx.uploadFile({
          url: app.globalData.txUrl + '/ProjectEnd',
          filePath: cameraData[i],
          name: 'file',
          method: 'POST',
          formData: imgData,
          success: res => {
          }
        })
      }
      that.setData({
        popState2:false,
        cameraData: that.data.nodeTitleIndex == 1 ? [] : that.data.cameraData,
        cameraData2: that.data.nodeTitleIndex == 2 ? [] : that.data.cameraData2,
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
  },
  // 看图片
  seeImg(res){
    var that = this;
    var nowImg = res.currentTarget.dataset.nowimg;
    var list = res.currentTarget.dataset.list;
    wx.previewImage({
      current: nowImg, // 当前显示图片的http链接
      urls: list // 需要预览的图片http链接列表
    })
  }
})