var _this;
var vm;
$ready = function () {
  vm = new Vue({
    el:'#app',
    data:{
      billCode:'',
      billHandled:{},
      type:'normal',
      billData:null,
      billHeadFields:[],
      billHeadValues:[],
      billBodyFields:[],
      billBodyValues:[],
      billBodyGroup:[],

      bodyGroupTab:[
        {text:'I'},
        {text:'II'},
        {text:'III'},
        {text:'IV'},
        {text:'V'},
        {text:'VI'},
        {text:'VII'},
        {text:'VIII'},
        {text:'IX'},
        {text:'X'}
      ],
      currentTab:0,
      /*更多菜单*/
      moreList:[{text:'立即审批',fn:'do-check'}],
      moreShow:false,
      moreParams:{},
      /*更多菜单结束*/
    
      isEdit:!1,
      bill:{},
      curd:true,
      /*数据项*/
      currentPageIndex:0,
      gt:true,
      beforePageIndex:-1,
      /*数据项*/
      billName:'',
      param:{}
    },
   
    watch:{
      currentPageIndex:function () {
        this.gt = this.currentPageIndex > this.beforePageIndex;
        this.beforePageIndex = this.currentPageIndex;
      },
      isEdit:function() {
        this.handleBillData();
      }
    },
    created:function () {
      clearEnumStorage();
    },
    mounted:function () {
      var t = this;
      //页面传参
      var setting = $_GET['setting'];
      this.param = setting.param;
      //获取后台数据项组合信息
      this.getBillGroupData();
      setTitle(this.param.BillType); //单据标题名称
      this.billCode = this.param.BillCode; //单号
      // this.initBill();
      addEventListenerW('pushTodo',function (ret) {
        var extra = ret.value
        t.param.BillCode = extra.BillCode;
        t.param.BillID = extra.BillID;
        t.param.BillType = extra.BillType;
      })
    },

    methods:{
      getBillGroupData:function () {
        var t = this;
        var loginInfo = gLocalData.get('loginInfo');
        var billGroupPost = {
          cFunName:'MobileApproveBill',
          loginInfo:loginInfo,
          paramJson:this.param
        };
        this.getPostData(billGroupPost,function (ret) {
          t.billData = ret;
          // myConsole(ret)
          t.formatResponseData(ret);
        })
      },
      formatResponseData:function (ret) {
        // ret [0] 字段 ret[1] 表头数据 ret[2]表体数据 ret[3] 表体二数据 ret[4]...
        var t = this;
        // ret[0] =  converseDs(ret[0]);
        var filedData = converseDs(ret[0]);

        //表头表体字段 fields
        filedData.forEach(function (field,index) {
          if (field.sType === 'Head') {
            t.billHeadFields.push(field);
          } else if (field.sType === 'Body') {
            t.billBodyFields.push(field);
          }
        });

        //表头数据
        this.billHeadValues = ret[1].NewDataSet.ds;

        //表体组初始化
        this.billBodyGroup = ret.slice(2);
        this.bodyGroupTab = this.bodyGroupTab.splice(0,this.billBodyGroup.length-1); //todo?处理BillID
        this.getCurrentTableBody(0);
      },
      getCurrentTableBody:function (index) {
        /*获得当前表体*/
        //表体数据
        var currentRet = this.billBodyGroup[index];
        this.billBodyValues = converseDs(currentRet);
        //表头表体数据格式化
        this.billHeadValues && (this.billHeadValues = this.formatFieldType(this.billHeadFields,this.billHeadValues,1));
        this.billBodyValues && (this.billBodyValues = this.formatFieldType(this.billBodyFields,this.billBodyValues,2));
      },
  
      /*多表体tab切换*/
      changeBody:function (tab,index) {
        this.currentTab = index;
        this.getCurrentTableBody(index);
        this.currentPageIndex = 0;
      },
      /*数据项*/
      handlePage:function (index) {
        this.currentPageIndex = index;
      },

      /*数据项结束*/

      /*更多操作*/
      doCheck:function() {
        var setting = {param:this.param}
        changeTo('do-check-bill',{setting:setting,title:this.param.BillType})
      }
      /*页面类型*/
    }
  })
}
