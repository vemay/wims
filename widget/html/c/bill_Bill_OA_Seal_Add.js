var _this;
var vm;
$ready = function () {
  billVmNoBody.fileBack = false;
  billVmNoBody.methods.getFinishDate = function () {
    this.billHeadValues.dRealFinishDate = formatDateTimeForComponent(1,1,new Date());
  };
  billVmNoBody.methods.doFileBack = function (ColName,beYesOrNo) {
    //sHeadData BillName ColName bYesOrNo
    //按钮名-后台给
    //获取参照数据
    var t = this;
    t.getClickEvent(this.billName,ColName,this.billHeadValues,beYesOrNo,function (ret) {
      var initPost = {
        cFunName:'MobileLoadBillData',//MobileApproveBill
        loginInfo:gLocalData.get('loginInfo'),
        paramJson:{"BillName":t.billName,"BillID":t.billInfo.BillID}
      };
      t.getPostData(initPost,function (ret) {
        t.getBillInfo(ret);
        t.formatResponseData(ret);
        t.btnManage();
      });
    })
  };
  billVmNoBody.computed.showFileBack = function () {
    return this.billHeadValues.bYJBack && (!this.billHeadValues.dOriginalDate);
  }
  vm = new Vue(billVmNoBody)
};
