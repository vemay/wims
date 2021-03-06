$ready = function () {
  new Vue({
    el:'#app',
    data:{
      bills:[],
      colors:''
    },
    mounted:function () {
      frameSetbounces();
      this.getIconColors();
      this.getViewBoardList();
    },
    methods:{
      getIconColors:function () {
        var danger = '#f02924';
        var primary = '#0070ff';
        var orange = '#FFA200';
        var success = '#3ea53e';
        this.colors = [primary,orange,orange,primary,primary,danger,primary,success,primary,orange,success,primary,orange,primary,primary,danger,primary,primary,primary,success];
      },
      getViewBoardList:function () {
        var t = this;
        var baseInfoListPost = {
          cFunName:'MobileDirectoryList',
          paramJson:{},
          loginInfo:gLocalData.get('loginInfo')
        };
        this.getPostData(baseInfoListPost,function (ret) {
          t.bills = converseDs(ret);
          if (!t.bills) {
            windowToast('暂无相关权限');
            return false;
          }
          t.bills.map(function (val,index) {
            val.link = 'base-info-dir';/*val.BillName*/
            val.iconColor = val.IconColor || t.colors[(index%t.colors.length) + 3];
            val.hidden = (val.bHidden - 0 === 1)
            return val;
          });
        })
      },
      clickBill:function (bill) {
        if (bill.link) {
          changeTo(bill.link,{
            title:bill.MenuName,
            billName:bill.BillName,
            titleField:bill.titleField
          });
        }
      }
    }
  })
}