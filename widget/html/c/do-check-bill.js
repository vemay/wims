$ready = function () {
  new Vue({
    el:'#app',
    data:{
      checkRet:0,
      param:{},
      approveRet:'no',
      verifyIdea:'',
      checkArr:[
        {text:'同意',val:1},
        {text:'不同意',val:2}
      ],
      logs:[]
    },
    mounted:function () {
      var setting =$_GET['setting'];
      this.param = setting.param;
      // setTitle(this.param.BillType);
      this.getCheckLog();
      frameSetbounces();
    },
    methods:{
      getCheckLog:function () {
        var t = this;
        var checkLogPost = {
          cFunName:'MobileApproveRecord',
          loginInfo:gLocalData.get('loginInfo'),
          paramJson:{
            "BillType":this.param.BillType,
            "BillCode":this.param.BillCode,
            "BillID":this.param.BillID,
            "BillName":this.param.BillName,
          }
        }
        this.getPostData(checkLogPost,function (ret) {
          for (var key in ret.ds ) {
            var Reg = /^Verify*/;
            if (Reg.test(key)) {
              t.logs.push(ret.ds[key]);
            }
          }
        })

      },
      doCheck:function () {
        var loginInfo = gLocalData.get('loginInfo');
        var doCheckPost = {
          cFunName:'MobileApprove',
          loginInfo:loginInfo,
          paramJson:{
            "BillType":this.param.BillType,
            "BillCode":this.param.BillCode,
            "BillID":this.param.BillID,
            "BillName":this.param.BillName,
            "sApproveResult":this.approveRet,
            "sVerifyIdea":this.verifyIdea
          }
        }
        this.getPostData(doCheckPost,function (ret) {
          sendEventW('refreshIndex',{});
          dialogAlert('审批完成',function(){
            setTimeout(function () {
              closeToWin('root')
            },100);
          })
        })
      },
      checkSubmit:function () {
        dialogAlert('审批完成',function(){
          closeToWin('page-index');
        })
      },
      agree:function () {
        var t = this;
        dialogConfirm('确认同意该单据',function(ret){
          if (ret.eventType === 'right') {
            t.approveRet = 'yes';
            t.doCheck();
          }
        })
      },
      refuse:function () {
        var t = this;
        dialogConfirm('确认拒绝该单据',function(ret){
          if (ret.eventType === 'right') {
            t.approveRet = 'no';
            t.doCheck();
          }
        })
      },
    }
  })
}