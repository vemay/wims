var vm;
$ready = function () {
  billVmNoBody.data.sReferRule = settingData.sReferRuleOutWork;
  
  vm = new Vue(billVmNoBody)
};
