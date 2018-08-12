var _this;
var vm;
$ready = function () {
  billVmNoBody.methods.getFinishDate = function () {
    this.billHeadValues.dRealFinishDate = formatDateTimeForComponent(1,1,new Date());
  };
  vm = new Vue(billVmNoBody)
};
