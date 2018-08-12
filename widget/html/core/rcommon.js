var gDid = null;
var gLocalData = new LocalData();

var gConfig = (function () {
    this.ip = gLocalData.get('api_ip');
    this.port = gLocalData.get('api_port');
    
    this.HTML_PRE_ROOT = ""; //http://192.168.80.215:8000/jikai/html/  http://192.168.80.215:8000/wims-test/html/
    this.MY_DEBUG = false;
    this.MOUDLE = "" ;
    /*接口地址*/
    // this.API_ROOT = 'http://192.168.80.100:8080/MobileService.asmx/Excute';
    // this.API_ROOT = 'http://192.168.80.69:8080/MobileService.asmx/Excute'; //http://192.168.40.241:8080/MobileService.asmx/Excute
   this.API_ROOT = 'http://'+ this.ip +':' + this.port + '/MobileService.asmx/Excute';
    this.IS_IN_WEB = false;
    this.widgetId = 'A6068106411428'; //widgetId
    this.IS_ANDROID = false;
    this.loadingNumber = 0;
    this.PAGE_COUNT = 10;
    return {
        API_ROOT: this.API_ROOT,
        DEBUG: false,
        AVATAR_PRE: "",
        IN_NATIVE_WEBVIEW: false,
        AVISION:1,
        VISION:17,
        HOST: "",//http://xys.ddle.cc/api.php?a=test
        HTTP_HOST: "",
        HTML_PRE_ROOT: this.HTML_PRE_ROOT,
        HTML_PRE: this.HTML_PRE_ROOT + this.MOUDLE,
        IS_IN_WEB: this.IS_IN_WEB,
        MOUDLE: this.MOUDLE,
        WIDGETID:this.widgetId,
        MY_DEBUG:this.MY_DEBUG,
        loadingNumber:this.loadingNumber,
        PAGE_COUNT:this.PAGE_COUNT
    }
})();

var gVariable = (function() {
    this.loadingNumber = 0;
    this.billMoreList = [
      {name:'new',text:'新增',fn:'do-new'},
      {name:'update',text:'维护',fn:'do-update'},
      {name:'give-up',text:'放弃',fn:'do-give-up'},
      {name:'save',text:'保存',fn:'do-save'},
      {name:'cancel',text:'撤销',fn:'do-cancel'},
      {name:'delete',text:'删除',fn:'do-delete'},
      {name:'submit',text:'提交',fn:'do-submit'},
      {name:'query',text:'定位',fn:'do-query'}
    ];
    return {
      billMoreList:this.billMoreList,
      loadingNumber:this.loadingNumber
    }
}());

function checkApi() {
    if (!api) {alert('网络异常，请重新打开');return false;}
}

var gLocalDataUser;
function getGlocalDataUser() {
    var uid = gLocalData.get("uid");
    if (!uid)
        return;
    if (!gLocalDataUser)
        gLocalDataUser = new LocalData(uid);
    return gLocalDataUser;
}
function getChangeInfo(file) {
    var outfile = file;
    var outurl = file;
    var title = file;
    var index = file.indexOf("/");
    var pre = gConfig.HTML_PRE;
    if (index == 0) {
        title = file.split("/").pop();
        outurl = file;
        outfile = title;
        pre = (gConfig.HTML_PRE_ROOT + file).replace("/" + title, "/");
    } else if (index > 0 && file.indexOf("ttp:") == -1 && file.indexOf("ttps:") == -1) {
        title = file.split("/").pop();
        outurl = file;
        outfile = title;
        pre = (gConfig.HTML_PRE + file).replace("/" + title, "/");
    }
    var changetoweb = arguments[1];
    if (changetoweb) {
        var in_web_root = decodeURIComponent(gLocalData.get("html5_web_root_in_web"));
        if (in_web_root) {
            if (gConfig.HTML_PRE_ROOT != "") {
                pre = pre.replace(gConfig.HTML_PRE_ROOT, in_web_root);
            } else {
                pre = in_web_root + pre;
            }
        }
    }
    return {title: title, file: outfile, pre: pre, url: outurl};
}

function changeTo(file) {
    var str = '';
    if (!arguments[1]) {
        str = "";
    } else {
       str = arguments[1];
    }
    if (file == "_exit" || file == "") {
        api.closeWin({
        });
        return;
    }
    //$.mobile.changePage(file+".html?"+str, "pop");
    if (str == undefined || str == null) {
        str = "";
    }
    if (window.api) {
        var get = {};
        if (str) {
            if (typeof str === 'string') {
              var u = str.split("&");
              for (var i in u) {
                var j = u[i].split("=");
                get[j[0]] = j[1];
              }
            } else {
                for (var attr in str) {
                    get[attr] = str [attr];
                }
            }

        }
        if (get['_no_header']) {
            changeToNoHeader.apply(this, arguments);
            return;
        }
        // var fileinfo = getChangeInfo(file, changetoweb);
        get['file'] = file;
        get['frame'] = file;

        if (get["_closefile"] && get["_closefile"] == "this") {
            get["_closefile"] = api.winName;
        }
        var topfile = "_commonFrame";
        // var topfile = getChangeToTop(fileinfo.file);
        if (get['_topfile']) {
            topfile = get['_topfile'];
        }
        var option = {
            name: file,
            url: gConfig.HTML_PRE_ROOT + topfile + '.html?rs='+ Math.random(),
            pageParam: get,
            opaque: true,
            vScrollBarEnabled: false,
            hScrollBarEnabled: false,
            bounces: false,
            // reload:true
        };
        if (get.animation) {
            if (get.animation == "bottom") {
                option.animation = {
                    type: "movein",
                    subType: "from_bottom",
                    duration: 500
                };
            }
        }
            if (!changeToFrame(get)) {
              api.openWin(option);
            }
    } else {
        window.location.href = file + ".html?" + str + "&_ia=" + $_GET['_ia']
    }
}

function changeToPdf (get) {

}
function changeToFrame(get) {
    
    if (!get._toframe) {
        return false
    }

    var option = {
        name: get.file,
        url: gConfig.HTML_PRE_ROOT + get.file + '.html?rs=' + Math.random(),//gConfig.HTML_PRE_ROOT+get.file+'.html?rs=' + Math.random(),
        rect: {
            x: get.x ? get.x : 0,
            y: get.y ? get.y : 0,
            w: get.w ? get.w : "auto",
            h: get.h ? get.h : api.winHeight
        },
        //scrollToTop:true,
        pageParam: get,
        bgColor: get.bgColor ? get.bgColor : "rgba(0,0,0,0.2)",
        vScrollBarEnabled: true,
        hScrollBarEnabled: true
    };
    if (get.animation) {
        if (get.animation == "bottom") {
            option.animation = {
                type: "movein",
                subType: "from_bottom",
                duration: 100
            };
        }
    }

    api.openFrame(option);
    return true;
}

function changeToWebHtml(file, option) {
    if (gConfig.IS_IN_WEB === true) {

    } else {
        var fileAndroids = strToObj(decodeURIComponent(gLocalData.get("html5_configs_iphone_toweb")));

        if (fileAndroids[file]) {
            var url = fileAndroids[file];

            if (url) {
                url = decodeURIComponent(url);
            }
            if (url && url.indexOf("{") != -1) {
                url = url.replace(/{(.*?)}/gi, function () {
                    if (option[arguments[1]] != undefined && option[arguments[1]] != null) {
                        return option[arguments[1]];
                    } else {
                        return "";
                    }
                });
            }
            var tmp = globalParseUrl(url, true);
            file = tmp['file'];
            option = strToObj(tmp['arg']);
        } else {
        }
    }
    return {file: file, option: option};

}


function getChangeToTop(file) {

    var arr = {  reg: "_top", login: "_top",default: "_t",bottom:'_bottom',modal_tab:'modal_tab'};
    if (arr[file]) {
        return arr[file];
    } else {
        return "_common_bottom";

    }
}


function changeToOpen(url) {
    var bgcolor;

    api.openWin({
        name: "webview",
        url: gConfig.HTML_PRE + '_commonFrame.html?rs=' + Math.random(),
        pageParam: {
            file: url,
            bgcolor: bgcolor
        },
        opaque: true,
        bounces: false,
        hScrollBarEnabled: false,
        vScrollBarEnabled: false
    });
}

function changeToOpenOther(url) {
    api.openWin({
        name: "other",
        url: url,
        opaque: true,
        hScrollBarEnabled: false,
        vScrollBarEnabled: false
    });
}


function changeToNoHeader(file) {

    var get = {};
    if (arguments[1] != null && arguments[1] != undefined) {
        get = strToObj(arguments[1]);
    }
    // var fileinfo = getChangeInfo(file);
    get['file'] = file;

    api.openWin({
			name: file, //file + Math.random(),
			url: gConfig.HTML_PRE_ROOT + get['file'] + '.html?rs=' + Math.random(),
			pageParam: get,
			opaque: true,
			hScrollBarEnabled: false,
			vScrollBarEnabled: false
    });
}

function changeToSetRight(file) {
    changeTo.apply(this, arguments);
}

/*JsCallNative*/
function invokeObjc(url) {

    var iframe;

    iframe = document.createElement("iframe");

    iframe.setAttribute("src", url);

    iframe.setAttribute("style", "display:none;");

    document.body.appendChild(iframe);
    //alert(iframe);
    iframe.parentNode.removeChild(iframe);

}
//发送数据到指定win --可用来向commonFrame传递数据或方法
function sendEventToWin (fn,obj,win) {
  api.sendEvent({
    name: fn,
    extra: {
      win:win || api.winName,
      data:obj
    }
  });
}
function setTitle (title) {
  sendEventToWin('setTitle',{
      title:title
  })
}

function JsCallNative(fun, strs) {

    if (gConfig.IN_NATIVE_WEBVIEW) {
        if (strs == undefined || strs == null) {
            strs = "";
        }
        invokeObjc("wscall://webview?invokeMethodName=" + fun + "&" + strs);
    } else {

        if (window.api != undefined) {

            if (fun == "JsRequstLogOut") {
               // alertMy("注销成功");
                api.sendEvent({
                    name: 'onLogOut',
                    extra: {
                        msg: "reload"
                    }
                });
                api.execScript({
                    name: "root",
                    frameName: "_default",
                    script: 'whenUserLogout();'
                });

            } else if (fun == "JsSetAvtivityTitle") {
                var arr = strToObj(strs);
                api.execScript({
                    name: api.winName,
                    script: 'doSetTitle("' + arr.title + '");'
                });
            } else if (fun == "JsSetUserLogin") {
                gLocalData.push("loginString", strs);
                var arg = strToObj(strs);
                if (!arg.noSendEvent) { //添加参数设置是否发送注册成功事件 20170116 wwg
                  api.sendEvent({
                    name: 'onRelogin',
                    extra: {
                      msg: "reload"
                    }
                  });
                }

                api.execScript({
                    name: "root",
                    frameName: "_default",
                    script: 'whenUserLogin();'
                });
            } else if (fun == "JsRequstCallRun") {

                whenInitDevice();
            } else if (fun == "JsRequstCallPhone") {
                var arr = strToObj(strs);
                api.call({
                    type: 'tel_prompt',
                    number: arr.phone
                });
            } else if (fun == "JsSetAvtivityRight") {
                var arr = strToObj(strs);
                var string = "";
                if (!arr.leftfun) {
                    arr.leftfun = "";
                }

                if (!arr.bgcolor) {
                    arr.bgcolor = "";
                }

                string = 'setRightBtn("' + arr.title + '","' + arr.fun + '","' + arr.leftfun + '","' + arr.bgcolor + '");';
                api.execScript({
                    name: api.winName,
                    script: string
                });
            } else if (fun == "JsRequestOpenAndUoploadImg") {
                if (!gLocalData.get('u_token')) {
                    alertMy("没登录不可上传");
                    return;
                }
                var arr = strToObj(strs);
                api.getPicture({
                    sourceType: arr['imgType'] ? arr['imgType'] : 'library',  // 'library'
                    encodingType: 'jpg',
                    mediaValue: 'pic',
                    destinationType: 'url',
                    allowEdit: false,
                    quality: 80,
                    targetWidth: arr['width'] ? arr['width'] : 600,
                    targetHeight: arr['height'] ? arr['height'] : 600,
                    saveToPhotoAlbum: false
                }, function (ret, err) {
                    if (ret) {
                        startLoading();
                        api.ajax({
                            url: gConfig.API_ROOT,
                            method: 'post',
                            timeout: 30,
                            dataType: 'text',
                            returnAll: false,
                            data: {
                                values: {
                                    mod: 'upload',
                                    action: 'index',
                                    t: arr.t,
                                    u_token: gLocalData.get('u_token')

                                },
                                files: {
                                    file: ret.data
                                }
                            }
                        }, function (ret, err) {

                            if (ret) {
                                OnNativeCall("onNativeCallSetUploadImgPath", "t=" + arr.t + "&res=" + ret + "&tag=" + arr.tag);
                            } else {
                                stopLoading();
                                windowToast(err.msg + ',请重试');
                                /*api.alert({
                                    msg: ('错误码：' + err.code + '；错误信息：' + err.msg + '网络状态码：' + err.statusCode)
                                });*/
                            }
                        });

                    } else {

                    }                    ;
                });
            }

        }
    }
}

function setHeadRightBtn(str) {
    //顶部栏右按钮设置
  // 'more' 'refresh'
  sendEventW('setRightBtn',{
    win:api.frameName,
    data:{
      rbtn:str,
    }
  });
}
function setHeadLeftBtn(str) {
  //顶部栏右按钮设置
  // 'more' 'refresh'
  sendEventW('setLeftBtn',{
    win:api.frameName,
    data:{
      lBtn:str,
    }
  });
}
function setHeadLeftBtnNone(str) {
  //顶部栏右按钮设置
  // 'more' 'refresh'
  sendEventW('setLeftBtn',{
    win:api.frameName,
    data:{
      showLeftBtn:false,
      lBtn:str,
    }
  });
  preventKeyBack();

}

function reOpenWin (win) {

}

function OnNavtiveReady(v) {
    gConfig.IN_NATIVE_WEBVIEW = true;
    if (v) {
        gConfig.VISION = v;

    }

}

function strToObj(str) {
    var tmp = str.split("&");
    var out = {};
    for (var i in tmp) {
        if (tmp[i] != "") {
            var tmp2 = tmp[i].split("=");
            out[tmp2[0]] = tmp2[1];
        }
    }
    return out;
}

function objectToString(data, encode) {
    var tmp = "";
    for (var index in data) {
        if (encode) {
            tmp += index + "=" + encodeURIComponent(data[index]) + "&";
        } else {
            tmp += index + "=" + data[index] + "&";
        }

    }
    return tmp;
}

function OnNativeCall(fun, args) {
    if (window[fun] == undefined) {
        //alertMy("没有相关方法"+fun);
    } else {
        return window[fun](strToObj(args));

    }
}


function onNativeCallSetUserinfo(obj) {
    if (!gLocalData.get("u_token")) {
        if (obj.uid) {
            gLocalData.push("uid", obj.uid);
            gLocalData.push("u_username", obj.u_username);
            gLocalData.push("u_phone", obj.u_phone);
            gLocalData.push("showname", obj.showname);
            gLocalData.push("puid", obj.puid);
            gLocalData.push("u_token", obj.u_token);

            gLocalData.push("u_pictures", obj.u_pictures);
            gLocalData.push("is_company", obj.is_company);

        }
    }
}


function getSelectArr(str) {

    var tmp1 = str.split("@");

    var out = new Array();
    if (tmp1.length > 0) {

        for (var i in tmp1) {

            var tmp2 = tmp1[i].split("#");

            if (tmp2[0]) {
                var tmp3 = new Array();
                tmp3['key'] = tmp2[0];
                tmp3['value'] = tmp2[1];
                out[i] = tmp3;
            }
        }
        return out;
    } else {

        return null;
    }

}

function gotoLogin() {
    var arg = arguments;

    if (gConfig.IN_NATIVE_WEBVIEW) {
        var url = arguments[0];
        if (url == undefined || url == null) {
            url = window.location.href;
        }
        JsCallNative("JsRequstGoToLogin", "url=" + url);
    } else {

        if (api != undefined) {
            var url = arg[0];
            if (url == undefined || url == null) {
                url = "_exit";
            }
            changeTo("login", "back=" + url);
        } else {
            var url = arguments[0];
            if (url == undefined || url == null) {
                url = "_exit";
            }
            changeTo("login", "back=" + url);
        }

    }
}

function windowConfirm(data, callback) {

    api.confirm(data, callback);
}
/*dialogBox*/
function dialogAlert(data,callback,cancelCallback) {
  var w = api.frameWidth; //483
  var dW = w*0.7; //dialog窗口宽度
  var btnW = dW/2*0.9; //按钮宽度
  var mgL = (dW/2 - btnW)/2; // 按钮左margin
  var singleMgL = (dW-btnW)/2; //单个按钮时左 margin

  var dialogBox = api.require('dialogBox');

  var text =  {
    title: '提示',
    content: '',
    rightBtnTitle:'确认'
  };
  var styles = {
    bg: '#fff',
    w: dW,
    corner: 5,
    title: {
      marginT: w/24.15,
      icon: 'widget://res/gou.png',
      iconSize: w/12.075,
      titleSize: w/30.1875,
      titleColor: '#000'
    },
    content: {
      marginT:w/26.83,
      marginB:w/26.83,
      color: '#333',
      size: w/34.5
    },
    right: {
      marginB: w/69,
      marginL: singleMgL,
      w: btnW,
      h: w/13.8,
      corner: 2,
      bg: '#fff',
      size: w/34.5
    }
  };
    if (!data || typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean' || !data ) {
        text.content = data + '';
    } else {
      text = concatObj(text,data);
      if (data.type === 'confirm') {
        text.leftBtnTitle = data.lBtn || '取消';
        styles.left = {
          marginB:  w/69,
          marginL: mgL,
          w: btnW,
          h: w/13.8,
          corner: 2,
          bg: '#fff',
          size: w/34.5
        };
        styles.right.marginL = mgL*2;
      }
      if (data.noTitle) {
        text.title = '';
      }
    }
  dialogBox.alert({
    texts:text,
    styles: styles
  }, function(ret) {
    if (ret.eventType == 'left') {
      dialogBox.close({
        dialogName: 'alert'
      });
      cancelCallback && cancelCallback(ret);
    } else if (ret.eventType === 'right') {
      dialogBox.close({
        dialogName: 'alert'
      });
      callback && callback.call(this,ret)
    }
  });
}

function dialogConfirm (data,callback,cancelCallback) {
    var setting = {}
    if (typeof data === 'string') {
        setting = {content:data}
    } else {
        setting  = data;
    }
    setting.type = 'confirm';
    dialogAlert.call(this,setting,callback,cancelCallback);
}
/*dialogBox-end*/
/* promise */
function MyPromise(callback) {
  var PENDING = 'pending';
  var FULFILLED = 'fulfilled';
  var REJECTED = 'rejected';
  var self = this;
  self.status = PENDING;
  self.data = undefined;
  self.onResolvedCallback = [];
  self.onRejectedCallback = [];
  callback(resolve,reject);
  function resolve (value) {
    if (self.status === PENDING) {
      self.status = REJECTED;
      self.data = value;
      //依次执行成功之后的函数栈
      for (var i = 0; i < self.onResolvedCallback.length; i++ ) {
        self.onResolvedCallback[i](value);
      }
    }
  }
  function reject (error) {
    if (self.status === PENDING) {
      self.status = REJECTED;
      self.data = error;
      //依次执行失败之后的函数栈
      for (var i = 0; i < self.onRejectedCallback.length; i++ ) {
        self.onRejectedCallback[i](error);
      }
    }
  }
}
MyPromise.prototype.then = function (onResolved,onRejected) {
  var PENDING = 'pending';
  var FULFILLED = 'fulfilled';
  var RESOLVED = 'resolved';
  var REJECTED = 'rejected';
  var self = this;
  var promise2;
  //如果then的参数不是function,则忽略之
  onResolved = typeof onResolved === 'function' ? onResolved : function () {};
  onRejected = typeof onRejected === 'function' ? onRejected : function () {};
  if (self.status === RESOLVED) {
    return promise2 = new MyPromise(function (resolve,reject) {
      try {
        var x = onResolved(self.data);
        if (x instanceof MyPromise) {
          x.then(resolve,reject);
        }
        resolve(x);
      } catch (e) {
        reject(e)
      }
    });
  }
  if (self.status === REJECTED) {
    return promise2 = new MyPromise(function (resolve,reject) {
      try {
        var x = onRejected(self.data);
        if (x instanceof MyPromise) {
          x.then(resolve,reject);
        }
      } catch (e) {
        reject(e)
      }
    });
  }
  if (self.status === PENDING) {
    return promise2 = new MyPromise(function (resolve,reject) {
      self.onResolvedCallback.push(function (value) {
        try {
          var x = onResolved(self.data);
          if (x instanceof MyPromise) {
            x.then(resolve,reject);
          }
          resolve(x);
        } catch (e) {
          reject(e)
        }
      });
      self.onRejectedCallback.push(function (value) {
        try {
          var x = onRejected(self.data);
          if (x instanceof MyPromise) {
            x.then(resolve,reject);
          }
        } catch (e) {
          reject(e)
        }
      });
    })
  }
};
/*promise end*/

function stopLoading () {
  if (( -- gVariable.loadingNumber ) <= 0) {
    api.closeFrame({
      name: 'load-progress-ball-beat'
    });
  }
  
}

function startLoading (title,text) {
  ++ gVariable.loadingNumber;
  var wH = api.winHeight;
  var wW = api.winWidth;
  var fH = api.frameHeight;
  var fW = api.frameWidth;
  api.openFrame({
    name: 'load-progress-ball-beat',
    url: 'load-progress-ball-beat.html',
    rect: {
      x: 0,
      y: wH - fH,
      w: 'auto',
      h: 'auto'
    },
    bgColor:'transparent',
    bounces:false
  });

}//处理时间
function getDate(tm) {

    var mydate = new Date();

    var stime = new Date(mydate.getFullYear() + "/" + (mydate.getMonth() + 1) + "/" + mydate.getDate()).getTime() / 1000;
    //今天0点0分0秒时间戳

    //	var etime = new Date(mydate.getFullYear()+"/"+ (mydate.getMonth()+1)+"/"+(mydate.getDate()+1)).getTime()/1000;  //明天0点0分0秒

    if (stime > tm) {

        var tt = new Date(parseInt(tm) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ").replace("上午", "").replace("GMT+8", "");
    } else {//只是显示小时和分
        //.substr(12,16)
        var tt = new Date(parseInt(tm) * 1000).toLocaleString().substr(16, 16);
    }
    return tt;
}



function addEventListenerW(name, backfunction, extra) {

    api.addEventListener({
        name: name,
        extra: extra
    }, backfunction);
}

function sendEventW(name, data) {
    api.sendEvent({
        name: name,
        extra: data
    });
}

function windowClose(name) {
    api.closeWin({
        name: name
    });
}

function windowCloseThis() {

    if (arguments[0] || (api.pageParam.animation && api.pageParam.animation == "bottom" )) {
        api.closeWin({
            name: api.winName,
            animation: {
                type: "reveal",
                subType: "from_top",
                duration: 600
            }
        });
    } else {
        api.closeWin({
            name: api.winName
        });
    }
}

function closeToWin(name) {

    api.closeToWin({
        name: name

    });
}

function alertMy(str) {
    api.alert({
        title: "提示",
        msg: str
    }, function (ret, err) {
        //coding...
    });
}

function alertMyFun(str, fun) {
    api.alert({
        title: "提示",
        msg: str
    }, fun);
}


function imageBrowser(imgs, index) {
    var obj = api.require('imageBrowser');
    obj.openImages({
        imageUrls: imgs,
        showList: false,
        activeIndex: index
    });
}

function windowPrompt(data, backfun) {
    api.prompt(data, backfun);
}

function showActionSheet(data, backfun) {
    api.actionSheet(data, backfun);
}

function openMap(slat, slon, y, height) {

    var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    var map = api.require('baiduMap');
    map.open({
        x: 0,
        y: (y) ? y : 150,
        w: w,
        h: height ? height : 300,
        lon: slon,
        lat: slat
        //fixed:false
    }, function (ret, err) {
        if (ret.status) {

        }
    });

    map.setZoomLevel({
        level: 14
    });
}

function setCanRefresh(fun) {
    if (fun == undefined || fun == null) {
        fun = "whenReFreshing";
    }

    if (window[fun] != undefined) {
        api.setRefreshHeaderInfo({
            visible: true,
            loadingImg: 'widget://image/refresh.png',
            bgColor: '#ccc',
            textColor: '#fff',
            textDown: '下拉刷新...',
            textUp: '松开刷新...',
            showTime: true
        }, function (ret, err) {
            //从服务器加载数据，完成后调用api.refreshHeaderLoadDone()方法恢复组件到默认状态
            window[fun]();
        });
    }
}

function setOnRefresh(fun) {
    api.setRefreshHeaderInfo({
        visible: true,
        loadingImg: 'widget://image/refresh.png',
        bgColor: '#ccc',
        textColor: '#fff',
        textDown: '下拉刷新...',
        textUp: '松开刷新...',
        showTime: true
    }, fun);
}

function StopRefresh() {
    api.refreshHeaderLoadDone();
}

function addRoute(slat, slon, elat, elon) {
    // ecar_dis_first 最短距离

    var map = api.require('baiduMap');
    map.addRoute({
        id: 300,
        type: 'drive',
        policy: 'ecar_dis_first',
        startPoint: {
            //  city:'北京',
            //   name:'史各庄南',
            lon: slon,
            lat: slat
        },
        endPoint: {
            // city:'北京',
            // name:'龙翔路',
            lon: elon,
            lat: elat
        }
    }, function (ret, err) {
        if (ret.status) {
            //api.alert({msg:"路线添加完成"});
        } else {
            map.setCenter({
                lon: (slon + elon) / 2,
                lat: (slat + elat) / 2
            });
        }
    });

}

function setOnViewappear(fun) {
    api.addEventListener({
        name: 'viewappear'
    }, fun);
}

function getSfInfoFile(status, ckuid) {

    var uid = gLocalData.get("uid");
    var shenfen = 2;
    if (uid == ckuid) {
        shenfen = 1;
    }

    return "sf_info_" + shenfen + status;

}



function windowToast(msg,duration,location) {
    api.toast({
        msg: msg,
        duration: duration||2000,
        location: location || 'middle'
    });

}


function frameSetNobounces() {

    api.setFrameAttr({
        name: api.frameName,
        bounces: false
    });
}
function frameSetbounces() {
  api.setFrameAttr({
    name: api.frameName,
    bounces: true
  });
}

function windowSetSlidBackEnabled(can) {
    api.setWinAttr({
        slidBackEnabled: can
    });
}
function frameSetCross() {
  api.setScreenOrientation({
    orientation: 'landscape_right'
  });
}
function frameSetNoCross () {
  api.setScreenOrientation({
    orientation: 'portrait_up'
  });
}

// config 参数 t,id,shtype backfun
function shareContent(config) {
    var backfun = "";
    if (typeof config['backfun'] == "function") {
        arguments.callee.callback = config['backfun'];
        backfun = "shareContent.callback";
    } else if (typeof config['backfun'] == "string") {
        backfun = config['backfun'];
    }
    api.openFrame({
        name: '_share',
        url: '_share.html?rs=' + Math.random(),
        rect: {
            x: 0,
            y: 0,
            w: "auto",
            h: api.winHeight
        },
        //scrollToTop:true,
        pageParam: {
            fname: api.frameName,
            t: config["t"],
            id: config["id"] ? config["id"] : 0,
            shtype: config["shtype"] ? config["shtype"] : "Webpage",
            sname: config["sname"] ? config["sname"] : "",
            surl: config["surl"] ? config["surl"] : "",
            scontent: config["scontent"] ? config["scontent"] : "",
            thumb: "widget://html/public/images/sharep.png",
            backfun: backfun
        },
        bgColor: "rgba(0,0,0,0.2)",
        vScrollBarEnabled: true,
        hScrollBarEnabled: true
    });

}

function getSmallAvatarUrlByUid(uid) {
    return  getMiddleAvatarUrlByUid.apply(this, arguments);

}

function getMiddleAvatarUrlByUid(uid) {

    if (!uid) {
        return "public/img/defaulttx.png";
    }

    if (/^\d+$/.test(uid)) {
        return "http://www.ddle.cc/home1/uc_server/avatar.php?uid=" + uid + "&size=middle&rand=" + Math.random();
    } else if (uid.indexOf("ttp:") > 0) {
        return uid;
    } else {
        return gConfig.AVATAR_PRE + uid;
    }

}

function getBigAvatarUrlByUid(uid) {
    return getMiddleAvatarUrlByUid.apply(this, arguments);
}
function jsSelectItemByValue(objSelect, objItemText) {
    for (var i = 0; i < objSelect.options.length; i++) {
        if (objSelect.options[i].value == objItemText) {
            objSelect.options[i].selected = true;
            break;
        }
    }
}

function FrameCloseThis() {
    if (arguments[0] || (api.pageParam.animation && api.pageParam.animation === "bottom" )) {
        api.closeFrame({
            name: api.frameName,
            animation: {
                type: "reveal",
                subType: "from_top",
                duration: 600
            }
        });
    } else {
        api.closeFrame({
            name: api.frameName
        });
    }

}

function closeToThisWin() {
    api.closeToWin({
        name: api.winName
    });
}

function openQueryFrame (frame,extra) {
  frame = frame || 'dir-query-list';
  api.openFrame({ //筛选列表
    name: frame,
    url: frame+'.html?v=' + Math.random(),
    bgColor: 'rgba(0,0,0,0)',
    reload: true,
    rect: {
      x: 0,
      y: 0,
      w: 'auto',
      h: 'auto'
    },
    animation: {
      type: 'none',
      subType: '',
      duration: 0
    },
    pageParam: {
      billName:extra.billName
    }
  });
}

function openActionFrame  (frame,extra) {
    extra = extra || {}
  api.openFrame({ //筛选列表
    name: frame,
    url: frame+'.html?v=' + Math.random(),
    bgColor: 'rgba(0,0,0,0.3)',
    reload: true,
    rect: {
      x: 0,
      y: 0,
      w: 'auto',
      h: 'auto'
    },
    animation: {
      type: 'fade',
      subType: '',
      duration: 0
    },
    pageParam: {
        param:extra.param
    }
  });
}
function closeActionFrame (frame) {
  api.closeFrame({
    name:frame
  })
}
function checksetting(callback) {
    var privacy = api.require('privacy');
    var privacyID = "";
    if (arguments.length === 1) {
        privacyID = "CAMERA";
    } else if (arguments.length === 2) {
        privacyID = arguments[1]; // "TXL  CAMERA"
    }
    if (privacyID === "CAMERA") {
        privacy.camera(function (retc, err) {
            if (!retc.status) {
                callback(0);
                return false;
            } else {
                if (retc.details === "notDetermined") {
                    callback(-1);
                    return false;
                } else {
                    callback(1);
                    return false;
                }
            }
        });
    } else if (privacyID === "TXL") {
        privacy.contacts(function (ret, err) {
            if (!ret.status) {
                callback(0);
                return false;
            } else {
                if (ret.details === "notDetermined") {
                    callback(-1);
                    return false;
                } else {
                    callback(1);
                    return false;
                }
            }
        });

    }
}


function uploadVideo(path, callback) {

    getHtmlFromServer(gConfig.API_ROOT, {
        mod: 'upload',
        action: 'index',
        t: "shipin",
        u_token: gLocalData.get("u_token"),
        _upload_file_: path
    }, 1, function (s, data, tag) {

      if (s > 0) {
            callback(data.getDataMapValueByKey("paths"));

        } else {
            callback(null);
        }

    });
}


function gotoSign() {
    var callback = null;

    var option = {};
    if (arguments.length == 1) {
        callback = arguments[0];
        option['is_upload'] = 1;
        option['type'] = 1;
    } else if (arguments.length == 2) {

        option = arguments[0];
        callback = arguments[1];
        if (option['is_upload'] === undefined) {
            option['is_upload'] = 1;
        }

        if (option['type'] === undefined) {

            option['type'] = 1;
        }

    } else {
        return false;
    }


    if (arguments.callee.index) {
        arguments.callee.index = 0;
    }
    arguments.callee.index++;
    var funrand = 'callback' + arguments.callee.index;
    arguments.callee[funrand] = function (pre, uri) {
        var backdata = {};
        backdata['pre'] = pre;
        backdata['uri'] = uri;
        backdata['url'] = pre + uri;
        if (typeof callback == "function") {
            callback(backdata);
        } else if (typeof callback == "string") {
            window[callback](backdata);
        }

    };

    changeTo("sign1", "callback=gotoSign." + funrand + "&type=" + option.type + "&window=" + api.winName + "&frame=" + api.frameName + "&is_upload=" + option.is_upload);

}

function setOnLoginListener(callback) {
    addEventListenerW("onRelogin", function () {
        callback.call();
    })
}


function unionPays(tn, callback) {
    var unPay = api.require('unionPay');
    unPay.pay({
        tn: tn.toString(),
        devMode: false
    }, function (ret, err) {
        if (ret.result == "success") {
            callback(1);
        } else if (ret.result == "fail") {
            callback(0);
        } else if (ret.result == "cancel") {
            callback(0);
        }
    });

}
/*文件存储*/
function fileWrite(file,data,fn,append) {
  data = data || '';
  api.writeFile({
    path:'fs://wims/'+file+'.text',
    data:data,
    append:append
  },function (ret) {
    fn && fn (ret);
  });
}

function fileRead(file,fn) {
  api.readFile({
    path:'fs://wims/'+file+'.text',
  },function (ret) {
    fn && fn(ret)
  });
}
function fileReadSync(file) {
  var data = api.readFile({
    sync: true,
    path:'fs://wims/'+file+'.text'
  });
  return data;
}
/*文件存储 结束*/


/*业务逻辑*/

Vue.prototype.setFieldValue = function (rootField,value,index,subField) {
  //设置字段值
  if (index && index >= 0) {
    this.$set(this[rootField][index-0],subField,value);
  } else {
    if (subField) {
      this.$set(this[rootField],subField,value);
    } else {
      rootField && (this[rootField] = value);
    }
  }
}

Vue.prototype.checkTwoDates = function (startDate, endDate,extra,callback) {
  var s = new Date(startDate) - 0, e = new Date(endDate) - 0;
  var startStr = '开始日期',
    endStr = '截止日期',
    rootField = '',
    index = -1,
    subField = '' ;
  if (extra) {
     startStr = extra.startStr || '开始日期';
     endStr = extra.endStr || '截止日期';
     rootField = extra.rootField || '';
     index = extra.index || -1;
     subField = extra.subField || '';
  }
  
  var msg = '';
  msg = startStr + '不能大于' + endStr;
  if (e < s) {
    windowToast(msg);
    this.setFieldValue(rootField,'',index,subField)
  } else {
    callback && callback();
  }
  return e >= s;
  // checkTwoDates.call(this,startDate, endDate,null,null,callback)
}
/*字段值是否存在[{arrFiled:value}]若存在则返回满足要求的字段属性值数组*/
// isInList(valueItem[fieldItem.sFieldNameEx],'sEnumCode',enumSetting.enumData[fieldItem.sFieldNameEx],'sEnumValue',enumSetting.desFormat);
function isInList (value,arrFiled,arr,retValueField,desFormat) {
  //字段值  字段属性数组 要检测的数组 返回的字段属性
  if (arr.length  === 0) { return false;}
  var realValue;
  var valueArr = value.split('|');
  var retArr = [];
  
  var f = false;
  if (valueArr.length === 1) {
    realValue = valueArr[0];
    for ( var index = 0; index < arr.length; index ++ ) {
      if (arr[index][arrFiled].toLowerCase() === realValue.toLowerCase()) {
        retArr.push(arr[index][retValueField]);
        break;
      }
      
    }
  } else if (valueArr.length > 1) { //多枚举
    valueArr.forEach(function(val,i) {
      for ( var index = 0; index < arr.length; index ++ ) {
        if (arr[index][arrFiled] === val) {
          retArr.push (arr[index][retValueField]);
          return true;
        }
      }
    });
  }
  f = {text:retArr,value:value} || f;
  return f;
}


/*获取参照数据*/
Vue.prototype.getReference = function (billName,ItemName,sValue,headData,callback,catchError,extra) {
  var t = this;
  if (extra) {
    var sReferRule = extra.sReferRule || '';
  }
  var referencePost = {
    cFunName:'MobileOnHeadRefer',
    paramJson:{"BillName":billName,"ItemName":ItemName,"sValue":sValue,"sHeadData":JSON.stringify(headData),"sReferRule":sReferRule},
    loginInfo:gLocalData.get('loginInfo')
  };
  this.getPostData(referencePost,function (ret) {
    callback && callback(ret);
  },null,null,{catchError:catchError})
};
/*响应blur事件*/
Vue.prototype.getBlurEvent = function (billName,ItemName,sValue,headData,callback) {
  var t = this;
  var referencePost = {
    cFunName:'MobileOnHeadCellCheck',
    paramJson:{"BillName":billName,"ItemName":ItemName,"sValue":sValue,"sHeadData":JSON.stringify(headData)},
    //单据名称 该项名称 该项值 所在数据
    loginInfo:gLocalData.get('loginInfo')
  };
  this.getPostData(referencePost,function (ret) {
    callback && callback(ret);
  })
};
Vue.prototype.getClickEvent = function (BillName,ColName,headData,bYesOrNo ,callback) {
  var t = this;
  var referencePost = {
    cFunName:'MobileOnHeadCommand',
    paramJson:{"BillName":BillName,"ColName":ColName,"sHeadData":JSON.stringify(headData),"bYesOrNo":bYesOrNo},
    loginInfo:gLocalData.get('loginInfo')
  };
  this.getPostData(referencePost,function (ret) {
    callback && callback(ret);
  })
};

/*获取枚举*/
Vue.prototype.getEnumData = function (enumName,callback,extra) {
  var t = this;
  //获取枚举数据
  var enumPost = {
    cFunName: 'MobileApproveEnum',
    paramJson: {"sEnumRuleName": enumName},
    loginInfo: gLocalData.get('loginInfo')
  };
  this.getPostData(enumPost, function (ret) {
    ret = formatEnumArr(ret);
    callback && callback(ret);
  },extra);
};

/*检测返回数据只有一条时 将ds转化成数组*/
function converseDs (ret,rootField,subField) {
  rootField =  rootField || 'NewDataSet';
  subField =  subField || 'ds';
  if (! (ret  && ret[rootField] && ret[rootField][subField])) {
    return false;
  }
  if (ret && ret[rootField] && ret[rootField][subField] && !(ret[rootField][subField] instanceof Array)) {
    ret[rootField][subField] = [ret[rootField][subField]]
  }
  return ret[rootField][subField];
}

/*整理枚举数据使其成为一维数组*/
function formatEnumArr ( arr ) {
  var enumArr = [];
  arr && arr.length && (enumArr = arr.map(function (val) {
    return val.ds;
  }));
  return enumArr;
}

/*展示用数据中的日期 枚举 布尔 浮点数等等*/
Vue.prototype.formatFieldType = function (fields,values,type,extra,index) {
  //type=1 表头 type=2 表体
  //字段特殊类型处理
  //日期数据转化
  //枚举
  //精度去0
  //布尔值转换
  var t = this;
  var result = null;
  //获取本地枚举数据
  if ( !gLocalData.get('enumData') ) {
    gLocalData.push('enumData',{})
  }
  var enumSetting = {};
  enumSetting.enumData = JSON.parse(gLocalData.get('enumData'));
  enumSetting.bind =  (extra && extra.WSEnum) ? extra.WSEnum : undefined;
  enumSetting.desFormat = (extra && extra.desFormat) ? extra.desFormat : undefined;
  if (type === 1) {
    fields && fields.length && fields.forEach(function (field,index) {
      switchFieldType(t,enumSetting,field,values,null);
    });
    result = values;
  }
  if (type === 2) {
      var a ;
    fields && fields.length && fields.forEach(function (field) {
      switchFieldType (t,enumSetting,field,values[0],0,values);
    });
    result = values;
  }
  return result;
};
function switchFieldType (vm,enumSetting,fieldItem,valueItem,index,valueArr) {
  if (valueItem && (valueItem[fieldItem.sFieldNameEx] === undefined)) { //处理多表体字段显示混乱
  
      if ( (index || index === 0) && (index < valueArr.length - 1)) {
        index++;
        switchFieldType (vm,enumSetting,fieldItem,valueArr[index],index,valueArr);
      }
      return false;
    }
  
  if (fieldItem.sDataType === 'WSEnum' ) { //&& fieldItem.sEnumRuleName
    // 处理表体枚举显示
    if ( !enumSetting.enumData[fieldItem.sFieldNameEx] ) {
      // if (valueItem[fieldItem.sFieldNameEx]) { //body的value为空时不去获取枚举
      (!fieldItem.sEnumRuleName) && (fieldItem.sEnumRuleName = ''); // sEnumRuleName未配置时 默认取空字符串
      vm.getEnumData(fieldItem.sEnumRuleName,function (ret) {
        /*增加默认项*/
        var defaultOption = ret[0]?JSON.parse(JSON.stringify(ret[0])):{};
        for (var attr in defaultOption) {
          if (attr === 'sEnumCode') {
            defaultOption[attr] = '';
          } else if (attr === 'sEnumValue') {
            defaultOption[attr] = '';
          }else {
            defaultOption[attr] = '';
          }
        }
        ret.unshift(defaultOption);
        enumSetting.enumData[fieldItem.sFieldNameEx] = ret;
        gLocalData.push('enumData',enumSetting.enumData); //存储枚举信息
        if (enumSetting.bind) { //绑定至select
          var fieldIndex = index;
          var enumArrName = fieldItem.sFieldNameEx + 'Arr';
          vm.$set(vm['enumArr'],enumArrName,ret);//不能更改实例根元素 以enumArr属性替换之
        } else {
          var val = isInList(valueItem[fieldItem.sFieldNameEx],'sEnumCode',ret,'sEnumValue');
          if ( val ){
            if (val.sEnumCode === '') {
              valueItem[fieldItem.sFieldNameEx] = '';
              return false;
            }
            valueItem[fieldItem.sFieldNameEx] = val.text.join('|');
            
          }
        }
        if ( (index || index === 0) && (index < valueArr.length - 1)) {
          index++;
          switchFieldType (vm,enumSetting,fieldItem,valueArr[index],index,valueArr);
        }
      })
      // }
    } else { //本地存在枚举数据时 直接从本地获取
      if (enumSetting.bind) { //绑定至select
        var fieldIndex = index;
        var enumArrName = fieldItem.sFieldNameEx + 'Arr';
        vm.$set(vm['enumArr'],enumArrName,enumSetting.enumData[fieldItem.sFieldNameEx]);
      } else {
        var valStorage;
          if (enumSetting.desFormat) {
            valStorage = isInList(valueItem[fieldItem.sFieldNameEx],'sEnumValue',enumSetting.enumData[fieldItem.sFieldNameEx],'sEnumCode',enumSetting.desFormat);
          } else {
            valStorage = isInList(valueItem[fieldItem.sFieldNameEx],'sEnumCode',enumSetting.enumData[fieldItem.sFieldNameEx],'sEnumValue');
          }
        if ( valStorage ){ //仅展示
         
          valueItem[fieldItem.sFieldNameEx] = valStorage.text.join('|'); //返回新的valueItem以便追加数据
        }
      }
      if ( (index || index === 0) && (index < valueArr.length - 1)) {
        index ++ ;
        switchFieldType (vm,enumSetting,fieldItem,valueArr[index],index,valueArr);
      }
    }
  } else {
      if (fieldItem.sDataType === 'WSDatetime') {
        valueItem[fieldItem.sFieldNameEx] =  formatDateTimeForComponent('date_time',1,valueItem[fieldItem.sFieldNameEx]);
      } else if (valueItem &&fieldItem.sDataType === 'WSDecimal') {
        valueItem[fieldItem.sFieldNameEx] = (valueItem[fieldItem.sFieldNameEx] - 0).toFixed(4);
      } else if (valueItem &&  fieldItem.sDataType === 'WSBoolean') {
        if (valueItem[fieldItem.sFieldNameEx] === 'false' || valueItem[fieldItem.sFieldNameEx]-0 === 0) {
          valueItem[fieldItem.sFieldNameEx] = false;
        } else if (valueItem[fieldItem.sFieldNameEx] === 'true' || valueItem[fieldItem.sFieldNameEx]-0 === 1) {
          valueItem[fieldItem.sFieldNameEx] = true;
        }
      }
    if ( (index || index === 0) && (index < valueArr.length - 1)) {
      index ++ ;
      switchFieldType (vm,enumSetting,fieldItem,valueArr[index],index,valueArr);
    }
  }
  return valueItem;
}
/*检测IP及端口配置*/
function checkApiRoot () {
    var ip = gLocalData.get('api_ip');
    var port = gLocalData.get('api_port');
    if (ip && port) {
        return true;
    } else {
      dialogAlert('请先配置服务信息',function () {
        changeTo('set-config');
      });
      return false;
    }
}
/*检测登录*/
function checkLogin (callBack) {
  var loginInfo = gLocalData.get('loginInfo');
  if ( loginInfo) {
    return  loginInfo;
  } else {
    dialogAlert('您还没有登录，请先进行登录',function () {
      changeTo('login');
    });
    return false;
  }
}
/*退出APP 2017-12-11*/
function closeWidget (id,silent) {
  id = id || gLocalData.widgetId;
  silent = silent || false;
  api.closeWidget({
    id: id,
    silent:silent,
    retData: {
      name: 'closeWidget'
    },
    animation: {
      type: 'from_bottom',
      duration: 1000
    }
  });
}

function logOut (nochange,callback) {
  gLocalData.del('loginInfo');
  gLocalData.del('cAccName');
  gLocalData.del('user');
  callback && callback();
  if (!nochange) {
    changeTo('login');
  }
}

function clearEnumStorage() {
  gLocalData.del('enumData');
}
/*业务逻辑 结束*/

/*自定义console 20171220wwg*/
function myConsole(data,showIndex,type) {
  var str = getJson(data);
  var color = '#fff';
  if (type === 'error') color='#f00';
  var showJsonDiv = document.createElement('div');
  showJsonDiv.style.cssText = 'position:fixed;z-index:999;left: 0;right: 0;top: 0;bottom: 0;padding: 5% 3%;background:rgba(0,0,0,.8);color: '+color+';font-size: 14px;overflow: auto;';
  showJsonDiv.className = 'show-json';
  showJsonDiv.innerHTML = str;
  document.body.appendChild(showJsonDiv);
  showJsonDiv.addEventListener('click',function () {
      document.body.removeChild(showJsonDiv)
  });

  function getJson(obj, floor) {
    var enter = '</br>';
    var str = '';
    var deep = floor || 1;
    try {
      var cst = obj.constructor;

      if (cst === Number || cst === String || cst === Boolean || cst ===
        Date || cst === Function) {
        if (cst === String) {
          try { //处理JSON格式字符串
            str = getJson(JSON.parse(obj))
          } catch (e) {
            str += "'" + obj + "'";
          }
        } else {
          if (cst === Date) {
            obj = obj.toLocaleString();
          }
          str += obj;
        }

      } else {
        if (cst === Array) {
          str += '[' + enter;
          for (var i = 0; i <= obj.length - 1; i++) {
            var indexStr = showIndex ? '[' + i + ']=>' : '';
            str += getSpace(deep) + indexStr + getJson(obj[i], deep + 1) + enter;
          }
          str += getSpace(deep - 1) + ']';
        } else if (cst === Object) {
          str += '{' + enter;
          for (var key in obj) {
            str += getSpace(deep) + key + ':' + getJson(obj[key], deep + 1) + enter;
          }
          str += getSpace(deep - 1) + '}';
        }
      }
    } catch (e) {
      // 处理 null等constructor报错情况
      str += obj + '';
    }
    return str;
  }

  function getSpace(deep) { //返回空格
    var space = ' . ';
    if (deep === 0) {
      space = '';
    } else {
      for (var i = 0; i < deep - 1; i++) {
        space += ' . ';
      }
    }
    return space;
  }
}
/*报错 20171226*/
function myDebug () {
  if (gConfig.MY_DEBUG) {
    window.onerror = function (msg, url, l) {
      var error = {
        description:'页面出错',
        info:msg,
        url:url,
        line:l
      };
      myConsole(error,null,'error');
      return true;
    }
  }
}

//changeToFrame
// 20180322打开新frame
function listenOpenFrame () {
    api.addEventListener({
        name: api.winName
    }, function(ret, err){
        if (ret) {
            openFrameFromWin(ret.value.frame)
        }
    });
    
}
function sendOpenFrame (frameName) {
    if (api) {
        api.sendEvent({
            name: api.winName,
            extra: {frame:frameName}
        });
    }
    
}
function openFrameFromWin(frame,get) {
    var get = get || {};
    var option = {
        name: frame,
        url: gConfig.HTML_PRE_ROOT + frame + '.html?rs=' + Math.random(),//gConfig.HTML_PRE_ROOT+get.file+'.html?rs=' + Math.random(),
        rect: {
            x: get.x ? get.x : 0,
            y: get.y ? get.y : 0,
            w: get.w ? get.w : "auto",
            h: get.h ? get.h : api.winHeight
        },
        //scrollToTop:true,
        pageParam: get,
        bgColor: get.bgColor ? get.bgColor : "rgba(0,0,0,0.2)",
        vScrollBarEnabled: true,
        hScrollBarEnabled: true,
        animation:{
            type: "push",
            subType: "from_right",
        }
    };
    if (get.animation) {
        if (get.animation == "bottom") {
            option.animation = {
                type: "movein",
                subType: "from_bottom",
                duration: 100
            };
        } else if (get.animation == "right") {
            option.animation = {
                type: "movein",
                subType: "from_right",
            };
        }
    }
    api.openFrame(option);
    // keyBackCloseFrame()
    return true;
}

//监听安卓返回键
function preventKeyBack () {
  sendEventW('preventKeyback',{win:api.frameName})
}
function keyBackCloseWin() {
    api.addEventListener({
        name: 'keyback'
    }, function(ret, err){
        api.closeWin()  
    });
}

function keyBackCloseFrame() {
    api.addEventListener({
        name: 'keyback'
    }, function(ret, err){
        api.closeFrame()
    });
}
/*检测手势*/
function checkHandLock ( flag ) {
  var f = flag || gLocalData.get('handLock');
  f || changeTo('hand-lock');
}
/* 合并对象 */
function concatObj (oldObj,newObj,rtNew) {
    if (!oldObj) {
        return newObj;
    }
    var obj = {};
    for (var i in newObj) {
      if (newObj[i]) {
        oldObj[i] = newObj[i];
      }
    }
    if (rtNew) {
        return obj;
    } 
    return oldObj;
  }

  /*补0*/
  function fillZero (num) {
    return (num - 0 < 10) ? '0'+num  : num;
  }
  /* 设置时间日期 */
function setDateTime (setting,callBack,params) {
  var date = new Date();
  var dy = date.getFullYear(),
    dM = fillZero(date.getMonth()+1),
    dd = fillZero(date.getDate()),
    dh = fillZero( date.getHours());
  dm = fillZero( date.getMinutes()),
    ds = '00';
  var dDate = dy+'-'+dM+'-'+dd+' '+dh+':'+dm+':'+ds;
  setting = concatObj({
    type: 'date_time',
    date: dDate,
    title:'选择日期时间',
    formatType:1
  },setting);

  api.openPicker({
    type:setting.type,
    date: setting.date,
    title:setting.title
  },function(ret,err){
    var year	= ret.year;
    var month  = fillZero(ret.month);
    var day	= fillZero(ret.day);
    var hour	= fillZero(ret.hour);
    var minute = fillZero(ret.minute);
    var second = fillZero(ret.second)|| ds;
    /* var hour	= ret.hour;
    var minute = ret.minute; */
    if (isAndroid && setting.type === 'date_time') {
      //安卓不能直接获取时分秒，重新再打开一次
      api.openPicker({
        type: 'time',
        date: dDate,
        title:'选择日期时间'
      },function(ret,err){
        var hour	= fillZero(ret.hour);
        var minute = fillZero(ret.minute);
        var second = fillZero(ret.second)|| ds;
        var value = formatDateTime(setting.type,setting.formatType,year,month,day,hour,minute,second)
        callBack && callBack(value,params);
      });
    } else {
      var value = formatDateTime(setting.type,setting.formatType,year,month,day,hour,minute,second);
      callBack && callBack(value,params)
    }
  });

}

function formatDateTime(type,formatType,year,month,day,hour,minute,second) {
  //格式化时间串
  //formatType 输出字符串格式
  //1：2018-03-29 16:43:00
  //2：2018年03月29日16时43分00秒
  //3：2018/03/29 16:43:00
  var str = '',
    dateStr = '',
    timeStr = '';
  switch(formatType) {
    case 1:
      dateStr = year+'-'+month+'-'+day;
      timeStr = hour+':'+minute+':'+second;
      break;
    case 2:
      dateStr = year+'年'+month+'月'+day+'日';
      timeStr = hour+'时'+minute+'分'+second+'秒';
      break;
    case 3:
      dateStr = year+'/'+month+'/'+day;
      timeStr = hour+':'+minute+':'+second;
      break;
    default:
      str = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
      break;
  }
  if (type === 'date') {
    str = dateStr;
  } else if (type === 'time') {
    str = timeStr;
  } else {
    if (formatType == 1 || formatType == 3) {
      str = dateStr + ' ' +timeStr;
    } else {
      str = dateStr+timeStr;
    }
  }
  return str;
}
function formatDateTimeForComponent (type,formatType,date) {
  //格式化时间串
  //formatType 输出字符串格式
  //1：2018-03-29 16:43:00
  //2：2018年03月29日16时43分00秒
  //3：2018/03/29 16:43:00

  if (!date) {
    str = '';
    return str;
  } else {
    date = new Date(date);
  }
  var dy = date.getFullYear(),
    dM = fillZero(date.getMonth() + 1),
    dd = fillZero(date.getDate()),
    dh = fillZero(date.getHours());
    dm = fillZero(date.getMinutes()),
    ds = date.getSeconds() > 0 ? fillZero(date.getSeconds()) : '00';
    var dDate = dy + '-' + dM + '-' + dd + ' ' + dh + ':' + dm + ':' + ds;

  var str = '',
    dateStr = '',
    timeStr = '';
  switch(formatType) {
    case 1:
      dateStr = dy+'-'+dM+'-'+dd;
      timeStr = dh+':'+dm+':'+ds;
      break;
    case 2:
      dateStr = dy+'年'+dM+'月'+dd+'日';
      timeStr = dh+'时'+dm+'分'+ds+'秒';
      break;
    case 3:
      dateStr = dy+'/'+dM+'/'+dd;
      timeStr = dh+':'+dm+':'+ds;
      break;
    default:
      str = dy+'-'+dM+'-'+dd+' '+dh+':'+dm+':'+ds;
      break;
  }
  if (type === 'date') {
    str = dateStr;
  } else if (type === 'time') {
    str = timeStr;
  } else {
    if (formatType == 1 || formatType == 3) {
      str = dateStr + ' ' +timeStr;
    } else {
      str = dateStr+timeStr;
    }
  }
  return str;
}
/*Vue公共方法2017-11-4*/
Vue.filter('dateTimeFormat', function (value) { //C#时区格式时间转换为24小时本地时间
  if (!value) {return '';}
  var d = new Date(value);
  var dy = d.getFullYear(),
    dM = fillZero(d.getMonth()+1),
    dd = fillZero(d.getDate()),
    dh = fillZero( d.getHours());
    dm = fillZero( d.getMinutes()),
    ds = fillZero( d.getSeconds());
  var dDate = dy+'-'+dM+'-'+dd+' '+dh+':'+dm+':'+ds;
  return dDate;
});
Vue.directive('focus', { //自动获得焦点
  inserted: function (el) {
    el.focus()
  }
});
Vue.prototype.changeTo = function () {       //页面跳转
    changeTo.apply(this,arguments);
};
Vue.prototype.changeToNoHeader = function() {
    changeToNoHeader.apply(this,arguments);
};
Vue.prototype.globalParseUrl = function () {     //cmd及url解析
  globalParseUrl.apply(this,arguments);
};
Vue.prototype.globalParseUrlCheckScript = function () {     //cmd及url解析
  globalParseUrlCheckScript.apply(this,arguments);
};
Vue.prototype.getPostData = function (postobj,successFn,errorFn,apiurl,extra) { //post请求后台
  extra = extra || {};
  apiurl = apiurl || gConfig.API_ROOT;
  (!extra.noToast) && this.startLoading();
    getDataServer (postobj,successFn,errorFn,apiurl,extra)
};
Vue.prototype.getGetData = function (apiurl,postobj,successFn,errorFn,extra) { //get请求后台
  apiurl = apiurl || gConfig.API_ROOT;
  extra = extra || {};
  extra['type'] = 'get';
  this.startLoading();
  getDataServer (postobj,successFn,errorFn,apiurl,extra)
};


Vue.prototype.reload = function () { //刷新当前页面
    window.location.reload();
};

Vue.prototype.onLoadStrError = function (err,tag) { //接口报错
    this.stopLoading();
    windowToast(err.msg);
};

Vue.prototype.startLoading = function () { //开始加载动画
    startLoading.apply(this,arguments)
};
Vue.prototype.stopLoading = function () { //结束加载动画
    stopLoading();
  // $('#show_loading').hide();
};

/*手指事件
 *
 *  v-tap="vuetouch" //vuetouch为函数名，如没有参数，可直接写函数名
 *  v-longtap="{fn:vuetouch,name:'长按'}" //如果有参数以对象形式传，fn 为函数名
 *
 * */

function vueTouch(el,binding,type){
  var _this=this;
  this.obj=el;
  this.binding=binding;
  this.touchType=type;
  this.vueTouches={x:0,y:0};
  this.vueMoves=true;
  this.vueLeave=true;
  this.longTouch=true;
  this.vueCallBack=typeof(binding.value)=="object"?binding.value.fn:binding.value;
  this.obj.addEventListener("touchstart",function(e){
    _this.start(e);
  },false);
  this.obj.addEventListener("touchend",function(e){
    _this.end(e);
  },false);
  this.obj.addEventListener("touchmove",function(e){
    _this.move(e);
  },false);
}

vueTouch.prototype={
  start:function(e){
    this.vueMoves=true;
    this.vueLeave=true;
    this.longTouch=true;
    this.vueTouches={x:e.changedTouches[0].pageX,y:e.changedTouches[0].pageY};
    this.time=setTimeout(function(){
      if(this.vueLeave&&this.vueMoves){
        this.touchType=="longtap"&&this.vueCallBack(this.binding.value,e);
        this.longTouch=false;
      };
    }.bind(this),1000);
  },
  end:function(e){
    var disX=e.changedTouches[0].pageX-this.vueTouches.x;
    var disY=e.changedTouches[0].pageY-this.vueTouches.y;
    clearTimeout(this.time);
    if(Math.abs(disX)>10||Math.abs(disY)>100){
      this.touchType=="swipe"&&this.vueCallBack(this.binding.value,e);
      if(Math.abs(disX)>Math.abs(disY)){
        if(disX>10){
          this.touchType=="swiperight"&&this.vueCallBack(this.binding.value,e);
        };
        if(disX<-10){
          this.touchType=="swipeleft"&&this.vueCallBack(this.binding.value,e);
        };
      }else{
        if(disY>10){
          this.touchType=="swipedown"&&this.vueCallBack(this.binding.value,e);
        };
        if(disY<-10){
          this.touchType=="swipeup"&&this.vueCallBack(this.binding.value,e);
        };
      };
    }else{
      if(this.longTouch&&this.vueMoves){
        this.touchType=="tap"&&this.vueCallBack(this.binding.value,e);
        this.vueLeave=false
      };
    };
  },
  move:function(e){
    this.vueMoves=false;
  }
};
Vue.directive("tap",{
  bind:function(el,binding){
    new vueTouch(el,binding,"tap");
  }
});
Vue.directive("swipe",{
  bind:function(el,binding){
    new vueTouch(el,binding,"swipe");
  }
});
Vue.directive("swipeleft",{
  bind:function(el,binding){
    new vueTouch(el,binding,"swipeleft");
  }
});
Vue.directive("swiperight",{
  bind:function(el,binding){
    new vueTouch(el,binding,"swiperight");
  }
});
Vue.directive("swipedown",{
  bind:function(el,binding){
    new vueTouch(el,binding,"swipedown");
  }
});
Vue.directive("swipeup",{
  bind:function(el,binding){
    new vueTouch(el,binding,"swipeup");
  }
});
Vue.directive("longtap",{
  bind:function(el,binding){
    new vueTouch(el,binding,"longtap");
  }
});

