$ready = function () {
  new Vue({
    el:'#app',
    data:{
      checkRet:0,
      param:{},
      approveRet:'no',
      verifyIdea:'',
      checkList:[
        {accountName:'冀凯信息'},
        {accountName:'冀凯科技'},
        {accountName:'河北铸业'},
      ],
      logs:[]
    },
    mounted:function () {
      this.param = $_GET['param'];
      // setTitle(this.param.BillType);
      // this.getCheckLog();
      // this.GetCommittedGroCode();
    },
    methods:{
      doRevoke:function (item) {
        var t = this;
        dialogConfirm('切换账套至--'+item.accountName,function () {
          t.revokeItem(item);
        })
      },
      revokeItem:function (item) {
        var t = this;
        var revokePost = {
          cFunName:'MobileRevokeCommittedGroCode',
          loginInfo:gLocalData.get('loginInfo'),
          paramJson:{
            "BillID":this.param.billId,
            "BillName":this.param.billName,
            "cItemGroCode":item.cItemGroCode
          }
        };
        this.getPostData(revokePost,function (ret) {
          var billInfo = ret[ret.length - 1].BillInfo;
          dialogAlert('撤销完成',function () {
            sendEventW('refreshBill',{
              billName:t.param.billName,
              billInfo:billInfo
            });
            t.closeFrame();
          })
          
        })
      },
      closeFrame:function () {
        closeActionFrame(api.frameName);
      },
      GetCommittedGroCode:function () {
        var t = this;
        var checkLogPost = {
          cFunName:'MobileGetCommittedGroCode',
          loginInfo:gLocalData.get('loginInfo'),
          paramJson:{
            "BillID":this.param.billId,
            "BillName":this.param.billName,
          }
        }
        
        this.getPostData(checkLogPost,function (ret) {
          //[{"ds":{"cItemGroCode":"1-1","cItemGroName":"1-1请假信息"}},{"ds":{"cItemGroCode":"2-1","cItemGroName":"2-1"}},{"ds":{"cItemGroCode":"3-1","cItemGroName":"3-1"}}]
          t.checkList = ret.map(function(val) {
            return val.ds;
          })
        })
      }
    }
  })
}