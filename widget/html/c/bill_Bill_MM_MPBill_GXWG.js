//todo HTML模板完成 待服务器配置data
var _this;
var vm;
$ready = function () {
  billVmNoBody.data.moreList = [
    {name:'submit',text:'提交',fn:'do-submit'},
    {name:'query',text:'定位',fn:'do-query'}
  ];
  vm = new Vue(billVmNoBody)
};
