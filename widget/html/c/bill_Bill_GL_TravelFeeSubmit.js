var vm;
$ready = function () {
  billVmOneBody.data['cUnitTypeArr'] = [];
  billVmOneBody.data['cTransToolsArr'] = [];
  vm = new Vue(billVmOneBody)
};
