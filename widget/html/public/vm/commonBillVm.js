/*billVm 单据通用vm*/
//无表体单据
var billName = $_GET['billName'];
var billVmNoBody = {
  el:'#app',
  data:{
    billInfo:{BillID:-1},
    sEditFlag:"", //新增/修改标记
    billCode:'',
    billData:null,
    billHeadFields:[],
    billHeadValues:[],
    billBodyFields:[],
    billBodyValues:[],
    billBodyGroup:[],
    billBodies:[],
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
    billStatus:'',
    /*更多菜单*/
    moreList:gVariable.billMoreList,
    moreShow:false,
    moreParams:{},
    /*更多菜单结束*/
    bill:{},
    curd:true, //切换单据操作
    filter:{},
    /*表数据项*/
    currentPageIndex:0,
    gt:true,
    beforePageIndex:-1,
    /*表数据项参数*/
    billName:'',
    param:{},
    enumArr:{},
  },
  computed:{
    btnIndex:function () {
      var ret = {};
      this.moreList.forEach(function() {
      
      })
    },
    billVerifyState:function () {
      return this.billInfo.cVerifyState;
    },
    editItems:function (ret) {
      //可维护数据项
      var editItems = [];
      editItems = converseDs(this.billInfo,'sEditResult')
      return editItems;
    }
  },
  watch:{
    currentPageIndex:function () {
      this.gt = this.currentPageIndex > this.beforePageIndex;
      this.beforePageIndex = this.currentPageIndex;
    },
    billStatus:{
      handler:function () {
        this.btnManage();
      },
      immediate:true
    },
  },
  created:function () {
    clearEnumStorage();
  },
  mounted:function () {
    t = this;
    this.billName = $_GET['billName'];
    this.billInfo.BillID = $_GET['billId'] || -1;
    this.initBill();
    this.listenOperation();
  },
  
  methods:{
    deleteOperation:function () {
      //删除接口操作
      var t = this;
      var initPost = {
        cFunName:'MobileDeleteBill',//MobileApproveBill
        loginInfo:gLocalData.get('loginInfo'),
        paramJson:{"BillName":this.billName,"BillID":this.billInfo.BillID}
      };
      this.getPostData(initPost,function (ret) {
        dialogAlert(ret.sResult,function () {
          t.billInfo.BillID = -1;
          t.initBill();
        })
      });
    },
    doDelete:function () {
      //点击删除动作
      var t = this;
      dialogConfirm('确认删除该数据吗？',function () {
        t.deleteOperation();
      })
    },
    
    doQuery:function () {
      //点击定位/查询动作
      var t = this;
      openQueryFrame('bill-query-list',{billName:this.billName});
      addEventListenerW('doFilter',function (ret) {
        if (ret.value.billName === t.billName) {
          t.filter = ret.value.filter;
          t.doQueryRet(ret);
        }
      });
    },
    doQueryRet:function (ret) {
      //定位/查询接口操作
      var t = this;
      t.allLoaded = false;
      var queryPost = {
        cFunName: 'MobileViewBillList',
        paramJson: {"BillName": this.billName, "svVarFilter": JSON.stringify(this.filter)},
        loginInfo: gLocalData.get('loginInfo')
      };
      this.getPostData(queryPost, function (ret) {
        if (!ret[0]) {
          dialogAlert('未找到符合要求的单据！');
          return false;
        }
        //按照初始化执行一遍
        t.getBillInfo(ret);
        t.formatResponseData(ret);
        t.billStatus = '';
        t.btnManage();
      })
    },
    getBillInfo:function (ret) {
      if (ret.length && ret[ret.length-1].BillInfo) {
        this.billInfo = ret[ret.length-1].BillInfo;
      }
    },
    listenOperation:function () {
      var t = this;
      addEventListenerW('refreshBill',function (ret) {
        if (ret.value.billName === t.billName) {
          t.billInfo = ret.value.billInfo || t.billInfo;
          t.initBill();
        }
      });
    },
    isDisabled:function (field) {
      
      //判断数据项是否可维护
      var f = true;
      if (this.billStatus === '') { return f; }
      if (this.billInfo && this.billInfo.sEditResult === undefined) {
        return false;
      }
      for ( var index = 0; index < this.editItems.length; index ++ ) {
        if (this.editItems[index].ItemName === field) {
          f = false;
          break;
        }
      }
      return f;
    },
    
    initBill:function () {
      var t = this;
      var initPost = {
        cFunName:'MobileLoadBillData',//MobileApproveBill
        loginInfo:gLocalData.get('loginInfo'),
        paramJson:{"BillName":this.billName,"BillID":this.billInfo.BillID}
      };
      this.getPostData(initPost,function (ret) {
    
        t.getBillInfo(ret);
        t.formatResponseData(ret);
        t.billStatus = '';
        t.btnManage();
  
      });
    },
    formatResponseData:function (ret) {
      // ret [0] 字段 ret[1] 表头数据 ret[2]表体数据 ret[3] 表体二数据 ret[4]...
      var t = this;
      var filedData = ret[0].NewDataSet.ds;
      //head & body fields
      filedData.forEach(function (field,index) {
        if (field.sType === 'Head') {
          t.billHeadFields.push(field);
        } else if (field.sType === 'Body') {
          t.billBodyFields.push(field);
        }
      });
      //billHeadValues
      if (ret[1] && ret[1].NewDataSet && ret[1].NewDataSet.ds) {
        this.billHeadValues = ret[1].NewDataSet.ds;
      } else {
        //无单据时 只留新增按钮
        windowToast('暂无相关单据');
        this.billInfo.cVerifyState = 2;
        this.btnManage();
      }
      
      //表体组初始化
      this.billBodyGroup = ret.slice(2);
      this.bodyGroupTab = this.bodyGroupTab.splice(0,this.billBodyGroup.length);
      this.getCurrentTableBody(0);
    },
    getCurrentTableBody:function (index) {
      /*获得当前表体*/
      //billBodyValues
      var currentRet = this.billBodyGroup[index];
      this.billBodyValues = converseDs(currentRet);
      this.formatFieldType(this.billHeadFields,this.billHeadValues,1,{WSEnum:true});
  
    },
    /*多表体tab切换*/
    changeBody:function (tab,index) {
      this.currentTab = index;
      this.getCurrentTableBody(index);
      this.currentPageIndex = 0;
    },
    
    /*表体数据项*/
    handlePage:function (index) {
      this.currentPageIndex = index;
    },
    /*表体数据项结束*/
    
    doPickData:function (val) {
      windowToast('doPickData--'+val)
    },
    doBlurData:function (ItemName,sValue) {
      var t = this;
      t.getBlurEvent(this.billName,ItemName,sValue,this.billHeadValues,function (ret) {
        t.formatResponseData(ret)
      })
    },
    doReference:function (ItemName,sValue,callback,extra) {
      //获取参照数据
      var t = this;
      t.getReference(this.billName,ItemName,sValue,this.billHeadValues,function (ret) {
        // myConsole(ret)
        t.formatResponseData(ret);
        callback && callback(t);
      },function (ret) {
        windowToast(ret.sError);
        t.billHeadValues[ItemName] = '';
      },extra)
    },
    doClickData:function (ColName,beYesOrNo,callback) {
      //按钮名-后台给
      //获取参照数据
      var t = this;
      t.getClickEvent(this.billName,ColName,this.billHeadValues,beYesOrNo,function (ret) {
        t.formatResponseData(ret);
        callback && callback(t.billHeadValues);
      })
    },
  
    btnManage:function () {
      var t = this;
      this.moreList.forEach(function (value,index) {
        switch (value.name) {
          case 'new':
              value.hide = (t.billStatus ==='new'||t.billStatus ==='update');
            break;
          case 'update':
            if (t.billStatus === 'new' || t.billStatus === 'give-up' || t.billStatus === 'update') {
              value.hide = true;
            } else {
              value.hide = (t.billInfo && (t.billInfo.bEdit-0 === 0))
                || (t.billVerifyState-0 === 2);
            }
            
            break;
          case 'give-up':
            if (t.billInfo && (t.billInfo.bEdit-0 === 1)) {
              if (t.billStatus === 'new' || t.billStatus === 'give-up' || t.billStatus === 'update') {
                value.hide = false;
              } else {
                value.hide = true;
              }
            } else {
              if (t.billStatus === 'new' || t.billStatus === 'give-up') {
                value.hide = false;
              } else {
                value.hide = true;
              }
            }
           
            if (t.billVerifyState-0 === 2) {
              value.hide = true;
            }
            break;
          case 'save':
            if (t.billInfo && (t.billInfo.bEdit-0 === 1)) {
              if (t.billStatus === 'new' || t.billStatus === 'give-up' || t.billStatus === 'update') {
                value.hide = false;
              } else {
                value.hide = true;
              }
            } else {
              if (t.billStatus === 'new' || t.billStatus === 'give-up') {
                value.hide = false;
              } else {
                value.hide = true;
              }
            }
  
            if (t.billVerifyState-0 === 2) {
              value.hide = true;
            }
            break;
          case 'cancel':
            if (t.billVerifyState-0 === 2) {
              value.hide = true;
            } else {
              if (t.billStatus === 'new' || t.billStatus === 'give-up' || t.billStatus === 'update') {
                value.hide = true;
              } else {
                value.hide = false;
              }
            }
            break;
          case 'submit':
            if (t.billVerifyState-0 === 2) {
              value.hide = true;
            } else {
              if (t.billStatus === 'new' || t.billStatus === 'give-up' || t.billStatus === 'update') {
                value.hide = true;
              } else {
                value.hide = false;
              }
            }
            break;
          case 'delete':
            if (t.billStatus === 'new' || t.billStatus === 'give-up' || t.billStatus === 'update') {
              value.hide = true;
            } else {
              if (t.billVerifyState - 0 === 0) {
                value.hide = false;
              } else {
                value.hide = true;
              }
            }
            break;
          case 'query':
            if (t.billStatus === 'new' || t.billStatus === 'give-up' || t.billStatus === 'update') {
              value.hide = true;
            } else {
              value.hide = false;
            }
            break;
          default:
            break;
        }
      })
     
    },
    /*更多操作*/
    doNew:function () {
      this.isEdit = true;
      var t = this;
      var newPost = {
        cFunName:'MobileNewBillByManual',
        loginInfo:gLocalData.get('loginInfo'),
        paramJson:{"BillName":this.billName}
      };
      this.getPostData(newPost,function (ret) {
        t.billStatus = 'new';
        t.sEditFlag = "A";
        t.formatResponseData(ret);
        t.getBillInfo(ret);
        // t.getEditItems(ret);
      })
    },
    
    doUpdate:function() {
 
      var t = this;
      
      var initPost = {
        cFunName:'MobileModifyBill',
        loginInfo:gLocalData.get('loginInfo'),
        paramJson:{"BillName":this.billName,"BillID":this.billInfo.BillID}
      };
      this.getPostData(initPost,function (ret) {
        t.sEditFlag = "M";
        t.billStatus = 'update';
        t.getBillInfo(ret);
        t.formatResponseData(ret);
        // t.getEditItems(ret);
        // myConsole(t.editItems);
      })
    },
    
    doGiveUp:function() {
      var t = this;
      dialogConfirm('确定要放弃当前操作？',function() {
        t.initBill();
      })
    },
   
    doSave:function () {
      var t = this;
      var submitPost = {
        cFunName:'MobileSaveBill',
        loginInfo:gLocalData.get('loginInfo'),
        paramJson:{"BillName":this.billName,"sHeadData":JSON.stringify(this.billHeadValues),"sEditFlag":this.sEditFlag,"BillID":this.billInfo.BillID}
      };
      this.getPostData(submitPost,function (ret) {
        t.billInfo = ret[ret.length - 1].BillInfo;
        dialogAlert('操作完成',function () {
          t.initBill();
        });
        // myConsole(ret)
      })
    },
    doCancel:function () {
      openActionFrame('do-cancel-bill',{
        param:{
          billName:this.billName,
          billId:this.billInfo.BillID
        }
      });
    },
    doSubmit:function() {
      openActionFrame('do-submit-bill',{
        param:{
          billName:this.billName,
          billId:this.billInfo.BillID
        }
      });
    },
    initBillChangeButtons:function () {
    
    },
    /*切换单据*/
    billChange:function (type) {
      var t = this;
      var submitPost = {
        cFunName:'MobileMoveBill',
        loginInfo:gLocalData.get('loginInfo'),
        paramJson:{"BillName":this.billName,"BillID":this.billInfo.BillID,"sOperateType":type}
      };
      this.getPostData(submitPost,function (ret) {
        //仿一遍初始化
        t.getBillInfo(ret);
        t.formatResponseData(ret);
        t.billStatus = '';
        t.btnManage();
      })
    }
  }
};
//单表体单据
// var billVmOneBody = {
//   el:'#app',
//   data:{
//     billInfo:{BillID:-1},
//     sEditFlag:"", //新增/修改标记
//     billCode:'',
//     billData:null,
//     billHeadFields:[],
//     billHeadValues:[],
//     billBodyFields:[],
//     billBodyValues:[],
//     billBodyGroup:[],
//     billBodies:[],
//     bodyGroupTab:[
//       {text:'I'},
//       {text:'II'},
//       {text:'III'},
//       {text:'IV'},
//       {text:'V'},
//       {text:'VI'},
//       {text:'VII'},
//       {text:'VIII'},
//       {text:'IX'},
//       {text:'X'}
//     ],
//     currentTab:0,
//     billStatus:'',
//     /*更多菜单*/
//     moreList:[
//       {name:'new',text:'新增',fn:'do-new'},
//       {name:'update',text:'维护',fn:'do-update'},
//       {name:'give-up',text:'放弃',fn:'do-give-up'},
//       {name:'save',text:'保存',fn:'do-save'},
//       {name:'cancel',text:'撤销',fn:'do-cancel'},
//       {name:'submit',text:'提交',fn:'do-submit'}
//     ],
//     moreShow:false,
//     moreParams:{},
//     /*更多菜单结束*/
//     bill:{},
//     curd:true, //切换单据操作
//     /*表数据项*/
//     currentPageIndex:0,
//     gt:true,
//     beforePageIndex:-1,
//     /*表数据项参数*/
//     billName:'',
//     param:{},
//     /*枚举数组*/
//     enumArr:{
//       cBusTypeArr:[],
//       cPayTypeSAArr:[],
//       cSupplyType_SAArr:[],
//       cGYTypeArr:[],
//     },
//     /*可维护数据项*/
//     // editItems:[]
//     showPageEditBtns:!0,
//   },
//   computed:{
//     billVerifyState:function () {
//       return this.billInfo.cVerifyState;
//     },
//     editItems:function (ret) {
//       //可维护数据项
//       var editItems = [];
//       if (this.billInfo && this.billInfo.sEditResult) {
//         editItems = this.billInfo.sEditResult.ds;
//       }
//       return editItems;
//     }
//   },
//   watch:{
//     currentPageIndex:function () {
//       this.gt = this.currentPageIndex > this.beforePageIndex;
//       this.beforePageIndex = this.currentPageIndex;
//     },
//     billStatus:{
//       handler:function () {
//         if (this.billVerifyState-0 === 2) {
//           this.moreList = this.moreList.map(function(val){
//             val.hide = (val.name !== 'new');
//             return val;
//           });
//           return false;
//         }
//         if  (this.billStatus ==='new'||this.billStatus ==='update' ) {
//           //只显示放弃和保存
//           this.moreList = this.moreList.map(function(val){
//             val.hide = (val.name !== 'give-up' && val.name !== 'save');
//             return val;
//           });
//         }else {
//           this.moreList = this.moreList.map(function(val){
//             //只隐藏放弃和保存
//             val.hide = (val.name === 'give-up' || val.name === 'save') ;
//             return val;
//           });
//         }
//       },
//       immediate:true
//     },
//     billBodyValues:{
//       handler:function() {
//         this.$set(this.billBodies,this.currentTab,this.billBodyValues);
//       },
//       deep:true
//     }
//   },
//
//   mounted:function () {
//     t = this;
//     this.billName = $_GET['billName'];
//     this.initBill();
//     this.listenOperation();
//   },
//
//   methods:{
//     getBillInfo:function (ret) {
//       if (ret.length && ret[ret.length-1].BillInfo) {
//         this.billInfo = ret[ret.length-1].BillInfo;
//       }
//     },
//     listenOperation:function () {
//       var t = this;
//       addEventListenerW('refreshBill',function (ret) {
//         if (ret.value.billName === t.billName) {
//           t.billInfo = ret.value.billInfo || t.billInfo;
//           t.initBill();
//         }
//       });
//     },
//
//     isDisabled:function (field) {
//       //判断数据项是否可维护
//       var f = true;
//       if (this.billStatus === '') { return f; }
//       if (this.editItems.length  === 0) { return false;}
//       for ( var index = 0; index < this.editItems.length; index ++ ) {
//         if (this.editItems[index].ItemName === field) {
//           f = false;
//           break;
//         }
//       }
//       return f;
//     },
//
//     initBill:function () {
//       var t = this;
//       var initPost = {
//         cFunName:'MobileLoadBillData',//MobileApproveBill
//         loginInfo:gLocalData.get('loginInfo'),
//         paramJson:{"BillName":this.billName,"BillID":this.billInfo.BillID}
//       };
//       this.getPostData(initPost,function (ret) {
//         t.getBillInfo(ret);
//         t.formatResponseData(ret);
//         t.billStatus = '';
//       });
//     },
//     formatResponseData:function (ret) {
//       // ret [0] 字段 ret[1] 表头数据 ret[2]表体数据 ret[3] 表体二数据 ret[4]...
//       var t = this;
//       var filedData = ret[0].NewDataSet.ds;
//       //head & body fields
//       filedData.forEach(function (field,index) {
//         if (field.sType === 'Head') {
//           t.billHeadFields.push(field);
//         } else if (field.sType === 'Body') {
//           t.billBodyFields.push(field);
//         }
//       });
//       //billHeadValues
//       this.billHeadValues = ret[1].NewDataSet.ds;
//       //表体组初始化
//       this.billBodyGroup = ret.slice(2,-1);
//       this.bodyGroupTab = this.bodyGroupTab.splice(0,this.billBodyGroup.length);
//       this.getCurrentTableBody(0);
//     },
//     getCurrentTableBody:function (index) {
//       /*获得当前表体*/
//       //billBodyValues
//       var currentRet = this.billBodyGroup[index];
//       this.billBodyValues = converseDs(currentRet);
//       this.billHeadFields && this.formatFieldType(this.billHeadFields,this.billHeadValues,1,{WSEnum:true});
//       this.billBodyValues && this.formatFieldType(this.billBodyFields,this.billBodyValues,2,{WSEnum:true});
//     },
//     /*多表体tab切换*/
//     changeBody:function (tab,index) {
//       this.currentTab = index;
//       this.getCurrentTableBody(index);
//       this.currentPageIndex = 0;
//     },
//
//     /*表体数据项*/
//     handlePage:function (index) {
//       this.currentPageIndex = index;
//     },
//     /*表体数据项结束*/
//
//     doPickData:function (val) {
//       windowToast('doPickData--'+val)
//     },
//     doBlurData:function (ItemName,sValue) {
//       var t = this;
//       t.getBlurEvent(this.billName,ItemName,sValue,this.billHeadValues,function (ret) {
//         t.formatResponseData(ret)
//       })
//     },
//     doReference:function (ItemName,sValue,datasType) {
//       //datasType 传入总数据的类型
//       var datas = datasType ? this.billBodyValues : this.billHeadValues;
//       //获取参照数据
//       var t = this;
//       t.getReference(this.billName,ItemName,sValue,datas,function (ret) {
//         // myConsole(ret)
//         t.formatResponseData(ret)
//       })
//     },
//
//
//     /*更多操作*/
//     doNew:function () {
//       this.isEdit = true;
//       var t = this;
//       var newPost = {
//         cFunName:'MobileNewBillByManual',
//         loginInfo:gLocalData.get('loginInfo'),
//         paramJson:{"BillName":this.billName}
//       };
//       this.getPostData(newPost,function (ret) {
//         t.billStatus = 'new';
//         t.sEditFlag = "A";
//         t.formatResponseData(ret);
//         t.getBillInfo(ret);
//         t.showPageEditBtns = true;
//         t.billBodyValues = [];
//         t.addBillItem();
//
//         // t.getEditItems(ret);
//       })
//     },
//
//     doUpdate:function() {
//       var t = this;
//       this.sEditFlag = "M";
//       // this.billBodyValues = this.billBodyValues.map(function (val) {
//       //   if (val.sEditFlag !== 'D') {
//       //     val.sEditFlag = 'M'
//       //   }
//       //   return val;
//       // });
//       var initPost = {
//         cFunName:'MobileModifyBill',
//         loginInfo:gLocalData.get('loginInfo'),
//         paramJson:{"BillName":this.billName,"BillID":this.billInfo.BillID}
//       };
//       this.getPostData(initPost,function (ret) {
//         t.billStatus = 'update';
//         t.getBillInfo(ret);
//         t.formatResponseData(ret);
//         t.showPageEditBtns = true;
//
//         // t.getEditItems(ret);
//         // myConsole(t.editItems);
//       })
//     },
//
//     doGiveUp:function() {
//       var t = this;
//       dialogConfirm('确定要放弃当前操作？',function() {
//         t.initBill();
//       })
//     },
//     formatCommitStr:function (sBodyData) {
//       var str = '{';
//       sBodyData && sBodyData.forEach(function (val,index) {
//         str += 'NewDataSet:{';
//         val && val.forEach(function(v,i) {
//           str += 'ds:';
//           str += JSON.stringify(v);
//           if (i < val.length - 1) {
//             str += ','
//           }
//         })
//         str+='}'
//         if (index < sBodyData.length - 1) {
//           str += ','
//         }
//       });
//       str += '}';
//       return str;
//     },
//     doSave:function (param) {
//       var t = this;
//       var submitPost = {
//         cFunName:'MobileSaveBill',
//         loginInfo:gLocalData.get('loginInfo'),
//         paramJson:{"BillName":this.billName,"sHeadData":JSON.stringify(this.billHeadValues),
//           "sBodyData":this.formatCommitStr(this.billBodies),"sEditFlag":this.sEditFlag}
//       };
//       if (param && param.bYesOrNo) {
//         submitPost.paramJson['bYesOrNo'] = param.bYesOrNo;
//       }
//       this.getPostData(submitPost,function (ret) {
//         t.billInfo = ret[ret.length - 1].BillInfo;
//         dialogAlert('操作完成',function () {
//           t.initBill();
//         });
//         // myConsole(ret)
//       },null,null,{catchError:function (ret) {
//         if (ret.bYesOrNo) {
//           dialogConfirm(ret.sError,function () {
//               t.doSave({bYesOrNo:ret.bYesOrNo})
//           })
//         } else {
//           dialogAlert(ret.sError);
//         }
//       }
//       })
//     },
//     doCancel:function () {
//       openActionFrame('do-cancel-bill',{
//         param:{
//           billName:this.billName,
//           billId:this.billInfo.BillID
//         }
//       });
//     },
//     doSubmit:function() {
//       openActionFrame('do-submit-bill',{
//         param:{
//           billName:this.billName,
//           billId:this.billInfo.BillID
//         }
//       });
//     },
//     initBillChangeButtons:function () {
//
//     },
//     /*切换单据*/
//     billChange:function (type) {
//       var t = this;
//       var submitPost = {
//         cFunName:'MobileMoveBill',
//         loginInfo:gLocalData.get('loginInfo'),
//         paramJson:{"BillName":this.billName,"BillID":this.billInfo.BillID,"sOperateType":type}
//       };
//       this.getPostData(submitPost,function (ret) {
//         t.billInfo = ret[ret.length - 1].BillInfo;
//         t.initBill();
//         // myConsole(ret)
//       })
//     },
//     /*表体数据项编辑*/
//     createBillItem:function () { //新增空数据项
//       var item = {'sEditFlag':'A'};
//       this.billBodyFields.forEach(function (value) {
//         item[value.sFieldNameEx] = '';
//       });
//       return item;
//     },
//     addBillItem:function () {
//
//       this.billBodyValues.push(this.createBillItem());
//       this.currentPageIndex = this.billBodyValues.length - 1;
//     },
//     delBillItem:function (selectItems) {
//       var _this = this;
//       _this.billBodyValues = _this.billBodyValues.map(function(val,index) {
//         selectItems.forEach(function (v,i) {
//           if (index === v.index) {
//             val.sEditFlag = 'D';
//           }
//         });
//         return val;
//       });
//     }
//   }
// }
//多表体单据