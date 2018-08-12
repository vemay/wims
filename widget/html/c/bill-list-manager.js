$ready = function () {
  new Vue({
    el:'#app',
    data:{
      /*[
        {icon:'jk-dingdan',text:'销售订单',color:'#f00',link:'bill-sale',billName:'Bill_SA_SOBill'},
        {icon:'jk-feiyong',text:'销售运杂费确认单',color:'',link:'yunzafei-confirm-bill'},
        {icon:'jk-gongxu',text:'工序完工汇报'},
        {icon:'jk-jiekuan',text:'借款单',color:'#f00',link:'bill-loan',billName:'Bill_GL_Loan'},
        {icon:'jk-chuchai',text:'差旅费报销单',color:'',link:'bill-chailvfei'},
        {icon:'jk-baoxiao',text:'费用报销单',color:'',link:'feiyong-baoxiao-bill'},
        {icon:'jk-dengji',text:'收据登记表',color:'',link:'receipt-book-bill'},
        {icon:'jk-qingjia',text:'请假条',color:'#f00',link:'bill-ask-leave',billName:'Bill_HR_AskLeaveBill'},
        {icon:'jk-renwu',text:'因公出差任务单',color:'',link:'yingong-chuchai-bill'},
        {icon:'jk-kaoqin',text:'考勤修正单'},
        {icon:'jk-linshi',text:'临时出门证',color:'',link:'temp-leave-bill'},
        {icon:'jk-car',text:'用车单',color:'#0070ff',link:'bill-use-car',billName:'Bill_OA_CarUse'},
      ],*/
      bills:[],
      clickArgs:'',
      colors:[]
    },
    mounted:function () {
      frameSetbounces();
      this.getWorkList();
      this.getIconColors();
    },
    methods:{
      getIconColors:function () {
        var danger = '#f02924';
        var primary = '#0070ff';
        var orange = '#FFA200';
        var success = '#3ea53e';
        this.colors = [primary,orange,orange,primary,primary,danger,primary,success,primary,orange,success,primary,orange,primary,primary,danger,primary,primary,primary,success];
      },
      getWorkList:function () {
        var t = this;
        var workListPost = {
          cFunName:'MobileViewList',
          paramJson:{},
          loginInfo:gLocalData.get('loginInfo')
        };
        this.getPostData(workListPost,function (ret) {
          t.bills = converseDs(ret);
          if (!t.bills) {
            windowToast('暂无相关权限');
            return false;
          }
          t.bills.map(function (val,index) {
            val.link = 'bill_' + val.BillName;
            val.iconColor = t.colors[index%t.colors.length];
            val.hidden = (val.bHidden - 0 === 1)
            return val;
          });
        })
      },
      handleClick:function(bill,index) {
        if (bill.link) {
          changeTo(bill.link,{
            title:bill.MenuName,
            billName:bill.BillName
          })
        }
      },
    }
  })
}