$ready = function () {
  viewHandleVm.data.moreList.push({text:'确认',fn:'do-confirm'});
  new Vue(viewHandleVm)
};