var _this;
var vm;
$ready = function () {
  billVmNoBody.methods.getLeaveHours = function () {
      this.doBlurData('dEDate',this.billHeadValues.dEDate)
  }
  vm = new Vue(billVmNoBody)
};
