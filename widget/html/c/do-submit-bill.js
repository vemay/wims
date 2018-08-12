$ready = function () {
  new Vue({
    el:'#app',
    data:{
      checkRet:0,
      param:{},
      commitIdea:'',
      logs:[]
    },
    mounted:function () {
      this.param = $_GET['param'];
    },
    methods:{
      closeFrame:function () {
        closeActionFrame(api.frameName);
      },
      doSubmit:function () {
        var t = this;
        var submitPost = {
          cFunName:'MobileCommit',
          loginInfo:gLocalData.get('loginInfo'),
          paramJson:{
            "BillID":this.param.billId,
            "BillName":this.param.billName,
            "sCommitIdea":this.commitIdea
          }
        };
        this.getPostData(submitPost,function (ret) {
          var billInfo = ret[ret.length -1]?ret[ret.length -1].BillInfo:undefined;
          sendEventW('refreshBill',{
            billName:t.param.billName,
            billInfo:billInfo
          });
          dialogAlert(ret.sResult,function(){
            t.closeFrame();
          })
        })
      },
      doCancel:function () {
        this.closeFrame();
      }
    }
  })
}