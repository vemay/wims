$ready = function () {
  new Vue({
    el:'#app',
    data:{
      filterArr:[],
      enumArr:[],
      billName:'',
      showContent:false
    },

    mounted:function () {
      var t = this;
      this.showContent = true;
      if (!(this.billName = $_GET['billName'])) {
        dialogAlert('查询项不存在',function () {
          windowCloseThis();
        })
      };
      addEventListenerW('swiperight',function (ret) {
        t.showContent = false;
      });
      this.initFilter();
    },
    methods: {

       initFilter:function () {
         //初始化筛选项
         var t = this;
         var initPost = {
           cFunName:'MobileApproveBillListFilter',
           paramJson:{"BillName":this.billName},
           loginInfo:gLocalData.get('loginInfo')
         };
         this.getPostData(initPost,function (ret) {
           t.filterArr =  ret.NewDataSet.ds;
           t.filterArr.forEach(function (val,index) {
             if (val.sDataType === 'WSEnum') {
               // if (val.value === undefined) { val.value = '';}
               // if (val.value1 === undefined) { val.value1 = '';}
               t.enumArr.push({enumName:val.sEnumRuleName,filterIndex:index});
             } else if (val.sDataType === 'WSDatetime') {

             }
           });
           t.enumArr.forEach(function (val) { //处理枚举
             t.getEnumData(val);
           })
         })
       },

       closeQuery:function () {
        api.closeFrame({
           name: 'dir-query-list'
         });
         // api.closeFrame({
         //   name: 'dir-query'
         // })
       },

      getEnumData:function (enumArg) {
         var t = this;
        //获取枚举数据
        var enumPost = {
          cFunName:'MobileApproveEnum',
          paramJson:{"sEnumRuleName":enumArg.enumName},
          loginInfo:gLocalData.get('loginInfo')
        };
        this.getPostData(enumPost,function (ret) {
          t.$set(t.filterArr[enumArg.filterIndex],'enumOptions',ret);
        })
      },
      setDate:function (tag,filterIndex) {//时间控件
        var t = this;
        var setting = {};
        setting.type = 'date_time';
        setDateTime(setting,function (val) {
          // t.testDate = val; todo...
          t.$set(t.filterArr[filterIndex],tag,val);
        });
      },
      doFilter:function () {
         //整理筛选项组合
        var t = this;
        var filter = {
          NewDataSet:{
            ds:[]
          }
        };
        //初始化空value
        this.filterArr.forEach(function (val, index) {
          if (val.value + '' === 'undefined') {val.value = '';}
          if (val.value1 + '' === 'undefined') {val.value1 = '';}
          var obj = {
            sFieldNameEx:val.sFieldNameEx,
            sFieldValue:val.value,
            sFieldValue1:val.value1
          };
          filter.NewDataSet.ds.push(obj)
        });
        sendEventW('doFilter',{
          billName:this.billName,
          filter:filter
        });
        setTimeout(function () {
          t.showContent = false;
        },0)
      },
      resetFilter:function () {
         var t = this;
         t.filterArr = t.filterArr.map(function (val,index) {
          delete val.value;
          delete val.value1;
          return val;
        });
      }

    }
  })
}