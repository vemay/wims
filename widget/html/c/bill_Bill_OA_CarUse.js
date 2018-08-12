var _this;
var vm;
$ready = function () {
  billVmNoBody.methods.getFeeInfo = function () {
    this.billHeadValues.fUseKM = (this.billHeadValues.fEndKM - this.billHeadValues.fStartKM).toFixed(4);
    this.billHeadValues.fMoney = (this.billHeadValues.fUseKM * (this.billHeadValues.fPrice - 0)).toFixed(4);
    this.billHeadValues.fAwardKM = (this.billHeadValues.fUseKM * (this.billHeadValues.fBonusKM - 0)).toFixed(4);
  };
  billVmNoBody.data.sReferRule = settingData.sReferRule;
  vm = new Vue(billVmNoBody)
}
