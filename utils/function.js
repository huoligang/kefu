var dt = require('dt.js');
// const txUrl = "http://i3itw2.natappfree.cc/kf/kf/public/api";
// 总请求
function http(req) {
  wx.request({
    url: req.url,
    // data: dt.makeMd5Par(req.param),
    data: req.param,
    method: "POST",
    header: { 'Content-Type': 'application/x-www-form-urlencoded'},
    success: function (res) {
      if (res.data.msg) {
        req.success(res.data)
      } else if (res.data.response){
        req.success(res.data.response)
      } else {
        req.success(res)
      }
    }
  })
}
module.exports = {
  http: http
}