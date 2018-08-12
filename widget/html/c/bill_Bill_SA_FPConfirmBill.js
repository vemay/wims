var _this;
var vm;

$ready = function () {
  billVmNoBody.data.moreList = [
    {name:'update',text:'维护',fn:'do-update'},
    {name:'give-up',text:'放弃',fn:'do-give-up'},
    {name:'save',text:'保存',fn:'do-save'},
    {name:'cancel',text:'撤销',fn:'do-cancel'},
    {name:'delete',text:'删除',fn:'do-delete'},
    {name:'submit',text:'提交',fn:'do-submit'},
    {name:'query',text:'定位',fn:'do-query'}
  ];
  vm = new Vue(billVmNoBody)
};
