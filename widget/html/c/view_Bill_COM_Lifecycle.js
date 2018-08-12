$ready = function () {
  viewHandleVm.data.moreList = [ {text:'查询',fn:'to-query'}];
  viewHandleVm.methods.viewDataHandle = function (data) {
    data = data.map(function (dataValue,index) {
      for (var key in dataValue) {
        if ( /^bState_*/.test(key) ) {
          dataValue[key] = Boolean(dataValue[key]-0);
          dataValue[key+'_mark'] = true;
        }
      }
      return dataValue;
    });
    return data;
  };
  new Vue(viewHandleVm)
};