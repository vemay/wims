var $ready;
var isAndroid = (/android/gi).test(navigator.appVersion);

//加载基础js
var strUrl = window.location.pathname;
var arrUrl = strUrl.split("/");
var startPage = arrUrl[arrUrl.length - 1];
if (startPage == "") {
  startPage = "index.html";
}
var pname = startPage.substring(0, startPage.indexOf(".html"));
var root = this;

var r_ex_String = "";
var r_ex_tmp = Math.random();
r_ex_String = "?r=" + r_ex_tmp;
// var corePath = 'core/';
document.write('<script src="core/fastclick.js' + r_ex_String + '"></script>');
document.write('<script src="core/api.js' + r_ex_String + '"></script>');
document.write('<script src="public/lCalendar/lCalendar.js' + r_ex_String + '"></script>');
document.write('<script src="core/vue.js' + r_ex_String + '"></script>');
document.write('<script src="core/rcommon.js' + r_ex_String + '"></script>');
document.write('<script src="c/' + pname + '.js' + r_ex_String + '"></script>');

var $_GET = (function() {
  //获取url传参部分
  return  parseUrl(window.location.href);
})();

apiready = function(){
  //加载页面js
  // checkApi();
  if ($ready) {
    concatObj($_GET,api.pageParam);
    concatObj(api.pageParam,$_GET);
    $ready();
    FastClick.attach(document.body);
  }
};


function parseUrl (url) {
  //解析url传参 返回参数键值对对象
  var ret = {};
  var index = url.indexOf('?');
  if (index < 0) return ret;
  url = (index<0)?'':url.substring(index+1);
  var kv = url.split('&');
  kv.forEach(function(k){
    var arr = k.split('=');
    ret[arr[0]] = arr[1];
  });
  return ret;
}

function getDataServer (postobj,successFn,errorFn,apiurl,extra) {
  if (window.api) {
    gLocalData.get('strEncryptLoginInfo') && (postobj['strEncryptLoginInfo'] = gLocalData.get('strEncryptLoginInfo'));
    // postobj['uid'] = gLocalData.get('uid');
    // postobj['utoken'] = gLocalData.get('utoken');
    // postobj['_app_v'] = gConfig.VISION;
    //  postobj['d_did'] = gLocalData.get("d_did");
    // postobj['_ios'] = 1;
    api.ajax({
      url: apiurl,
      method: extra['type'] || 'post',
      timeout: extra['timeout'] || 60,
      dataType: extra['dataType'] || 'json',
      returnAll:false,
      data:{values:postobj}
    },function (ret, err) {
      stopLoading();
      if (ret) {
        if (ret.sError) {  // 逻辑错误 //{"cType":"","sError":""}
          if (extra && extra['catchError'] ) {
            extra['catchError'](ret);
          } else {
            dialogAlert(ret.sError);
          }
        } else { //正常
          successFn(ret)
        }
      } else { //连接请求错误
        errorFn ?errorFn(err) : windowToast(err.msg);
      }
    })
  }
}

/* localStorage */
function LocalData () {

}
LocalData.prototype = {
  push:function(key,val) {
    var cst = val.constructor;
    if (cst === Number || cst === String || cst === Boolean || cst === Date || cst === Function) {
      val = val.toString();
    } else if (cst === Array) {
      val = val.join(',');
    } else if (cst === Object) {
      val = JSON.stringify(val)
    }
    $api.setStorage(key, encodeURIComponent(val));
  },
  get:function(key) {
    var val = $api.getStorage(key);
    if (val === undefined) {
      return val;
    }
    return decodeURIComponent(val);
  },
  del:function(key) {
    $api.rmStorage(key);
  },
  clear:function () {
    $api.clearStorage();
  }
};