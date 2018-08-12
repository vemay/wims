$ready = function () {
  new Vue({
    el:'#app',
    data:{
      loginInfo:'',
      macAddress:api.deviceId,
      userName:'',
      pwd:'',
      loginDate:'2018-01-01',
      account:{},
      // accountId:'',
      accountList:[],
      Nv:null,
      ddd:'2018-11-11',
      fff:'',
      calendar:null
    },
    computed:{
      accountId:function () {
        return this.account.cAccID;
      },
      accountName:function () {
        return this.account.cAccName;
      }
    },
    mounted:function() {
      // checkHandLock();
      // setHeadRightBtn();
      var t = this;
      this.macAddress = api.deviceId;
      this.initDate();
      // this.initAccount();
      setHeadLeftBtnNone();
      addEventListenerW('reloadLogin',function () {
        t.reload();
      })
      /*登录日期*/
      // this.calendar = new lCalendar();
      // this.calendar.init({
      //   'trigger': '#login-date',
      //   'type': 'date',
      // });
    },
    methods:{
      initDate:function () {
        var d = new Date ();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var str = year + '-' + fillZero(month) + '-' + fillZero(day);
        this.loginDate = str;
      },
      // setDateTime:function(ret) {
      //   // var t = this;
      //   // var setting = {};
      //   // setting.type = 'date';
      //   // setDateTime(setting,function (value) {
      //   //   t.loginDate = value;
      //   // });
      // },
      initAccount:function () { //初始化账套
        var t = this;
        var initAccountPost = {
          cFunName:'MobileGetAllAcc',
          paramJson:{},
          loginInfo:''
        };
        this.getPostData(initAccountPost,function (ret) {
          t.accountList = ret;
          (ret.length > 0) && (t.account = ret[0]);
        })
        // (this.accountList.length > 0) && (this.accountId = this.accountList[0]['cAccID']);
      },
      getAccount:function () {
        // 获取账套 MobileGetUserAcc
        var t = this;
        t.account = {};
        t.accountList = '';
        var accountPost = {
          cFunName:'MobileGetUserAcc',
          paramJson:{
            strOperatorID:this.userName
          },
          loginInfo:''
        };
        this.getPostData(accountPost,function (ret) {
          t.accountList = ret;
          (ret.length > 0) && (t.account = ret[0]);
        })
      },
      doLogin:function () {
        var t = this;
        if (!this.accountId) {
          windowToast('请选择账套');
          return false;
        }
        var loginPost = {
          cFunName:'MobileLogin',
          paramJson:{
            strOperatorID:this.userName,
            strPassword:this.pwd,
            strAccountID:this.accountId,
            strOperateDate:this.loginDate,
            strMacAddress:this.macAddress,
            ClientGUID:api.deviceId
          },
          loginInfo:''
        };
        this.getPostData(loginPost,function (ret) {
          t.saveLoginInfo(ret);
          // changeToNoHeader('page-index');
        },function (err) {
          windowToast(err.msg)
        });
      },
      saveLoginInfo:function (ret) {
        gLocalData.push('cAccName',this.accountName);
        gLocalData.push('loginInfo',ret.strEncryptLoginInfo);
        gLocalData.push('user',ret.dicPerson[ret.strAccountID] || ret);
        // gLocalData.push('loginInfo',ret.Token);
        //gLocalData.push('loginInfo',ret);
        // gLocalData.push('cDepName',this.accountList[this.accountId]);
        sendEventW('refreshIndex');
        windowCloseThis();
      },
      loginOut:function () {
        gLocalData.del('loginInfo');
        gLocalData.del('cAccName');
        gLocalData.del('user');
        changeTo('login')
      }

    }
  })
}

